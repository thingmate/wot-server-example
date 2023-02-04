import { IObservable } from '@lirx/core';
import MerossCloudLegacy, {
  type CloudOptions,
  type DeviceDefinition,
  type MerossCloudDevice as MerossCloudDeviceLegacy,
} from 'meross-cloud';
import { promisify } from 'util';
import { fromNodeJSEventEmitter } from '../../../misc/from-node-js-event-emitter';
import { MerossCloudDevice } from './meross-cloud-device.class';

/**
 * https://albertogeniola.github.io/MerossIot/meross-protocol.html
 */

export class MerossCloud {
  readonly deviceInitialized$: IObservable<MerossCloudDevice>;

  private readonly _instance: MerossCloudLegacy;
  private readonly _connect: () => Promise<void>;
  private readonly _logout: () => Promise<void>;

  constructor(options: CloudOptions) {
    const instance = new MerossCloudLegacy(options);

    this.deviceInitialized$ = fromNodeJSEventEmitter(
      instance,
      'deviceInitialized',
      (
        deviceId: string,
        deviceDef: DeviceDefinition,
        device: MerossCloudDeviceLegacy,
      ): MerossCloudDevice => {
        return new MerossCloudDevice(
          deviceDef,
          device,
        );
      },
    );

    this._instance = instance;
    this._connect = promisify(instance.connect.bind(instance));
    this._logout = promisify(instance.logout.bind(instance));
  }

  connect(): Promise<void> {
    return this._connect();
  }

  logout(): Promise<void> {
    return this._logout();
  }
}


