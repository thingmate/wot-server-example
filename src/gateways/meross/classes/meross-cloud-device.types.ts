import { STATE } from './state.enum';

export type INumberBoolean =
  | 0 // false
  | 1 // true
  ;

export function booleanToNumberBoolean(
  input: boolean,
): INumberBoolean {
  return input ? 1 : 0;
}

/** INTERFACES **/

export interface ISystemHardware {
  type: string;
  subType: string;
  version: string;
  chipType: string;
  uuid: string;
  macAddress: string;
}

export interface ISystemFirmware {
  version: string;
  compileTime: string;
  wifiMac: string;
  innerIp: string;
  server: string;
  port: number;
  userId: number;
}

export type ISystemTimeRule = [
  timestamp: number,
  seconds: number,
  _unknown: number,
]

export interface ISystemTime {
  timestamp: number; // in s
  timezone: string;
  timeRule: ISystemTimeRule[];
}

export interface ISystemOnline {
  status: number;
}

export interface ISystem {
  hardware: ISystemHardware;
  firmware: ISystemFirmware;
  time: ISystemTime;
  online: ISystemOnline;
}

export interface IToggleX {
  channel: number;
  onoff: INumberBoolean;
}

export interface IDigestToggleX extends IToggleX {
  lmTime: number; // last modification time (timestamp in s)
}

export interface IDigest {
  togglex: IDigestToggleX[];
  triggerx: unknown[];
  timerx: unknown[];
}

export interface IElectricityConsumption {
  date: string; // format: '2023-01-31'
  time: number; // in s
  value: number;
}

export interface IElectricityConsumptionConfig {
  voltageRatio: number;
  electricityRatio: number;
}

export interface IElectricity {
  channel: number;
  current: number;
  voltage: number;
  power: number;
  config: IElectricityConsumptionConfig;
}

/** GET/SET DATA **/



/* SYSTEM */



// Appliance.System.Report
export interface IGet$Appliance$System$Report$Response {
  // unknown
}

/* CONTROL */


/* DIGEST */

export interface IGet$Appliance$Digest$TriggerX$Response {
  digest: unknown[];
}
