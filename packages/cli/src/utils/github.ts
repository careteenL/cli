// import { execSync } from 'child_process';
import axios from 'axios';
import figlet from 'figlet'
import chalk from 'chalk'
import { promisify } from 'util';
import downloadGitRepoOrigin from 'download-git-repo';

import { downloadDirectory, templateRepos } from './constants';
import { getAll } from './rc';

const downloadGitRepo = promisify(downloadGitRepoOrigin);

// 打印logo
export const printLogo = async (logo: string = 'Sohu . Focus . FE') => {
  try {
    // execSync(`figlet -c '${logo}'`, { stdio: [0, 1, 2] });
    const result = await promisify(figlet)(logo) as string
    console.log(chalk.red(result!))
  } catch (error) {
    console.warn("run 'brew install figlet'");
  }
};

// 获取模板列表
export const fetchRepoList = async () => {
  const data = templateRepos.map((item) => ({ name: item }));
  return data;
};

// 抓取tag列表
export const fetchTagList = async (repo: string) => {
  const CONFIG = await getAll();
  const { data } = await axios.get(`${CONFIG.API_BASE}/repos/careteenL/${repo}/tags`);
  // eslint-disable-next-line consistent-return
  return data;
};

// 下载仓库
export const download = async (repo: string, tag: string) => {
  let api = `careteenL/${repo}`;
  if (tag) {
    api += `#${tag}`;
  }
  const dest = `${downloadDirectory}/${repo}`;
  await downloadGitRepo(api, dest);
  return dest;
};
