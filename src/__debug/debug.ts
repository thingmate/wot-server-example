import { HttpServer } from '@node-wot/binding-http';
import { Servient } from '@node-wot/core';
import { debugMerossThing } from './debug-meross-thing';
import { debugTestThing } from './debug-test-thing';

export async function debug() {
  const servient = new Servient();
  servient.addServer(new HttpServer({
    port: 8080,
    // observableSubProtocol: 'sse',
  }));

  // servient.addServer(new WebSocketServer({
  //   port: 8080,
  // }));

  // const _debug = debugTestThing;
  const _debug = debugMerossThing;
  await _debug(await servient.start());
}
