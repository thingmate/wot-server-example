import { IDeviceAbilities } from '../meross-cloud-device.types';
import { IAbility, IAbilityBodies } from './ability.type';

// Appliance.System.Ability
export interface IGet$Appliance$System$Ability$Response {
  payloadVersion: number;
  ability: IDeviceAbilities;
  // ability: {
  //   'Appliance.Config.Key': {},
  //   'Appliance.Config.WifiList': {},
  //   'Appliance.Config.Wifi': {},
  //   'Appliance.Config.Trace': {},
  //   'Appliance.System.All': {},
  //   'Appliance.System.Hardware': {},
  //   'Appliance.System.Firmware': {},
  //   'Appliance.System.Debug': {},
  //   'Appliance.System.Online': {},
  //   'Appliance.System.Time': {},
  //   'Appliance.System.Clock': {},
  //   'Appliance.System.Ability': {},
  //   'Appliance.System.Runtime': {},
  //   'Appliance.System.Report': {},
  //   'Appliance.System.Position': {},
  //   'Appliance.System.DNDMode': {},
  //   'Appliance.Control.Multiple': { maxCmdNum: 5 },
  //   'Appliance.Control.ToggleX': {},
  //   'Appliance.Control.TimerX': { sunOffsetSupport: 1 },
  //   'Appliance.Control.TriggerX': {},
  //   'Appliance.Control.Bind': {},
  //   'Appliance.Control.Unbind': {},
  //   'Appliance.Control.Upgrade': {},
  //   'Appliance.Control.ConsumptionX': {},
  //   'Appliance.Control.Electricity': {},
  //   'Appliance.Control.ConsumptionConfig': {},
  //   'Appliance.Digest.TriggerX': {},
  //   'Appliance.Digest.TimerX': {}
  // }
}

export type IAppliance$System$Ability$Ability = IAbility<
  IAbilityBodies<{}, IGet$Appliance$System$Ability$Response>,
  IAbilityBodies<never, never>
>
