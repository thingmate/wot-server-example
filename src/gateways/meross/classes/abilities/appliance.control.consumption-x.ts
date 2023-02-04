import { IElectricityConsumption } from '../meross-cloud-device.types';
import { IAbility, IAbilityBodies } from './ability.type';

// Appliance.Control.ConsumptionX

export interface IGet$Appliance$Control$ConsumptionX$Request {
  // TODO
}

export interface IGet$Appliance$Control$ConsumptionX$Response {
  consumptionx: IElectricityConsumption[];
}

// export interface ISet$Appliance$Control$ConsumptionX$Request {
//   // TODO
// }
//
// export interface ISet$Appliance$Control$ConsumptionX$Response {
//   // empty
// }

export type IAppliance$Control$ConsumptionX$Ability = IAbility<
  IAbilityBodies<IGet$Appliance$Control$ConsumptionX$Request, IGet$Appliance$Control$ConsumptionX$Response>,
  IAbilityBodies<never, never>
>

