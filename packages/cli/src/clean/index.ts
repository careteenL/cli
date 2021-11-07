import chalk from 'chalk';
import Inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { downloadDirectory, RC_DIRECTORY } from '../utils/constants';
import { deleteFolder, getDirName, waitFnLoading } from '../utils/util';

const exists = promisify(fs.exists);

const doDelete = (filePath: string) => {
  return new Promise<void>((resolve) => {
    deleteFolder(filePath);
    resolve();
  });
};

const cleanTemplate = async () => {
  const cacheTemp = getDirName(downloadDirectory);
  // 在getDirName里其实已经调用了fs.existsSync(downloadDirectory)。并根据是否存在.careteenTemplate文件夹而进行提示。
  // 但是在存在.careteenTemplate，但是里面的模板为空的时候，getDirName里不会走提示逻辑，且会返回空数组，这样的情况下不会有任何提示。
  // 个人想法是:
  // 1.修改getDirName这个方法，使得在“存在某个文件夹但是内容为空时”和“不存在某个文件夹”时返回的值不一样，使得其返回结果有明确的意义
  // 2.或者是将getDirName再进一步拆分为更符合“单一职责”的函数，但是由于getDirName在很多地方用了，不好随意更改
  const isExists = fs.existsSync(downloadDirectory);
  if (!cacheTemp.length) {
    if (isExists) console.log(`${downloadDirectory} is empty~`);
    return;
  }
  const { delTemp } = await Inquirer.prompt({
    name: 'delTemp',
    type: 'list',
    message: 'please choose the template in local disk to clean',
    choices: ['all'].concat(cacheTemp),
  });

  try {
    await waitFnLoading(
      doDelete,
      'delete temp',
    )(delTemp === 'all' ? downloadDirectory : path.resolve(downloadDirectory, delTemp));
  } catch (e) {
    console.log(chalk.red(e as any));
  }
};

/* FIXME：如果.careteenclirc是文件而非文件夹的话，执行careteen clean，并选择删除rc配置的话，会抛错 */
const cleanRcFile = async () => {
  const cacheRcFile = await exists(RC_DIRECTORY);
  if (!cacheRcFile) {
    console.log(`${RC_DIRECTORY} is not exists~`);
    return;
  }
  const { delConf } = await Inquirer.prompt({
    name: 'delConf',
    type: 'confirm',
    message: 'Do you want to delete the config for cli in local disk?',
  });
  try {
    if (delConf) {
      await waitFnLoading(doDelete, 'reset config')(RC_DIRECTORY);
    }
  } catch (e) {
    console.log(chalk.red(e as any));
  }
};

module.exports = async () => {
  await cleanTemplate();
  await cleanRcFile();
};
