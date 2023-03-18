import { IObservable } from '@lirx/core';
import { type DeviceDefinition, type MerossCloudDevice as MerossCloudDeviceLegacy } from 'meross-cloud';
import { promisify } from 'util';
import { fromBasicNodeJSEventEmitter } from '../../../misc/from-node-js-event-emitter';
import { IAbilities } from './abilities/abilities.type';
import { IGet$Appliance$Control$ConsumptionConfig$Response } from './abilities/appliance.control.consumption-config';
import { IGet$Appliance$Control$ConsumptionX$Response } from './abilities/appliance.control.consumption-x';
import { IGet$Appliance$Control$Electricity$Response } from './abilities/appliance.control.electricity';
import {
  IGet$Appliance$Control$ToggleX$Request,
  IGet$Appliance$Control$ToggleX$Response,
  ISet$Appliance$Control$ToggleX$Request,
  ISet$Appliance$Control$ToggleX$Response,
} from './abilities/appliance.control.toggle-x';
import { IGet$Appliance$System$Ability$Response } from './abilities/appliance.system.ability.type';
import { IGet$Appliance$System$All$Response } from './abilities/appliance.system.all.type';
import { IGet$Appliance$System$Firmware$Response } from './abilities/appliance.system.firmware.type';
import { IDeviceAbilities } from './meross-cloud-device.types';

export type IPublishMessageMethod =
  | 'GET'
  | 'SET'
  ;

export class MerossCloudDevice {
  readonly definition: DeviceDefinition;
  readonly connected$: IObservable<void>;
  readonly close$: IObservable<any>;
  readonly error$: IObservable<any>;
  readonly reconnect$: IObservable<any>;
  readonly data$: IObservable<any>;

  private readonly _instance: MerossCloudDeviceLegacy;

  private readonly _publishMessage: (
    method: IPublishMessageMethod,
    namespace: string,
    payload: any,
  ) => Promise<any>;

  constructor(
    definition: DeviceDefinition,
    instance: MerossCloudDeviceLegacy,
  ) {
    this.definition = definition;
    this.connected$ = fromBasicNodeJSEventEmitter<void>(instance, 'connected');
    this.close$ = fromBasicNodeJSEventEmitter<any>(instance, 'close');
    this.error$ = fromBasicNodeJSEventEmitter<void>(instance, 'error');
    this.reconnect$ = fromBasicNodeJSEventEmitter<void>(instance, 'reconnect');
    this.data$ = fromBasicNodeJSEventEmitter<void>(instance, 'data');
    // device.on('data', (namespace, payload) => {
    //     console.log('DEV: ' + deviceId + ' ' + namespace + ' - data: ' + JSON.stringify(payload));
    // });

    this._instance = instance;

    this._publishMessage = promisify(instance.publishMessage.bind(instance));
  }

  init(): Promise<IDeviceAbilities> {
    return this.get$Appliance$System$Firmware()
      .then((response: IGet$Appliance$System$Firmware$Response) => {
        this._instance.setKnownLocalIp(response.firmware.innerIp);
        (this._instance as any).cloudInst.onlyLocalForGet = true;

        return this.get$Appliance$System$Ability()
          .catch(() => {
            this._instance.removeKnownLocalIp();
            (this._instance as any).cloudInst.onlyLocalForGet = false;
            return this.get$Appliance$System$Ability();
          })
          .then((response: IGet$Appliance$System$Ability$Response): IDeviceAbilities => {
            return response.ability;
          });
      });
  }

  // isOnline(): Promise<boolean> {
  //   return this.get$Appliance$System$Ability()
  //     .then(
  //       () => true,
  //       () => false,
  //     );
  // }

  publishMessage<GMethod extends IPublishMessageMethod, GAbilityName extends keyof IAbilities>(
    method: GMethod,
    name: GAbilityName,
    requestBody: IAbilities[GAbilityName][GMethod]['requestBody'],
  ): Promise<IAbilities[GAbilityName][GMethod]['responseBody']> {
    return this._publishMessage(method, name, requestBody);
  }

  setKnownLocalIp(
    ip: string,
  ): void {
    this._instance.setKnownLocalIp(ip);
  }

  /* CONFIG */

  /* SYSTEM */

  // get all data
  get$Appliance$System$All(): Promise<IGet$Appliance$System$All$Response> {
    return this.publishMessage('GET', 'Appliance.System.All', {});
  }

  get$Appliance$System$Firmware(): Promise<IGet$Appliance$System$Firmware$Response> {
    return this.publishMessage('GET', 'Appliance.System.Firmware', {});
  }

  // get abilities
  get$Appliance$System$Ability(): Promise<IGet$Appliance$System$Ability$Response> {
    return this.publishMessage('GET', 'Appliance.System.Ability', {});
  }

  // get$Appliance$System$Report(): Promise<IGet$Appliance$System$Report$Response> {
  //   return this.publishMessage('GET', 'Appliance.System.Report', {});
  // }

  /* CONTROL */

  get$Appliance$Control$ToggleX(
    requestBody: IGet$Appliance$Control$ToggleX$Request,
  ): Promise<IGet$Appliance$Control$ToggleX$Response> {
    return this.publishMessage('GET', 'Appliance.Control.ToggleX', requestBody);
  }

  set$Appliance$Control$ToggleX(
    requestBody: ISet$Appliance$Control$ToggleX$Request,
  ): Promise<ISet$Appliance$Control$ToggleX$Response> {
    return this.publishMessage('SET', 'Appliance.Control.ToggleX', requestBody);
  }

  get$Appliance$Control$ConsumptionX(): Promise<IGet$Appliance$Control$ConsumptionX$Response> {
    return this.publishMessage('GET', 'Appliance.Control.ConsumptionX', {});
  }

  get$Appliance$Control$Electricity(): Promise<IGet$Appliance$Control$Electricity$Response> {
    return this.publishMessage('GET', 'Appliance.Control.Electricity', {});
  }

  get$Appliance$Control$ConsumptionConfig(): Promise<IGet$Appliance$Control$ConsumptionConfig$Response> {
    return this.publishMessage('GET', 'Appliance.Control.ConsumptionConfig', {});
  }

  // /* DIGEST */
  //
  // get$Appliance$Digest$TriggerX(): Promise<IGet$Appliance$Digest$TriggerX$Response> {
  //   return this.publishMessage('GET', 'Appliance.Digest.TriggerX', {});
  // }
}
