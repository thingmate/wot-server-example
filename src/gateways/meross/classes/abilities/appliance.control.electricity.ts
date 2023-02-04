import { IElectricity, IElectricityConsumption } from '../meross-cloud-device.types';
import { IAbility, IAbilityBodies } from './ability.type';

// Appliance.Control.Electricity

export interface IGet$Appliance$Control$Electricity$Request {
  // TODO
}

export interface IGet$Appliance$Control$Electricity$Response {
  electricity: IElectricity;
}

// export interface ISet$Appliance$Control$Electricity$Request {
//   // TODO
// }
//
// export interface ISet$Appliance$Control$Electricity$Response {
//   // empty
// }

export type IAppliance$Control$Electricity$Ability = IAbility<
  IAbilityBodies<IGet$Appliance$Control$Electricity$Request, IGet$Appliance$Control$Electricity$Response>,
  IAbilityBodies<never, never>
>

