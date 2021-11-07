import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import { getDirName } from '../../utils/util';
import writeFileTree from '../../utils/writeFileTree';
import { UMI_DIR_ARR } from '../../utils/constants';

module.exports = async (pageName: string) => {
  const cwdDirArr = process.cwd().split('/');
  const cwdDirTail = cwdDirArr[cwdDirArr.length - 1];
  if (!UMI_DIR_ARR.includes(cwdDirTail)) {
    console.log(`${chalk.red('please make sure in the "src" directory when executing the "careteen add material" command !')}`);
    return;
  }
  const pages = getDirName(__dirname);
  if (!pages.length) {
    console.log(`${chalk.red('please support page !')}`);
    return;
  }
  const { pageType } = await inquirer.prompt({
    name: 'pageType',
    type: 'list',
    message: 'please choose a type to add page',
    choices: pages,
  });
  const generateRule = require(path.resolve(__dirname, `${pageType}`));
  const fileTree = await generateRule(process.cwd(), pageName);
  writeFileTree(process.cwd(), fileTree);
};
