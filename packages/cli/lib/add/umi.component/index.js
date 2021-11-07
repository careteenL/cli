"use strict";

var _chalk = _interopRequireDefault(require("chalk"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _path = _interopRequireDefault(require("path"));

var _util = require("../../utils/util");

var _writeFileTree = _interopRequireDefault(require("../../utils/writeFileTree"));

var _constants = require("../../utils/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async componentName => {
  const cwdDirArr = process.cwd().split('/');
  const cwdDirTail = cwdDirArr[cwdDirArr.length - 1];

  if (!_constants.UMI_DIR_ARR.includes(cwdDirTail)) {
    console.log(`${_chalk.default.red('please make sure in the "src" directory when executing the "careteen add material" command !')}`);
    return;
  }

  const components = (0, _util.getDirName)(__dirname);

  if (!components.length) {
    console.log(`${_chalk.default.red('please support component !')}`);
    return;
  }

  const {
    componentType
  } = await _inquirer.default.prompt({
    name: 'componentType',
    type: 'list',
    message: 'please choose a type to add component',
    choices: components
  });

  const generateRule = require(_path.default.resolve(__dirname, `${componentType}`));

  const fileTree = await generateRule(process.cwd(), componentName);
  (0, _writeFileTree.default)(process.cwd(), fileTree);
};