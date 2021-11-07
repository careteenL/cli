import fs from 'fs';
import path from 'path';
import jf from 'jscodeshift';
import {
  cssContent,
  jsContent,
  modelsContent,
  servicesContent,
} from './template';
import { firstToUpper, getUmiPrefix } from '../../../utils/util';
import { IGenerateRule } from '../../../index.d';

module.exports = (cwdDir: string, pageName: string): IGenerateRule => {
  const lowerPageName = pageName.toLocaleLowerCase();
  const upperPageName = firstToUpper(pageName);
  const pagesPrefix = getUmiPrefix(cwdDir, 'src/pages');
  const modelsPrefix = getUmiPrefix(cwdDir, 'src/models');
  const servicesPrefix = getUmiPrefix(cwdDir, 'src/services');
  const routesPrefix = getUmiPrefix(cwdDir, 'config');
  const routesPath = path.resolve(cwdDir, `${routesPrefix}/routes.ts`);
  const routeContent = fs.readFileSync(routesPath, 'utf-8');
  const routeContentRoot = jf(routeContent);
  // const jfPageName = {
  //   type: jf.Literal,
  //   value: pageName,
  // };
  // const jfUpperPageName = {
  //   type: jf.Literal,
  //   value: upperPageName,
  // };
  routeContentRoot.find(jf.ArrayExpression)
    .forEach((p, pIndex) => {
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
    [`${pagesPrefix}/${upperPageName}/index.tsx`]: jsContent,
    [`${pagesPrefix}/${upperPageName}/index.less`]: cssContent,
    [`${modelsPrefix}/${lowerPageName}.ts`]: modelsContent(upperPageName, lowerPageName),
    [`${servicesPrefix}/${lowerPageName}.ts`]: servicesContent(upperPageName, lowerPageName),
    [`${routesPrefix}/routes.ts`]: routeContentRoot.toSource(),
  };
};
