import { IPromiseLikeOrValue } from '@lirx/promise';
import { createExposedThingFromThingDescription, IExposedThing, IWoT } from '@thingmate/wot-scripting-api';
import {
  IExposedThingProperty,
} from '@thingmate/wot-scripting-api/src/wot/exposed-thing/components/property/esposed-thing-property.trait-collection';
import { CloudOptions } from 'meross-cloud';
import { PropertyElement } from 'wot-thing-description-types';
import { DataSchemaValue, ExposedThingInit } from 'wot-typescript-definitions';
import { MerossCloudDevice } from '../gateways/meross/classes/meross-cloud-device.class';
import { MerossCloud } from '../gateways/meross/classes/meross-cloud.class';
import { STATE } from '../gateways/meross/classes/state.enum';
import { log } from '../misc/log';

interface IOnProducedFunction {
  (
    thing: IExposedThing,
  ): IPromiseLikeOrValue<void>;
}

export interface IAddPropertyHandler<GValue extends DataSchemaValue> {
  (
    property: IExposedThingProperty<GValue>,
  ): IPromiseLikeOrValue<void>;
}

export class ExposedThingBuilder {
  readonly td: ExposedThingInit;

  private readonly _onProduced: IOnProducedFunction[];

  constructor(
    td: ExposedThingInit = {},
  ) {
    this.td = td;
    this._onProduced = [];
  }

  addProperty<GValue extends DataSchemaValue>(
    name: string,
    options: DeepPartial<PropertyElement>,
    handler: IAddPropertyHandler<GValue>,
  ): void {
    if (this.td.properties === void 0) {
      this.td.properties = {};
    }

    if (name in this.td.properties) {
      throw new Error(`Property already registered`);
    } else {
      this.td.properties[name] = options;
      this._onProduced.push((thing: IExposedThing): IPromiseLikeOrValue<void> => {
        return handler(thing.getProperty(name));
      });
    }
  }

  produce(
    WoT: IWoT,
  ): Promise<IExposedThing> {
    return createExposedThingFromThingDescription(WoT, this.td)
      .then((thing: IExposedThing): Promise<IExposedThing> => {
        return Promise.all(
          this._onProduced.map((callback: IOnProducedFunction): IPromiseLikeOrValue<void> => {
            return callback(thing);
          }),
        )
          .then((): IExposedThing => {
            return thing;
          });
      });
  }
}


export function createExposedThingBuilder(
  td?: ExposedThingInit,
): ExposedThingBuilder {
  return new ExposedThingBuilder(td);
}



export async function createExposedThingForMerossMSS310(
  WoT: IWoT,
  device: MerossCloudDevice,
): Promise<IExposedThing> {

  const builder = createExposedThingBuilder({
    // id: device.definition.uuid,
    id: `urn:uuid:${device.definition.uuid}`,
    title: device.definition.devName,
    description: `Meross smart plug`,
  });

  builder.addProperty<number>(
    'channels',
    {
      type: 'integer',
      readOnly: true,
    },
    (property: IExposedThingProperty<number>): void => {
      property.onRead(() => {
        return device.definition.channels.length;
      });
    },
  );

  return builder.produce(WoT);

  //
  // for (let i = 0; i < device.definition.channels.length; i++) {
  //   properties[`on-off-${i}`];
  // }
  //
  // return createExposedThingFromThingDescription(WoT, td)
  //   .then((thing: IExposedThing): IExposedThing => {
  //
  //     const channelsProperty = thing.getProperty('channels');
  //
  //     return thing;
  //   });
}

export async function debugMerossThing(WoT: IWoT) {
  const options: CloudOptions = {
    email: 'inscriptions@valentin-richard.com',
    password: 'lifaon74',
    logger: console.log,
    localHttpFirst: true, // Try to contact the devices locally before trying the cloud
    onlyLocalForGet: true, // When trying locally, do not try the cloud for GET requests at all
    timeout: 3000, // Default is 3000
  } satisfies CloudOptions;

  const meross = new MerossCloud(options);

  meross.deviceInitialized$((device: MerossCloudDevice): void => {
    console.log(`New device ${device.definition.uuid}:`);

    if (device.definition.uuid === '19011048496979251h0234298f149604') {
      return;
    }

    console.log(device.definition);


    device.connected$(async () => {
      if (await device.isOnline()) {
        console.log(`Device ${device.definition.uuid} connected`);

        const thing = await createExposedThingForMerossMSS310(WoT, device);
        await thing.expose();

        // log(thing.getDescription());

        // log(await device.get$Appliance$System$Ability());
        log(await device.get$Appliance$System$All());
        // log(await device.publishMessage('GET', 'Appliance.System.All' as any, {}));

        // log(await device.get$Appliance$Control$Electricity());
        // log(await device.get$Appliance$Control$ConsumptionConfig());
        // log(await device.get$Appliance$Control$ConsumptionX());

        // await device.get$Appliance$Control$ToggleX({
        //   togglex: { channel: 0 },
        // });
        //
        await device.set$Appliance$Control$ToggleX({
          togglex: {
            channel: 0,
            onoff: STATE.OFF,
          },
        });

        // log(await device.get$Appliance$Control$ToggleX({
        //   togglex: { channel: 0 }
        // }));

        // log(await device.getSystemAllData());
        // log(await device.publishMessage('GET', 'Appliance.System.Hardware', {}));
        // log(await device.publishMessage('GET', 'Appliance.Control.ToggleX', {"togglex": {"channel": 0 }}));

        // device.controlToggleX(0, false, () => {
        //   console.log('ok');
        // });
      }
    });
  });

  await meross.connect();
  console.log('connected to the cloud server');
}
