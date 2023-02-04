import { inspect } from 'util';

export function log(
  input: any,
) {
  console.log(inspect(input, {showHidden: false, depth: null, colors: true}));
}
