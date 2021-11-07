import {
  cssContent,
  jsContent,
} from './template';
import { firstToUpper, getUmiPrefix } from '../../../utils/util';
import { IGenerateRule } from '../../../index.d';

module.exports = (cwdDir: string, pageName: string): IGenerateRule => {
  const upperPageName = firstToUpper(pageName);
  const pagesPrefix = getUmiPrefix(cwdDir, 'components');
  return {
    [`${pagesPrefix}/${upperPageName}/index.tsx`]: jsContent,
    [`${pagesPrefix}/${upperPageName}/index.less`]: cssContent,
  };
};
