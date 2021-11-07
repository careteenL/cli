import Inquirer from 'inquirer';
import path from 'path';
import chalk from 'chalk';
import { BRANCH_ENV, RSCODE_DIR_ARR, BRANCH_DIR_NAME } from '../utils/constants';
import { fileDisplay, getDirName } from '../utils/util';
import fs from 'fs-extra';
import jf from 'jscodeshift';
import { getAll } from '../utils/rc';
import ncpOrigin from 'ncp';
import { promisify } from 'util';
import { nginxContent } from './template';

const ncp = promisify(ncpOrigin);

module.exports = async () => {
  const CONFIG = await getAll();
  const rootDir = process.cwd();
  const cwdDirArr = getDirName(rootDir);

  if (RSCODE_DIR_ARR.some((dir: string) => !cwdDirArr.includes(dir))) {
    console.log(
      `${chalk.red(
        'please make sure in the root directory which has directories named "ds-conf" and "nginx-conf" when executing the "careteen domain" command !',
      )}`,
    );
    return;
  }

  const { branch } = await Inquirer.prompt({
    name: 'branch',
    type: 'list',
    message: 'please choose a branch for new domain',
    choices: BRANCH_ENV,
  });

  // 检查是否已经存在该分支并且所有文件夹下都有配置文件
  const isExistBranch = RSCODE_DIR_ARR.some((conf) => {
    const existBranch = getDirName(path.resolve(rootDir, conf));
    return ['dev', 'test'].some((env) => {
      const newConfDirName = BRANCH_DIR_NAME(env, branch);
      return (
        existBranch.includes(newConfDirName) &&
        fileDisplay(path.resolve(rootDir, conf, newConfDirName)).length
      );
    });
  });
  if (isExistBranch) {
    console.log(`${chalk.red(`branch of no.${branch} is exist !`)}`);
    return;
  }

  RSCODE_DIR_ARR.forEach((conf) => {
    ['dev', 'test'].forEach(async (env) => {
      // 新增的配置文件夹
      const newConfDirName = BRANCH_DIR_NAME(env, branch);
      const newConfDirPath = path.resolve(rootDir, conf, newConfDirName);

      fs.ensureDirSync(newConfDirPath);
      // dev/test配置文件夹路径
      const confDirPath = path.resolve(rootDir, conf, env);
      await ncp(confDirPath, newConfDirPath, {
        clobber: false,
        transform: (readerStream, writeStream) => {
          readerStream.setEncoding('utf-8');
          readerStream.on('data', (data: string) => {
            let reset = '';
            const reg = new RegExp(`-${env}.cn`, 'g');
            // 修改配置
            if (conf === 'ds-conf') {
              const originObjNode = jf(data).find(jf.Property, {
                key: {
                  name: CONFIG.DOMAIN_CONF_KEY,
                },
              });
              const originVal = originObjNode.find(jf.Literal).get().node.value;
              reset = originObjNode
                .replaceWith(
                  jf.property(
                    'init',
                    jf.identifier(CONFIG.DOMAIN_CONF_KEY as string),
                    jf.literal(originVal.replace(reg, `-${env}${branch}.cn`)),
                  ),
                )
                .toSource();
            } else if (conf === 'nginx-conf') {
              reset = data.replace(reg, `-${env}${branch}.cn`);
              // 添加nginx负载均衡的配置
              const splitTmp = reset.split(/\r\n|\n|\r/gm);
              splitTmp.splice(0, 0, nginxContent(env, branch));
              reset = splitTmp.join('\r\n');
            }
            writeStream.write(reset, 'utf-8');
            console.log(chalk.green(`${newConfDirName} of ${conf} created!`));
          });
        },
      });
    });
  });
};
