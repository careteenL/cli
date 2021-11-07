import { decode, encode } from 'ini';
import { promisify } from 'util';
import fs from 'fs';
import { RC_DIRECTORY, RC_DEFAULTS } from './constants';
import type { IRC } from '../index.d';

// eslint-disable-next-line
const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export const get = async (k: string) => {
  const has = await exists(RC_DIRECTORY);
  let opts;
  if (has) {
    opts = await readFile(RC_DIRECTORY, 'utf8');
    opts = decode(opts);
    return opts[k];
  }
  return RC_DEFAULTS[k];
};

export const set = async (k: string, v: string) => {
  const has = await exists(RC_DIRECTORY);
  let opts;
  if (has) {
    opts = await readFile(RC_DIRECTORY, 'utf8');
    opts = decode(opts);
    Object.assign(opts, { [k]: v });
  } else {
    opts = Object.assign(RC_DEFAULTS, { [k]: v });
  }
  await writeFile(RC_DIRECTORY, encode(opts), 'utf8');
};

export const remove = async (k: string) => {
  const has = await exists(RC_DIRECTORY);
  let opts;
  if (has) {
    opts = await readFile(RC_DIRECTORY, 'utf8');
    opts = decode(opts);
    delete opts[k];
    await writeFile(RC_DIRECTORY, encode(opts), 'utf8');
  } else {
    delete RC_DEFAULTS[k];
  }
};

export const getAll = async (): Promise<IRC> => {
  const has = await exists(RC_DIRECTORY);
  let opts;
  if (has) {
    opts = await readFile(RC_DIRECTORY, 'utf8');
    opts = decode(opts);
    return opts;
  }
  return RC_DEFAULTS;
};
