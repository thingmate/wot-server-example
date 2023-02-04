import { IObservable, IObserver, IUnsubscribe } from '@lirx/core';
import { EventEmitter } from 'events';

export function fromNodeJSEventEmitter<GValue, GArguments extends readonly any[]>(
  eventEmitter: EventEmitter,
  name: string,
  mapFunction: (...args: GArguments) => GValue,
): IObservable<GValue> {
  return (
    emit: IObserver<GValue>,
  ): IUnsubscribe => {
    const handler = ((...args: GArguments): void => {
      emit(mapFunction(...args));
    }) as (...args: any[]) => any;

    eventEmitter.on(name, handler);
    return (): void => {
      eventEmitter.off(name, handler);
    };
  };
}

export function fromBasicNodeJSEventEmitter<GValue>(
  eventEmitter: EventEmitter,
  name: string,
): IObservable<GValue> {
  return fromNodeJSEventEmitter<GValue, [GValue]>(
    eventEmitter,
    name,
    _ => _,
  );
}
