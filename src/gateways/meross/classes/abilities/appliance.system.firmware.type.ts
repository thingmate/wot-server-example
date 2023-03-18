import { IDigest, ISystem, ISystemFirmware } from '../meross-cloud-device.types';
import { IAbility, IAbilityBodies } from './ability.type';

// Appliance.System.Firmware
export interface IGet$Appliance$System$Firmware$Response {
  firmware: ISystemFirmware;
}

export type IAppliance$System$Firmware$Ability = IAbility<
  IAbilityBodies<{}, IGet$Appliance$System$Firmware$Response>,
  IAbilityBodies<never, never>
>
