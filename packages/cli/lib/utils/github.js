"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printLogo = exports.fetchTagList = exports.fetchRepoList = exports.download = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _figlet = _interopRequireDefault(require("figlet"));

var _chalk = _interopRequireDefault(require("chalk"));

var _util = require("util");

var _downloadGitRepo = _interopRequireDefault(require("download-git-repo"));

var _constants = require("./constants");

var _rc = require("./rc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { execSync } from 'child_process';
const downloadGitRepo = (0, _util.promisify)(_downloadGitRepo.default); // 打印logo

const printLogo = async (logo = 'Sohu . Focus . FE') => {
  try {
    // execSync(`figlet -c '${logo}'`, { stdio: [0, 1, 2] });
    const result = await (0, _util.promisify)(_figlet.default)(logo);
    console.log(_chalk.default.red(result));
  } catch (error) {
    console.warn("run 'brew install figlet'");
  }
}; // 获取模板列表


exports.printLogo = printLogo;

const fetchRepoList = async () => {
  const data = _constants.templateRepos.map(item => ({
    name: item
  }));

  return data;
}; // 抓取tag列表


exports.fetchRepoList = fetchRepoList;

const fetchTagList = async repo => {
  const CONFIG = await (0, _rc.getAll)();
  const {
    data
  } = await _axios.default.get(`${CONFIG.API_BASE}/repos/careteenL/${repo}/tags`); // eslint-disable-next-line consistent-return

  return data;
}; // 下载仓库


exports.fetchTagList = fetchTagList;

const download = async (repo, tag) => {
  let api = `careteenL/${repo}`;

  if (tag) {
    api += `#${tag}`;
  }

  const dest = `${_constants.downloadDirectory}/${repo}`;
  await downloadGitRepo(api, dest);
  return dest;
};

exports.download = download;