import { IDigest, ISystem } from '../meross-cloud-device.types';
import { IAbility, IAbilityBodies } from './ability.type';

// Appliance.System.All
export interface IGet$Appliance$System$All$Response {
  all: {
    system: ISystem;
    digest: IDigest;
  };
}

export type IAppliance$System$All$Ability = IAbility<
  IAbilityBodies<{}, IGet$Appliance$System$All$Response>,
  IAbilityBodies<never, never>
>
