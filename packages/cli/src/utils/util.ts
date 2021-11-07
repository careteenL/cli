import path from 'path';
import fs from 'fs';
import ora from 'ora';
import readline from 'readline';

import { UMI_DIR_ARR } from './constants';

export const objToStr = (obj: Record<string, any>) => {
  const res = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const o in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(o)) {
      res.push(`${o}=${obj[o]}`);
    }
  }
  return res.join('&');
};

// 封装loading效果
export const waitFnLoading =
  (fn: Function, message: string) =>
  async (...args: any) => {
    const spinner = ora(message);
    spinner.start();
    const result = await fn(...args);
    spinner.succeed();
    return result;
  };

// 运行命令时 获取umi类型模板项目的目录前缀
// eslint-disable-next-line consistent-return
export const getUmiPrefix = (cwdDir: string, prefix: string = 'src/pages') => {
  let targetPrefix = prefix;
  let targetDir = path.join(cwdDir, prefix);
  // if (!fs.existsSync(targetDir)) {
  //   targetPrefix = `${UMI_DIR_ARR[2]}/${targetPrefix}`;
  //   targetDir = path.join(cwdDir, targetPrefix);
  // } else {
  //   return targetPrefix;
  // }
  if (!fs.existsSync(targetDir)) {
    targetPrefix = `${UMI_DIR_ARR[1]}/${targetPrefix}`;
    targetDir = path.join(cwdDir, targetPrefix);
  } else {
    return targetPrefix;
  }
  if (!fs.existsSync(targetDir)) {
    targetPrefix = `${UMI_DIR_ARR[0]}/${targetPrefix}`;
    targetDir = path.join(cwdDir, targetPrefix);
  } else {
    return targetPrefix;
  }
  return targetPrefix;
};

// 首字母大写
export const firstToUpper = (str: string) => str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());

// 首字母小写
export const firstToLower = (str: string) => str.replace(/( |^)[A-Z]/g, (L) => L.toLowerCase());

// 驼峰转横杠
export const hump2rail = (str: string) => str.replace(/([A-Z])/g, '-$1').toLowerCase();

// 横杠转驼峰
export const rail2hump = (str: string) =>
  str.replace(/-(\w)/g, (_: any, letter: string) => letter.toUpperCase());

// 获取某个目录下所有的文件夹
export const getDirName = (dirname: string): string[] => {
  const isExists = fs.existsSync(dirname);
  if (!isExists) {
    console.log(`${dirname} is not exists~`);
    return [];
  }
  const allFiles = fs.readdirSync(dirname);
  const result: string[] = [];
  allFiles.forEach((f) => {
    const stat = fs.statSync(path.join(dirname, f));
    if (stat.isDirectory()) {
      result.push(f);
    }
  });
  return result;
};
export const clearConsole = () => {
  if (process.stdout.isTTY) {
    // 判断是否在终端环境
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    // 在终端移动光标到标准输出流的起始坐标位置, 然后清除给定的TTY流
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  }
};
// 获取某个文件夹下所有文件路径
export const fileDisplay = (filePath: string): string[] => {
  const file: string[] = [];
  const files = fs.readdirSync(filePath);
  files.forEach((filename) => {
    const fileDir = path.join(filePath, filename);
    const stats = fs.statSync(fileDir);
    const isFile = stats.isFile();
    const isDir = stats.isDirectory();
    if (isFile) {
      file.push(fileDir);
    }
    if (isDir) {
      file.concat(fileDisplay(fileDir));
    }
  });
  return file;
};
// 清空文件夹,并自定义是否删除文件夹
export const deleteFolder = (filePath: string, delDir = true) => {
  let files = [];
  if (fs.existsSync(filePath)) {
    files = fs.readdirSync(filePath);
    files.forEach((file) => {
      const curPath = `${filePath}/${file}`;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolder(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    if (delDir) fs.rmdirSync(filePath);
  }
};
