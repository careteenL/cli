import Inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import MetalSmith from 'metalsmith';
import process from 'process';
import chalk from 'chalk';
import { promisify } from 'util';
import { execSync } from 'child_process';
import ncpOrigin from 'ncp';
import { ejs } from 'consolidate';

import { gitInitRepo } from '../utils/git';
import { download, fetchRepoList, fetchTagList, printLogo } from '../utils/github';
import { waitFnLoading } from '../utils/util';
import { packageManagers } from '../utils/constants';
import { getAll } from '../utils/rc';

const ncp = promisify(ncpOrigin);

module.exports = async (projectName: string) => {
  // 0) print logo
  await printLogo();

  // 1) 获取项目的模板 （所有的）
  let repos = await waitFnLoading(fetchRepoList, 'fetching template ....')();
  repos = repos.map((item: any) => item.name);

  const { repo } = await Inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: 'please choose a template to create project',
    choices: repos,
  });

  // 2) 通过当前选择的项目 拉取对应的版本
  let tags = await waitFnLoading(fetchTagList, 'fetching tags ....')(repo);
  tags = tags.map((item: any) => item.name);

  const { tag } = await Inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: 'please choose a tag to create project',
    choices: tags,
  });

  // 3) 把模板放到一个临时目录里 存好，以备后期使用
  const result = await waitFnLoading(download, 'download template')(repo, tag);

  // 4) 选择使用的包管理工具， npm / yarn
  const { packageManagerName } = await Inquirer.prompt({
    name: 'packageManagerName',
    type: 'list',
    message: 'please choose package manager to install dependencies',
    choices: packageManagers.map((item) => item.name),
  });
  const packageItem = packageManagers.find((item) => item.name === packageManagerName);

  const installDeps = () => {
    try {
      const templateDir = path.join(process.cwd(), projectName);
      process.chdir(templateDir);
      execSync(packageItem?.installCommand as string, { stdio: 'ignore' });
    } catch (error) {
      console.warn(packageItem?.installFailTip);
    }
  };

  const successTip = () => {
    console.log(`Installing template dependencies using ${packageItem?.name}...`);
    installDeps();
    gitInitRepo();
    console.log('We suggest that you begin by typing:');
    console.log();
    console.log(chalk.cyan('  cd'), projectName);
    console.log(`  ${chalk.cyan(`${packageItem?.name} start`)}`);
  };

  // 获取配置
  const CONFIG = await getAll();

  // 5) 拷贝操作
  if (!fs.existsSync(path.join(result, CONFIG.ASK_FOR_CLI as string))) {
    await ncp(result, path.resolve(projectName));
    successTip();
  } else {
    const args = require(path.join(result, CONFIG.ASK_FOR_CLI as string));
    await new Promise<void>((resolve, reject) => {
      MetalSmith(__dirname)
        .source(result)
        .destination(path.resolve(projectName))
        .use(async (files, metal, done) => {
          // requiredPrompts 没有时取默认导出
          const obj = await Inquirer.prompt(args.requiredPrompts || args);
          const meta = metal.metadata();
          Object.assign(meta, obj);
          delete files[CONFIG.ASK_FOR_CLI];
          done(null, files, metal);
        })
        .use((files, metal, done) => {
          const obj = metal.metadata();
          const effectFiles = args.effectFiles || [];
          Reflect.ownKeys(files).forEach(async (file) => {
            // effectFiles 为空时 就都需要遍历
            if (effectFiles.length === 0 || effectFiles.includes(file)) {
              let content = files[file as string].contents.toString();
              if (/<%=([\s\S]+?)%>/g.test(content)) {
                content = await ejs.render(content, obj);
                files[file as string].contents = Buffer.from(content);
              }
            }
          });
          successTip();
          done(null, files, metal);
        })
        .build((err) => {
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
