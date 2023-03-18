import {
  createExposedThingFromThingDescription,
  getOppositeSmartPlugState,
  IExposedThing,
  ISmartPlugConfig,
  ISmartPlugConsumption,
  ISmartPlugConsumptionHistory,
  ISmartPlugState,
  IWoT,
  SMART_PLUG_TD,
} from '@thingmate/wot-scripting-api';
import { Abortable, AsyncTask } from '@lirx/async-task';
import { IGet$Appliance$Control$ConsumptionX$Response } from './classes/abilities/appliance.control.consumption-x';
import { IGet$Appliance$Control$Electricity$Response } from './classes/abilities/appliance.control.electricity';
import { IGet$Appliance$Control$ToggleX$Response } from './classes/abilities/appliance.control.toggle-x';
import { MerossCloudDevice } from './classes/meross-cloud-device.class';
import { IElectricityConsumption } from './classes/meross-cloud-device.types';
import { STATE } from './classes/state.enum';

function merossSmartPlugStateToStandardState(
  state: STATE,
): ISmartPlugState {
  return (state === STATE.ON)
    ? 'on'
    : 'off';
}

function standardSmartPlugStateToMerossState(
  state: ISmartPlugState,
): STATE {
  return (state === 'on')
    ? STATE.ON
    : STATE.OFF;
}

export function createMerossSmartPlugExposedThing(
  WoT: IWoT,
  device: MerossCloudDevice,
  abortable: Abortable,
  channel: number = 0,
): AsyncTask<IExposedThing<ISmartPlugConfig>> {
  return createExposedThingFromThingDescription<ISmartPlugConfig>(WoT, {
    // id: device.definition.uuid,
    id: `urn:uuid:${device.definition.uuid}`,
    title: device.definition.uuid,
    description: `Meross smart plug`,
    name: device.definition.devName,
    ...SMART_PLUG_TD,
  }, { abortable })
    .successful((thing: IExposedThing<ISmartPlugConfig>): IExposedThing<ISmartPlugConfig> => {

      const readState = (): Promise<ISmartPlugState> => {
        return device.get$Appliance$Control$ToggleX({
          togglex: { channel },
        })
          .then((response: IGet$Appliance$Control$ToggleX$Response): ISmartPlugState => {
            return merossSmartPlugStateToStandardState(response.togglex.onoff);
          });
      };

      const writeState = (
        state: ISmartPlugState,
        emitChange: () => void,
      ): Promise<void> => {
        return device.set$Appliance$Control$ToggleX({
          togglex: {
            channel,
            onoff: standardSmartPlugStateToMerossState(state),
          },
        })
          .then(emitChange);
      };

      const readConsumption = (): Promise<ISmartPlugConsumption> => {
        return device.get$Appliance$Control$Electricity()
          .then((response: IGet$Appliance$Control$Electricity$Response): ISmartPlugConsumption => {
            const {
              current,
              voltage,
              power,
            } = response.electricity;
            return {
              current: current / 1000,
              voltage: voltage / 10,
              power: power / 100,
            };
          });
      };

      const readConsumptionHistory = (): Promise<ISmartPlugConsumptionHistory[]> => {
        return device.get$Appliance$Control$ConsumptionX()
          .then((response: IGet$Appliance$Control$ConsumptionX$Response): ISmartPlugConsumptionHistory[] => {
            return response.consumptionx.map(({ date, value }: IElectricityConsumption): ISmartPlugConsumptionHistory => {
              const start: number = Date.parse(date);
              const _start: Date = new Date(start);
              const end: number = new Date(_start.getFullYear(), _start.getMonth(), _start.getDate() + 1).getTime();

              return {
                power: value,
                start,
                end,
              };
            });
          });
      };

      /* STATE */
      const stateProperty = thing.getProperty('state');

      stateProperty.onRead(readState);
      stateProperty.onWrite((state: ISmartPlugState): Promise<void> => {
        return writeState(state, stateProperty.emitChange);
      });

      /* CONSUMPTION */
      const consumptionProperty = thing.getProperty('consumption');
      consumptionProperty.onRead(readConsumption);

      /* CONSUMPTION HISTORY */
      const consumptionHistoryProperty = thing.getProperty('consumptionHistory');
      consumptionHistoryProperty.onRead(readConsumptionHistory);

      /* TOGGLE */
      const toggleAction = thing.getAction('toggle');
      toggleAction.onInvoke((state?: ISmartPlugState): Promise<ISmartPlugState> => {
        const getState = (): Promise<ISmartPlugState> => {
          return (state === void 0)
            ? readState()
              .then(getOppositeSmartPlugState)
            : Promise.resolve(state);
        };

        return getState()
          .then((state: ISmartPlugState): Promise<ISmartPlugState> => {
            return writeState(state, thing.getProperty('state').emitChange)
              .then((): ISmartPlugState => {
                return state;
              });
          });
      });

      return thing;
    });
}
