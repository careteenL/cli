// 存放用户的所需要的常量
const { version } = require('../package.json');

// 存储模板的位置
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.careteenrc`;

// 所有的模板项目
// TODO add other template ...
const templateRepos = [
  'vue-backend-template',
  'jslib-cli',
  'vue-multi-page',
  'applet-mpvue-base',
  'react-admin-template',
];

module.exports = {
  version,
  downloadDirectory,
  templateRepos,
};
