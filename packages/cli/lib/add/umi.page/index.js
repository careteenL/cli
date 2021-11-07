"use strict";

var _chalk = _interopRequireDefault(require("chalk"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _path = _interopRequireDefault(require("path"));

var _util = require("../../utils/util");

var _writeFileTree = _interopRequireDefault(require("../../utils/writeFileTree"));

var _constants = require("../../utils/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async pageName => {
  const cwdDirArr = process.cwd().split('/');
  const cwdDirTail = cwdDirArr[cwdDirArr.length - 1];

  if (!_constants.UMI_DIR_ARR.includes(cwdDirTail)) {
    console.log(`${_chalk.default.red('please make sure in the "src" directory when executing the "careteen add material" command !')}`);
    return;
  }

  const pages = (0, _util.getDirName)(__dirname);

  if (!pages.length) {
    console.log(`${_chalk.default.red('please support page !')}`);
    return;
  }

  const {
    pageType
  } = await _inquirer.default.prompt({
    name: 'pageType',
    type: 'list',
    message: 'please choose a type to add page',
    choices: pages
  });

  const generateRule = require(_path.default.resolve(__dirname, `${pageType}`));

  const fileTree = await generateRule(process.cwd(), pageName);
  (0, _writeFileTree.default)(process.cwd(), fileTree);
};