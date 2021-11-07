import semver from 'semver';
import chalk from 'chalk';
import Inquirer from 'inquirer';
import { exec } from 'child_process';
import ora from 'ora';
import getPackageVersion from './getPackageVersion';
import { name as pkgname, version as curVersion } from './constants';
import type { VersionInfo } from '../index.d';
import { clearConsole } from './util';
import { get } from './rc';
// 缓存上一次的最新版本号以及本地版本号
let sessionCached: VersionInfo | undefined;
// 缓存上次版本号以及获取时间
let saveOptions = { latestVersion: '', lastChecked: 0 };

// 获取最新版本并且缓存在磁盘本地以便下次使用
async function getAndCacheLatestVersion(cached: string): Promise<string> {
  try {
    const res = await getPackageVersion(pkgname, 'latest');
    const { version } = res.data;
    // 如果获得版本号是合法的并且与之前缓存的版本不一致说明是最新的
    if (semver.valid(version) && version !== cached) {
      saveOptions = {
        latestVersion: version,
        lastChecked: Date.now(),
      };
      return version;
    }
  } catch (err: any) {
    const formatErr = err.toJSON();
    console.log(chalk.red(`查询版本信息失败：${formatErr.message || '网络异常'}`));
  }
  return cached;
}
async function getVersions(): Promise<VersionInfo> {
  if (sessionCached) {
    return sessionCached;
  }
  let latest: string;
  const local = curVersion;
  // 提供默认值作为第一次计算
  const { latestVersion = local, lastChecked = 0 } = saveOptions;
  // 本地最新的版本
  const cached: string = latestVersion;
  const interval: number = await get('CHECK_VERSION_INTERVAL');
  // 一天检查一次
  const daysPassed = (Date.now() - lastChecked) / interval;
  if (daysPassed > 1) {
    latest = await getAndCacheLatestVersion(cached);
  } else {
    getAndCacheLatestVersion(cached);
    latest = cached;
  }
  sessionCached = {
    latest,
    current: local,
  };
  return sessionCached;
}
function updateCli() {
  return new Promise<void>((resolve, reject) => {
    const spinner = ora('updating');
    spinner.start();
    exec(`npm update -g ${pkgname}`, (err, stdout) => {
      clearConsole();
      if (err) {
        console.log(err);
        spinner.fail();
        reject(err);
      }
      console.log('log for update:\n', chalk.green(stdout));
      spinner.text = 'updated success';
      spinner.succeed();
      resolve();
    });
  });
}
async function checkVersion(): Promise<void> {
  const { latest, current } = await getVersions();
  console.log(`current version: ${current}`);
  if (semver.lt(current, latest)) {
    const { update } = await Inquirer.prompt({
      name: 'update',
      type: 'confirm',
      message: 'There is a new version. Do you want to update it?',
    });
    if (update) {
      await updateCli();
    }
  }
}
export default checkVersion;
