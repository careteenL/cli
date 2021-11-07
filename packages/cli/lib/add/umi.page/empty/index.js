"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _jscodeshift = _interopRequireDefault(require("jscodeshift"));

var _template = require("./template");

var _util = require("../../../utils/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (cwdDir, pageName) => {
  const lowerPageName = pageName.toLocaleLowerCase();
  const upperPageName = (0, _util.firstToUpper)(pageName);
  const pagesPrefix = (0, _util.getUmiPrefix)(cwdDir, 'src/pages');
  const modelsPrefix = (0, _util.getUmiPrefix)(cwdDir, 'src/models');
  const servicesPrefix = (0, _util.getUmiPrefix)(cwdDir, 'src/services');
  const routesPrefix = (0, _util.getUmiPrefix)(cwdDir, 'config');

  const routesPath = _path.default.resolve(cwdDir, `${routesPrefix}/routes.ts`);

  const routeContent = _fs.default.readFileSync(routesPath, 'utf-8');

  const routeContentRoot = (0, _jscodeshift.default)(routeContent); // const jfPageName = {
  //   type: jf.Literal,
  //   value: pageName,
  // };
  // const jfUpperPageName = {
  //   type: jf.Literal,
  //   value: upperPageName,
  // };

  routeContentRoot.find(_jscodeshift.default.ArrayExpression).forEach((p, pIndex) => {
    if (pIndex === 1) {
      // FIXME: 格式缩进问题
      // p.get('elements').unshift(jf.template.expression`{
      p.get('elements').unshift(`{
  path: '/${pageName}', // TODO: 是否需要菜单调整位置？
  name: '${pageName}',
  component: './${upperPageName}',
}`);
    }
  });
  return {
    [`${pagesPrefix}/${upperPageName}/index.tsx`]: _template.jsContent,
    [`${pagesPrefix}/${upperPageName}/index.less`]: _template.cssContent,
    [`${modelsPrefix}/${lowerPageName}.ts`]: (0, _template.modelsContent)(upperPageName, lowerPageName),
    [`${servicesPrefix}/${lowerPageName}.ts`]: (0, _template.servicesContent)(upperPageName, lowerPageName),
    [`${routesPrefix}/routes.ts`]: routeContentRoot.toSource()
  };
};