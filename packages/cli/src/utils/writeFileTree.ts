import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

const writeFileTree = async (dir: string, files: any) => {
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, files[name]);
    console.log(`${chalk.green(name)} write done .`);
  });
};

export default writeFileTree;
