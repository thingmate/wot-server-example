import { createConsumedThingFromThingDescription, fetchTD, IConsumedThing, IWoT } from '@thingmate/wot-scripting-api';
import { ExposedThingInit } from 'wot-typescript-definitions';
import { IPromiseLikeOrValue } from '@lirx/promise';
import { createExposedThingFromThingDescription } from '@thingmate/wot-scripting-api';

const td: ExposedThingInit = {
  title: 'Test Thing',
  properties: {
    state: {
      type: 'boolean',
      observable: true,
    },
  },
  actions: {
    'toggle': {
      data: { type: 'boolean' },
      dataResponse: { type: 'boolean' },
    },
  },
  events: {
    'state-change': {
      data: { type: 'boolean' },
    },
  },
} satisfies ExposedThingInit;


export async function debugTestThing(WoT: IWoT) {
  const thing = await createExposedThingFromThingDescription(WoT, td);

  console.log(`[INIT] "${thing.getDescription().title}"`);

  let state: boolean = true;

  const setState = (
    value: boolean,
  ): void => {
    state = value;
    stateProperty.emitChange();
    stateChangeEvent.emit(state);
  };

  // STATE PROPERTY
  const stateProperty = thing.getProperty<boolean>('state');

  stateProperty.onRead((): IPromiseLikeOrValue<boolean> => {
    return state;
  });

  stateProperty.onWrite(setState);

  stateProperty.onObserve((): IPromiseLikeOrValue<void> => {
    console.log('observe state');
  });

  stateProperty.onUnobserve((): IPromiseLikeOrValue<void> => {
    console.log('unobserve state');
  });

  // TOGGLE ACTION
  const toggleAction = thing.getAction<boolean, boolean>('toggle');

  toggleAction.onInvoke((_state: boolean = !state): IPromiseLikeOrValue<boolean> => {
    setState(_state);
    return state;
  });

  // ON-TOGGLE EVENT
  const stateChangeEvent = thing.getEvent<boolean>('state-change');

  // expose the thing
  await thing.expose();
  console.info(`[READY] "${thing.getDescription().title}"`);
}
