import { get, set, remove, getAll } from '../utils/rc';

import type { TAction } from '../index.d';

module.exports = async (action: TAction, k: string, v: string) => {
  // eslint-disable-next-line default-case
  switch (action) {
    case 'get':
      if (k) {
        const key = await get(k);
        console.log(key);
      } else {
        const obj = await getAll();
        Object.keys(obj).forEach((key) => {
          console.log(`${key}=${obj[key]}`);
        });
      }
      break;
    case 'set':
      set(k, v);
      break;
    case 'remove':
      remove(k);
      break;
  }
};
