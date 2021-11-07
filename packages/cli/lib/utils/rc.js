"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = exports.remove = exports.getAll = exports.get = void 0;

var _ini = require("ini");

var _util = require("util");

var _fs = _interopRequireDefault(require("fs"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line
const exists = (0, _util.promisify)(_fs.default.exists);
const readFile = (0, _util.promisify)(_fs.default.readFile);
const writeFile = (0, _util.promisify)(_fs.default.writeFile);

const get = async k => {
  const has = await exists(_constants.RC_DIRECTORY);
  let opts;

  if (has) {
    opts = await readFile(_constants.RC_DIRECTORY, 'utf8');
    opts = (0, _ini.decode)(opts);
    return opts[k];
  }

  return _constants.RC_DEFAULTS[k];
};

exports.get = get;

const set = async (k, v) => {
  const has = await exists(_constants.RC_DIRECTORY);
  let opts;

  if (has) {
    opts = await readFile(_constants.RC_DIRECTORY, 'utf8');
    opts = (0, _ini.decode)(opts);
    Object.assign(opts, {
      [k]: v
    });
  } else {
    opts = Object.assign(_constants.RC_DEFAULTS, {
      [k]: v
    });
  }

  await writeFile(_constants.RC_DIRECTORY, (0, _ini.encode)(opts), 'utf8');
};

exports.set = set;

const remove = async k => {
  const has = await exists(_constants.RC_DIRECTORY);
  let opts;

  if (has) {
    opts = await readFile(_constants.RC_DIRECTORY, 'utf8');
    opts = (0, _ini.decode)(opts);
    delete opts[k];
    await writeFile(_constants.RC_DIRECTORY, (0, _ini.encode)(opts), 'utf8');
  } else {
    delete _constants.RC_DEFAULTS[k];
  }
};

exports.remove = remove;

const getAll = async () => {
  const has = await exists(_constants.RC_DIRECTORY);
  let opts;

  if (has) {
    opts = await readFile(_constants.RC_DIRECTORY, 'utf8');
    opts = (0, _ini.decode)(opts);
    return opts;
  }

  return _constants.RC_DEFAULTS;
};

exports.getAll = getAll;