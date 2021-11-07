import inquirer from 'inquirer';
import path from 'path';
import { getDirName } from '../utils/util';

module.exports = async (materialName: string) => {
  const materials = getDirName(__dirname);
  const { materialType } = await inquirer.prompt({
    name: 'materialType',
    type: 'list',
    message: 'please choose a type to add material',
    choices: materials,
  });
  require(path.resolve(__dirname, materialType))(materialName);
};
