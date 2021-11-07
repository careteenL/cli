"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = exports.templateRepos = exports.packageManagers = exports.name = exports.downloadDirectory = exports.UMI_DIR_ARR = exports.RSCODE_DIR_ARR = exports.RC_DIRECTORY = exports.RC_DEFAULTS = exports.LERNA_DIR_ARR = exports.BRANCH_ENV = exports.BRANCH_DIR_NAME = void 0;

// 存放用户的所需要的常量
const {
  version,
  name
} = require('../../package.json');

exports.name = name;
exports.version = version;
const HOME = process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']; // 存储模板的位置

const downloadDirectory = `${HOME}/.careteenTemplate`; // rc配置存放位置

exports.downloadDirectory = downloadDirectory;
const RC_DIRECTORY = `${HOME}/.careteenclirc`; // 所有的模板项目

exports.RC_DIRECTORY = RC_DIRECTORY;
const templateRepos = ['admin-umi-template', 'admin-umi2-template', 'admin-vue-template', 'applet-taro-template', 'applet-uniapp-template', 'applet-mpvue-template', 'jslib-cli', 'h5-cra-template', 'h5-umi-template' // TODO: add
]; // 包管理工具选择

exports.templateRepos = templateRepos;
const packageManagers = [{
  name: 'npm',
  installCommand: 'npm install',
  installFailTip: "use 'npm install --registry=https://registry.npm.taobao.org'"
}, {
  name: 'yarn',
  installCommand: 'yarn install',
  installFailTip: "use 'yarn install --registry=https://registry.npm.taobao.org'"
}]; // umi模板项目的目录结构

exports.packageManagers = packageManagers;
const UMI_DIR_ARR = ['code', 'client'];
exports.UMI_DIR_ARR = UMI_DIR_ARR;
const LERNA_DIR_ARR = ['packages']; // 后台项目目录结构

exports.LERNA_DIR_ARR = LERNA_DIR_ARR;
const RSCODE_DIR_ARR = ['ds-conf', 'nginx-conf'];
exports.RSCODE_DIR_ARR = RSCODE_DIR_ARR;

const BRANCH_DIR_NAME = (env, index) => `feature-${env}-${index}`; // rc默认配置


exports.BRANCH_DIR_NAME = BRANCH_DIR_NAME;
const RC_DEFAULTS = {
  API_BASE: 'https://api.github.com',
  REPO_GROUP: 'https://api.github.com',
  // TODO: 将cli迁移？
  ASK_FOR_CLI: 'ask-for-cli.js',
  CHECK_VERSION_INTERVAL: 3600 * 1000 * 24,
  DOMAIN_CONF_KEY: 'res_domain'
}; // 默认环境分支

exports.RC_DEFAULTS = RC_DEFAULTS;

const BRANCH_ENV = (() => {
  const branch = [];

  for (let index = 1; index < 11; index++) {
    branch.push(`${index}`);
  }

  return branch;
})();

exports.BRANCH_ENV = BRANCH_ENV;