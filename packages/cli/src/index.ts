import { Command } from 'commander';
import path from 'path';
import { version } from './utils/constants';
import { IAction } from './index.d';
import checkVersion from './utils/checkVersion';

(async () => {
  const program = new Command();

  try {
    await checkVersion();
  } catch (e) {
    console.log(e);
  }

  const mapActions: IAction = {
    create: {
      alias: 'c',
      description: 'create a project',
      examples: ['careteen create <project-name>'],
    },
    add: {
      alias: 'a',
      description: 'add a material',
      examples: ['careteen add <material-name>'],
    },
    domain: {
      alias: 'd',
      description: 'create config of nginx for new domain',
      examples: ['careteen domain'],
    },
    config: {
      alias: 'conf',
      description: 'config project variable',
      examples: ['careteen config set <k> <v>', 'careteen config get <k>', 'careteen config remove <k>'],
    },
    clean: {
      alias: 'cl',
      description: 'clean the cache in local disk',
      examples: ['careteen clean'],
    },
    '*': {
      alias: '',
      description: 'command not found',
      examples: [],
    },
  };
  Reflect.ownKeys(mapActions).forEach((action: any) => {
    program
      .command(action)
      .alias(mapActions[action].alias)
      .description(mapActions[action].description)
      .hook('preAction', async () => {})
      .action(async () => {
        if (action === '*') {
          console.log(mapActions[action].description);
        } else {
          require(path.resolve(__dirname, action))(...process.argv.slice(3));
        }
      });
  });

  program.on('--help', () => {
    console.log('\nExamples:');
    Reflect.ownKeys(mapActions).forEach((action: any) => {
      mapActions[action].examples.forEach((example) => {
        console.log(`  ${example}`);
      });
    });
  });

  program.version(version).parse(process.argv);
})();
