import { IElectricityConsumption, IElectricityConsumptionConfig } from '../meross-cloud-device.types';
import { IAbility, IAbilityBodies } from './ability.type';

// Appliance.Control.ConsumptionConfig

export interface IGet$Appliance$Control$ConsumptionConfig$Request {
  // TODO
}

export interface IGet$Appliance$Control$ConsumptionConfig$Response {
  config: IElectricityConsumptionConfig;
}

// export interface ISet$Appliance$Control$ConsumptionConfig$Request {
//   // TODO
// }
//
// export interface ISet$Appliance$Control$ConsumptionConfig$Response {
//   // empty
// }

export type IAppliance$Control$ConsumptionConfig$Ability = IAbility<
  IAbilityBodies<IGet$Appliance$Control$ConsumptionConfig$Request, IGet$Appliance$Control$ConsumptionConfig$Response>,
  IAbilityBodies<never, never>
>

