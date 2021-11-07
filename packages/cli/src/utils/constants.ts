import type { IRC } from '../index.d';

// 存放用户的所需要的常量
export const { version, name } = require('../../package.json');

const HOME = process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE'];
// 存储模板的位置
export const downloadDirectory = `${HOME}/.careteenTemplate`;
// rc配置存放位置
export const RC_DIRECTORY = `${HOME}/.careteenclirc`;

// 所有的模板项目
export const templateRepos = [
  'admin-umi-template',
  'admin-umi2-template',
  'admin-vue-template',
  'applet-taro-template',
  'applet-uniapp-template',
  'applet-mpvue-template',
  'jslib-cli',
  'h5-cra-template',
  'h5-umi-template',
  // TODO: add
];

// 包管理工具选择
export const packageManagers = [
  {
    name: 'npm',
    installCommand: 'npm install',
    installFailTip: "use 'npm install --registry=https://registry.npm.taobao.org'",
  },
  {
    name: 'yarn',
    installCommand: 'yarn install',
    installFailTip: "use 'yarn install --registry=https://registry.npm.taobao.org'",
  },
];

// umi模板项目的目录结构
export const UMI_DIR_ARR = ['code', 'client'];
export const LERNA_DIR_ARR = ['packages'];
// 后台项目目录结构
export const RSCODE_DIR_ARR = ['ds-conf', 'nginx-conf'];
export const BRANCH_DIR_NAME = (env: string, index: number) => `feature-${env}-${index}`;
// rc默认配置
export const RC_DEFAULTS: IRC = {
  API_BASE: 'https://api.github.com',
  REPO_GROUP: 'https://api.github.com', // TODO: 将cli迁移？
  ASK_FOR_CLI: 'ask-for-cli.js',
  CHECK_VERSION_INTERVAL: 3600 * 1000 * 24,
  DOMAIN_CONF_KEY: 'res_domain',
};
// 默认环境分支
export const BRANCH_ENV = (() => {
  const branch = [];
  for (let index = 1; index < 11; index++) {
    branch.push(`${index}`);
  }
  return branch;
})();
