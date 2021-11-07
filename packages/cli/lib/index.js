"use strict";

var _commander = require("commander");

var _path = _interopRequireDefault(require("path"));

var _constants = require("./utils/constants");

var _checkVersion = _interopRequireDefault(require("./utils/checkVersion"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(async () => {
  const program = new _commander.Command();

  try {
    await (0, _checkVersion.default)();
  } catch (e) {
    console.log(e);
  }

  const mapActions = {
    create: {
      alias: 'c',
      description: 'create a project',
      examples: ['careteen create <project-name>']
    },
    add: {
      alias: 'a',
      description: 'add a material',
      examples: ['careteen add <material-name>']
    },
    domain: {
      alias: 'd',
      description: 'create config of nginx for new domain',
      examples: ['careteen domain']
    },
    config: {
      alias: 'conf',
      description: 'config project variable',
      examples: ['careteen config set <k> <v>', 'careteen config get <k>', 'careteen config remove <k>']
    },
    clean: {
      alias: 'cl',
      description: 'clean the cache in local disk',
      examples: ['careteen clean']
    },
    '*': {
      alias: '',
      description: 'command not found',
      examples: []
    }
  };
  Reflect.ownKeys(mapActions).forEach(action => {
    program.command(action).alias(mapActions[action].alias).description(mapActions[action].description).hook('preAction', async () => {}).action(async () => {
      if (action === '*') {
        console.log(mapActions[action].description);
      } else {
        require(_path.default.resolve(__dirname, action))(...process.argv.slice(3));
      }
    });
  });
  program.on('--help', () => {
    console.log('\nExamples:');
    Reflect.ownKeys(mapActions).forEach(action => {
      mapActions[action].examples.forEach(example => {
        console.log(`  ${example}`);
      });
    });
  });
  program.version(_constants.version).parse(process.argv);
})();