import { IWoT } from '@thingmate/wot-scripting-api';
import { CloudOptions } from 'meross-cloud';
import { Abortable } from '@lirx/async-task';
import { MerossCloudDevice } from '../gateways/meross/classes/meross-cloud-device.class';
import { MerossCloud } from '../gateways/meross/classes/meross-cloud.class';
import { createMerossSmartPlugExposedThing } from '../gateways/meross/create-meross-smart-plug-exposed-thing';
import { log } from '../misc/log';

export async function debugMerossThing(WoT: IWoT) {
  const options: CloudOptions = {
    email: 'inscriptions@valentin-richard.com',
    password: 'lifaon74',
    // logger: console.log,
    localHttpFirst: true, // Try to contact the devices locally before trying the cloud
    onlyLocalForGet: true, // When trying locally, do not try the cloud for GET requests at all
    timeout: 3000, // Default is 3000
  } satisfies CloudOptions;

  const meross = new MerossCloud(options);

  meross.deviceInitialized$((device: MerossCloudDevice): void => {
    console.log(`New device ${device.definition.uuid}:`);

    // if (device.definition.uuid === '19011048496979251h0234298f149604') {
    if (device.definition.uuid === '19011080184063251h0234298f1495fe') {
      return;
    }

    console.log(device.definition);

    device.connected$(async () => {
      if (device.definition.onlineStatus === 1) { // TODO enum
        console.log(`Device ${device.definition.uuid} connected`);
        const abortable = Abortable.never;

        const abilities = await device.init();
        const thing = await createMerossSmartPlugExposedThing(WoT, device, abortable).toPromise();
        await thing.expose({ abortable });

        // log(thing.getDescription());

        // log(await device.get$Appliance$System$Ability());
        // log(await device.get$Appliance$System$Firmware());

        // log(await device.publishMessage('GET', 'Appliance.System.All' as any, {}));

        log(await device.get$Appliance$Control$Electricity());
        // log(await device.get$Appliance$Control$ConsumptionConfig());
        // log(await device.get$Appliance$Control$ConsumptionX());

        // log(await device.get$Appliance$Control$ToggleX({
        //   togglex: { channel: 0 },
        // }));

        // await device.set$Appliance$Control$ToggleX({
        //   togglex: {
        //     channel: 0,
        //     onoff: STATE.ON,
        //   },
        // });

        // log(await device.get$Appliance$Control$ToggleX({
        //   togglex: { channel: 0 }
        // }));

        // log(await device.getSystemAllData());
        // log(await device.publishMessage('GET', 'Appliance.System.Hardware', {}));
        // log(await device.publishMessage('GET', 'Appliance.Control.ToggleX', {"togglex": {"channel": 0 }}));

        // device.controlToggleX(0, false, () => {
        //   console.log('ok');
        // });
      }
    });
  });

  await meross.connect();
  // meross.logout();
  console.log('connected to the cloud server');
}
