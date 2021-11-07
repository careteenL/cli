"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _semver = _interopRequireDefault(require("semver"));

var _chalk = _interopRequireDefault(require("chalk"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _child_process = require("child_process");

var _ora = _interopRequireDefault(require("ora"));

var _getPackageVersion = _interopRequireDefault(require("./getPackageVersion"));

var _constants = require("./constants");

var _util = require("./util");

var _rc = require("./rc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 缓存上一次的最新版本号以及本地版本号
let sessionCached; // 缓存上次版本号以及获取时间

let saveOptions = {
  latestVersion: '',
  lastChecked: 0
}; // 获取最新版本并且缓存在磁盘本地以便下次使用

async function getAndCacheLatestVersion(cached) {
  try {
    const res = await (0, _getPackageVersion.default)(_constants.name, 'latest');
    const {
      version
    } = res.data; // 如果获得版本号是合法的并且与之前缓存的版本不一致说明是最新的

    if (_semver.default.valid(version) && version !== cached) {
      saveOptions = {
        latestVersion: version,
        lastChecked: Date.now()
      };
      return version;
    }
  } catch (err) {
    const formatErr = err.toJSON();
    console.log(_chalk.default.red(`查询版本信息失败：${formatErr.message || '网络异常'}`));
  }

  return cached;
}

async function getVersions() {
  if (sessionCached) {
    return sessionCached;
  }

  let latest;
  const local = _constants.version; // 提供默认值作为第一次计算

  const {
    latestVersion = local,
    lastChecked = 0
  } = saveOptions; // 本地最新的版本

  const cached = latestVersion;
  const interval = await (0, _rc.get)('CHECK_VERSION_INTERVAL'); // 一天检查一次

  const daysPassed = (Date.now() - lastChecked) / interval;

  if (daysPassed > 1) {
    latest = await getAndCacheLatestVersion(cached);
  } else {
    getAndCacheLatestVersion(cached);
    latest = cached;
  }

  sessionCached = {
    latest,
    current: local
  };
  return sessionCached;
}

function updateCli() {
  return new Promise((resolve, reject) => {
    const spinner = (0, _ora.default)('updating');
    spinner.start();
    (0, _child_process.exec)(`npm update -g ${_constants.name}`, (err, stdout) => {
      (0, _util.clearConsole)();

      if (err) {
        console.log(err);
        spinner.fail();
        reject(err);
      }

      console.log('log for update:\n', _chalk.default.green(stdout));
      spinner.text = 'updated success';
      spinner.succeed();
      resolve();
    });
  });
}

async function checkVersion() {
  const {
    latest,
    current
  } = await getVersions();
  console.log(`current version: ${current}`);

  if (_semver.default.lt(current, latest)) {
    const {
      update
    } = await _inquirer.default.prompt({
      name: 'update',
      type: 'confirm',
      message: 'There is a new version. Do you want to update it?'
    });

    if (update) {
      await updateCli();
    }
  }
}

var _default = checkVersion;
exports.default = _default;