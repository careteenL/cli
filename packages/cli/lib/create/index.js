"use strict";

var _inquirer = _interopRequireDefault(require("inquirer"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _metalsmith = _interopRequireDefault(require("metalsmith"));

var _process = _interopRequireDefault(require("process"));

var _chalk = _interopRequireDefault(require("chalk"));

var _util = require("util");

var _child_process = require("child_process");

var _ncp = _interopRequireDefault(require("ncp"));

var _consolidate = require("consolidate");

var _git = require("../utils/git");

var _github = require("../utils/github");

var _util2 = require("../utils/util");

var _constants = require("../utils/constants");

var _rc = require("../utils/rc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ncp = (0, _util.promisify)(_ncp.default);

module.exports = async projectName => {
  // 0) print logo
  await (0, _github.printLogo)(); // 1) 获取项目的模板 （所有的）

  let repos = await (0, _util2.waitFnLoading)(_github.fetchRepoList, 'fetching template ....')();
  repos = repos.map(item => item.name);
  const {
    repo
  } = await _inquirer.default.prompt({
    name: 'repo',
    type: 'list',
    message: 'please choose a template to create project',
    choices: repos
  }); // 2) 通过当前选择的项目 拉取对应的版本

  let tags = await (0, _util2.waitFnLoading)(_github.fetchTagList, 'fetching tags ....')(repo);
  tags = tags.map(item => item.name);
  const {
    tag
  } = await _inquirer.default.prompt({
    name: 'tag',
    type: 'list',
    message: 'please choose a tag to create project',
    choices: tags
  }); // 3) 把模板放到一个临时目录里 存好，以备后期使用

  const result = await (0, _util2.waitFnLoading)(_github.download, 'download template')(repo, tag); // 4) 选择使用的包管理工具， npm / yarn

  const {
    packageManagerName
  } = await _inquirer.default.prompt({
    name: 'packageManagerName',
    type: 'list',
    message: 'please choose package manager to install dependencies',
    choices: _constants.packageManagers.map(item => item.name)
  });

  const packageItem = _constants.packageManagers.find(item => item.name === packageManagerName);

  const installDeps = () => {
    try {
      const templateDir = _path.default.join(_process.default.cwd(), projectName);

      _process.default.chdir(templateDir);

      (0, _child_process.execSync)(packageItem === null || packageItem === void 0 ? void 0 : packageItem.installCommand, {
        stdio: 'ignore'
      });
    } catch (error) {
      console.warn(packageItem === null || packageItem === void 0 ? void 0 : packageItem.installFailTip);
    }
  };

  const successTip = () => {
    console.log(`Installing template dependencies using ${packageItem === null || packageItem === void 0 ? void 0 : packageItem.name}...`);
    installDeps();
    (0, _git.gitInitRepo)();
    console.log('We suggest that you begin by typing:');
    console.log();
    console.log(_chalk.default.cyan('  cd'), projectName);
    console.log(`  ${_chalk.default.cyan(`${packageItem === null || packageItem === void 0 ? void 0 : packageItem.name} start`)}`);
  }; // 获取配置


  const CONFIG = await (0, _rc.getAll)(); // 5) 拷贝操作

  if (!_fs.default.existsSync(_path.default.join(result, CONFIG.ASK_FOR_CLI))) {
    await ncp(result, _path.default.resolve(projectName));
    successTip();
  } else {
    const args = require(_path.default.join(result, CONFIG.ASK_FOR_CLI));

    await new Promise((resolve, reject) => {
      (0, _metalsmith.default)(__dirname).source(result).destination(_path.default.resolve(projectName)).use(async (files, metal, done) => {
        // requiredPrompts 没有时取默认导出
        const obj = await _inquirer.default.prompt(args.requiredPrompts || args);
        const meta = metal.metadata();
        Object.assign(meta, obj);
        delete files[CONFIG.ASK_FOR_CLI];
        done(null, files, metal);
      }).use((files, metal, done) => {
        const obj = metal.metadata();
        const effectFiles = args.effectFiles || [];
        Reflect.ownKeys(files).forEach(async file => {
          // effectFiles 为空时 就都需要遍历
          if (effectFiles.length === 0 || effectFiles.includes(file)) {
            let content = files[file].contents.toString();

            if (/<%=([\s\S]+?)%>/g.test(content)) {
              content = await _consolidate.ejs.render(content, obj);
              files[file].contents = Buffer.from(content);
            }
          }
        });
        successTip();
        done(null, files, metal);
      }).build(err => {
        if (err) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject();
        } else {
          resolve();
        }
      });
    });
  }
};