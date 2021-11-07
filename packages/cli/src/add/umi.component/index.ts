import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import { getDirName } from '../../utils/util';
import writeFileTree from '../../utils/writeFileTree';
import { UMI_DIR_ARR } from '../../utils/constants';

module.exports = async (componentName: string) => {
  const cwdDirArr = process.cwd().split('/');
  const cwdDirTail = cwdDirArr[cwdDirArr.length - 1];
  if (!UMI_DIR_ARR.includes(cwdDirTail)) {
    console.log(`${chalk.red('please make sure in the "src" directory when executing the "careteen add material" command !')}`);
    return;
  }
  const components = getDirName(__dirname);
  if (!components.length) {
    console.log(`${chalk.red('please support component !')}`);
    return;
  }
  const { componentType } = await inquirer.prompt({
    name: 'componentType',
    type: 'list',
    message: 'please choose a type to add component',
    choices: components,
  });
  const generateRule = require(path.resolve(__dirname, `${componentType}`));
  const fileTree = await generateRule(process.cwd(), componentName);
  writeFileTree(process.cwd(), fileTree);
};
