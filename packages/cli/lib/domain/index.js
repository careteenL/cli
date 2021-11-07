"use strict";

var _inquirer = _interopRequireDefault(require("inquirer"));

var _path = _interopRequireDefault(require("path"));

var _chalk = _interopRequireDefault(require("chalk"));

var _constants = require("../utils/constants");

var _util = require("../utils/util");

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _jscodeshift = _interopRequireDefault(require("jscodeshift"));

var _rc = require("../utils/rc");

var _ncp = _interopRequireDefault(require("ncp"));

var _util2 = require("util");

var _template = require("./template");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ncp = (0, _util2.promisify)(_ncp.default);

module.exports = async () => {
  const CONFIG = await (0, _rc.getAll)();
  const rootDir = process.cwd();
  const cwdDirArr = (0, _util.getDirName)(rootDir);

  if (_constants.RSCODE_DIR_ARR.some(dir => !cwdDirArr.includes(dir))) {
    console.log(`${_chalk.default.red('please make sure in the root directory which has directories named "ds-conf" and "nginx-conf" when executing the "careteen domain" command !')}`);
    return;
  }

  const {
    branch
  } = await _inquirer.default.prompt({
    name: 'branch',
    type: 'list',
    message: 'please choose a branch for new domain',
    choices: _constants.BRANCH_ENV
  }); // 检查是否已经存在该分支并且所有文件夹下都有配置文件

  const isExistBranch = _constants.RSCODE_DIR_ARR.some(conf => {
    const existBranch = (0, _util.getDirName)(_path.default.resolve(rootDir, conf));
    return ['dev', 'test'].some(env => {
      const newConfDirName = (0, _constants.BRANCH_DIR_NAME)(env, branch);
      return existBranch.includes(newConfDirName) && (0, _util.fileDisplay)(_path.default.resolve(rootDir, conf, newConfDirName)).length;
    });
  });

  if (isExistBranch) {
    console.log(`${_chalk.default.red(`branch of no.${branch} is exist !`)}`);
    return;
  }

  _constants.RSCODE_DIR_ARR.forEach(conf => {
    ['dev', 'test'].forEach(async env => {
      // 新增的配置文件夹
      const newConfDirName = (0, _constants.BRANCH_DIR_NAME)(env, branch);

      const newConfDirPath = _path.default.resolve(rootDir, conf, newConfDirName);

      _fsExtra.default.ensureDirSync(newConfDirPath); // dev/test配置文件夹路径


      const confDirPath = _path.default.resolve(rootDir, conf, env);

      await ncp(confDirPath, newConfDirPath, {
        clobber: false,
        transform: (readerStream, writeStream) => {
          readerStream.setEncoding('utf-8');
          readerStream.on('data', data => {
            let reset = '';
            const reg = new RegExp(`-${env}.cn`, 'g'); // 修改配置

            if (conf === 'ds-conf') {
              const originObjNode = (0, _jscodeshift.default)(data).find(_jscodeshift.default.Property, {
                key: {
                  name: CONFIG.DOMAIN_CONF_KEY
                }
              });
              const originVal = originObjNode.find(_jscodeshift.default.Literal).get().node.value;
              reset = originObjNode.replaceWith(_jscodeshift.default.property('init', _jscodeshift.default.identifier(CONFIG.DOMAIN_CONF_KEY), _jscodeshift.default.literal(originVal.replace(reg, `-${env}${branch}.cn`)))).toSource();
            } else if (conf === 'nginx-conf') {
              reset = data.replace(reg, `-${env}${branch}.cn`); // 添加nginx负载均衡的配置

              const splitTmp = reset.split(/\r\n|\n|\r/gm);
              splitTmp.splice(0, 0, (0, _template.nginxContent)(env, branch));
              reset = splitTmp.join('\r\n');
            }

            writeStream.write(reset, 'utf-8');
            console.log(_chalk.default.green(`${newConfDirName} of ${conf} created!`));
          });
        }
      });
    });
  });
};