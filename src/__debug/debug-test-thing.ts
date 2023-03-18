import { Abortable } from '@lirx/async-task';
import { createExposedThingFromThingDescription, IWoT } from '@thingmate/wot-scripting-api';
import { ExposedThingInit } from 'wot-typescript-definitions';

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
  const abortable = Abortable.never;

  interface IConfig {
    properties: {
      state: boolean;
    };
    actions: {
      toggle: [boolean, boolean];
    };
    events: {
      'state-change': boolean;
    };
  }

  const thing = await createExposedThingFromThingDescription<IConfig>(WoT, td, { abortable }).toPromise();

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
  const stateProperty = thing.getProperty('state');

  stateProperty.onRead((): boolean => {
    return state;
  });

  stateProperty.onWrite((value: boolean) => {
    setState(value);
  });

  stateProperty.onObserve((): void => {
    console.log('observe state');
  });

  stateProperty.onUnobserve((): void => {
    console.log('unobserve state');
  });

  // TOGGLE ACTION
  const toggleAction = thing.getAction('toggle');

  toggleAction.onInvoke((_state: boolean = !state): boolean => {
    setState(_state);
    return _state;
  });

  // ON-TOGGLE EVENT
  const stateChangeEvent = thing.getEvent('state-change');

  // expose the thing
  await thing.expose({ abortable }).toPromise();
  console.info(`[READY] "${thing.getDescription().title}"`);
}
