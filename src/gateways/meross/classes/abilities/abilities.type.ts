import { IAppliance$Control$ConsumptionConfig$Ability } from './appliance.control.consumption-config';
import { IAppliance$Control$ConsumptionX$Ability } from './appliance.control.consumption-x';
import { IAppliance$Control$Electricity$Ability } from './appliance.control.electricity';
import { IAppliance$Control$ToggleX$Ability } from './appliance.control.toggle-x';
import { IAppliance$System$Ability$Ability } from './appliance.system.ability.type';
import { IAppliance$System$All$Ability } from './appliance.system.all.type';
import { IAppliance$System$Firmware$Ability } from './appliance.system.firmware.type';

export interface IAbilities {
  // 'Appliance.Config.Key': IAbility<unknown, {}>,
  // 'Appliance.Config.WifiList': {},
  // 'Appliance.Config.Wifi': {},
  // 'Appliance.Config.Trace': {},
  'Appliance.System.All': IAppliance$System$All$Ability;
  // 'Appliance.System.Hardware': {},
  'Appliance.System.Firmware': IAppliance$System$Firmware$Ability;
  // 'Appliance.System.Debug': {},
  // 'Appliance.System.Online': {},
  // 'Appliance.System.Time': {},
  // 'Appliance.System.Clock': {},
  'Appliance.System.Ability': IAppliance$System$Ability$Ability;
  // 'Appliance.System.Runtime': {},
  // 'Appliance.System.Report': IAbility<{}, IGet$Appliance$System$Report$Response>;
  // 'Appliance.System.Position': {},
  // 'Appliance.System.DNDMode': {},
  // 'Appliance.Control.Multiple': { maxCmdNum: 5 },
  'Appliance.Control.ToggleX': IAppliance$Control$ToggleX$Ability;
  // // 'Appliance.Control.TimerX': { sunOffsetSupport: 1 },
  // // 'Appliance.Control.TriggerX': {},
  // // 'Appliance.Control.Bind': {},
  // // 'Appliance.Control.Unbind': {},
  // // 'Appliance.Control.Upgrade': {},
  'Appliance.Control.ConsumptionX': IAppliance$Control$ConsumptionX$Ability;
  'Appliance.Control.Electricity': IAppliance$Control$Electricity$Ability;
  'Appliance.Control.ConsumptionConfig': IAppliance$Control$ConsumptionConfig$Ability;
  // 'Appliance.Digest.TriggerX': IAbility<{}, IGet$Appliance$Digest$TriggerX$Response>;
  // // 'Appliance.Digest.TimerX': {},
}
