import { IDigestToggleX, IToggleX } from '../meross-cloud-device.types';
import { IAbility, IAbilityBodies } from './ability.type';

// Appliance.Control.ToggleX

export interface IGet$Appliance$Control$ToggleX$Request {
  togglex: {
    channel: number;
  };
}

export interface IGet$Appliance$Control$ToggleX$Response {
  chanel: number;
  togglex: IDigestToggleX;
}

export interface ISet$Appliance$Control$ToggleX$Request {
  togglex: IToggleX;
}

export interface ISet$Appliance$Control$ToggleX$Response {
  // empty
}

export type IAppliance$Control$ToggleX$Ability = IAbility<
  IAbilityBodies<IGet$Appliance$Control$ToggleX$Request, IGet$Appliance$Control$ToggleX$Response>,
  IAbilityBodies<ISet$Appliance$Control$ToggleX$Request, ISet$Appliance$Control$ToggleX$Response>
>
