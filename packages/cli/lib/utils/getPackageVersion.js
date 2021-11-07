"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getPackageVersion(id, range = '') {
  // const registry = (await require('./shouldUseTaobao')())
  //   ? `https://registry.npm.taobao.org`
  //   : `https://registry.npmjs.org`;
  const registry = 'https://registry.npm.taobao.org'; // TODO区分npm源

  return _axios.default.get( // 关于npm对package的定义 https://docs.npmjs.com/about-packages-and-modules
  `${registry}/${encodeURIComponent(id).replace(/^%40/, '@')}/${range}`);
}

var _default = getPackageVersion;
exports.default = _default;