"use strict";

var _chalk = _interopRequireDefault(require("chalk"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _util = require("util");

var _constants = require("../utils/constants");

var _util2 = require("../utils/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const exists = (0, _util.promisify)(_fs.default.exists);

const doDelete = filePath => {
  return new Promise(resolve => {
    (0, _util2.deleteFolder)(filePath);
    resolve();
  });
};

const cleanTemplate = async () => {
  const cacheTemp = (0, _util2.getDirName)(_constants.downloadDirectory); // 在getDirName里其实已经调用了fs.existsSync(downloadDirectory)。并根据是否存在.careteenTemplate文件夹而进行提示。
  // 但是在存在.careteenTemplate，但是里面的模板为空的时候，getDirName里不会走提示逻辑，且会返回空数组，这样的情况下不会有任何提示。
  // 个人想法是:
  // 1.修改getDirName这个方法，使得在“存在某个文件夹但是内容为空时”和“不存在某个文件夹”时返回的值不一样，使得其返回结果有明确的意义
  // 2.或者是将getDirName再进一步拆分为更符合“单一职责”的函数，但是由于getDirName在很多地方用了，不好随意更改

  const isExists = _fs.default.existsSync(_constants.downloadDirectory);

  if (!cacheTemp.length) {
    if (isExists) console.log(`${_constants.downloadDirectory} is empty~`);
    return;
  }

  const {
    delTemp
  } = await _inquirer.default.prompt({
    name: 'delTemp',
    type: 'list',
    message: 'please choose the template in local disk to clean',
    choices: ['all'].concat(cacheTemp)
  });

  try {
    await (0, _util2.waitFnLoading)(doDelete, 'delete temp')(delTemp === 'all' ? _constants.downloadDirectory : _path.default.resolve(_constants.downloadDirectory, delTemp));
  } catch (e) {
    console.log(_chalk.default.red(e));
  }
};
/* FIXME：如果.careteenclirc是文件而非文件夹的话，执行careteen clean，并选择删除rc配置的话，会抛错 */


const cleanRcFile = async () => {
  const cacheRcFile = await exists(_constants.RC_DIRECTORY);

  if (!cacheRcFile) {
    console.log(`${_constants.RC_DIRECTORY} is not exists~`);
    return;
  }

  const {
    delConf
  } = await _inquirer.default.prompt({
    name: 'delConf',
    type: 'confirm',
    message: 'Do you want to delete the config for cli in local disk?'
  });

  try {
    if (delConf) {
      await (0, _util2.waitFnLoading)(doDelete, 'reset config')(_constants.RC_DIRECTORY);
    }
  } catch (e) {
    console.log(_chalk.default.red(e));
  }
};

module.exports = async () => {
  await cleanTemplate();
  await cleanRcFile();
};