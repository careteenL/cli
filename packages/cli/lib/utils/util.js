"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitFnLoading = exports.rail2hump = exports.objToStr = exports.hump2rail = exports.getUmiPrefix = exports.getDirName = exports.firstToUpper = exports.firstToLower = exports.fileDisplay = exports.deleteFolder = exports.clearConsole = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _ora = _interopRequireDefault(require("ora"));

var _readline = _interopRequireDefault(require("readline"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const objToStr = obj => {
  const res = []; // eslint-disable-next-line no-restricted-syntax

  for (const o in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(o)) {
      res.push(`${o}=${obj[o]}`);
    }
  }

  return res.join('&');
}; // 封装loading效果


exports.objToStr = objToStr;

const waitFnLoading = (fn, message) => async (...args) => {
  const spinner = (0, _ora.default)(message);
  spinner.start();
  const result = await fn(...args);
  spinner.succeed();
  return result;
}; // 运行命令时 获取umi类型模板项目的目录前缀
// eslint-disable-next-line consistent-return


exports.waitFnLoading = waitFnLoading;

const getUmiPrefix = (cwdDir, prefix = 'src/pages') => {
  let targetPrefix = prefix;

  let targetDir = _path.default.join(cwdDir, prefix); // if (!fs.existsSync(targetDir)) {
  //   targetPrefix = `${UMI_DIR_ARR[2]}/${targetPrefix}`;
  //   targetDir = path.join(cwdDir, targetPrefix);
  // } else {
  //   return targetPrefix;
  // }


  if (!_fs.default.existsSync(targetDir)) {
    targetPrefix = `${_constants.UMI_DIR_ARR[1]}/${targetPrefix}`;
    targetDir = _path.default.join(cwdDir, targetPrefix);
  } else {
    return targetPrefix;
  }

  if (!_fs.default.existsSync(targetDir)) {
    targetPrefix = `${_constants.UMI_DIR_ARR[0]}/${targetPrefix}`;
    targetDir = _path.default.join(cwdDir, targetPrefix);
  } else {
    return targetPrefix;
  }

  return targetPrefix;
}; // 首字母大写


exports.getUmiPrefix = getUmiPrefix;

const firstToUpper = str => str.replace(/( |^)[a-z]/g, L => L.toUpperCase()); // 首字母小写


exports.firstToUpper = firstToUpper;

const firstToLower = str => str.replace(/( |^)[A-Z]/g, L => L.toLowerCase()); // 驼峰转横杠


exports.firstToLower = firstToLower;

const hump2rail = str => str.replace(/([A-Z])/g, '-$1').toLowerCase(); // 横杠转驼峰


exports.hump2rail = hump2rail;

const rail2hump = str => str.replace(/-(\w)/g, (_, letter) => letter.toUpperCase()); // 获取某个目录下所有的文件夹


exports.rail2hump = rail2hump;

const getDirName = dirname => {
  const isExists = _fs.default.existsSync(dirname);

  if (!isExists) {
    console.log(`${dirname} is not exists~`);
    return [];
  }

  const allFiles = _fs.default.readdirSync(dirname);

  const result = [];
  allFiles.forEach(f => {
    const stat = _fs.default.statSync(_path.default.join(dirname, f));

    if (stat.isDirectory()) {
      result.push(f);
    }
  });
  return result;
};

exports.getDirName = getDirName;

const clearConsole = () => {
  if (process.stdout.isTTY) {
    // 判断是否在终端环境
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank); // 在终端移动光标到标准输出流的起始坐标位置, 然后清除给定的TTY流

    _readline.default.cursorTo(process.stdout, 0, 0);

    _readline.default.clearScreenDown(process.stdout);
  }
}; // 获取某个文件夹下所有文件路径


exports.clearConsole = clearConsole;

const fileDisplay = filePath => {
  const file = [];

  const files = _fs.default.readdirSync(filePath);

  files.forEach(filename => {
    const fileDir = _path.default.join(filePath, filename);

    const stats = _fs.default.statSync(fileDir);

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
}; // 清空文件夹,并自定义是否删除文件夹


exports.fileDisplay = fileDisplay;

const deleteFolder = (filePath, delDir = true) => {
  let files = [];

  if (_fs.default.existsSync(filePath)) {
    files = _fs.default.readdirSync(filePath);
    files.forEach(file => {
      const curPath = `${filePath}/${file}`;

      if (_fs.default.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolder(curPath);
      } else {
        // delete file
        _fs.default.unlinkSync(curPath);
      }
    });
    if (delDir) _fs.default.rmdirSync(filePath);
  }
};

exports.deleteFolder = deleteFolder;