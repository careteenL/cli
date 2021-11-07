"use strict";

var _template = require("./template");

var _util = require("../../../utils/util");

module.exports = (cwdDir, pageName) => {
  const upperPageName = (0, _util.firstToUpper)(pageName);
  const pagesPrefix = (0, _util.getUmiPrefix)(cwdDir, 'components');
  return {
    [`${pagesPrefix}/${upperPageName}/index.tsx`]: _template.jsContent,
    [`${pagesPrefix}/${upperPageName}/index.less`]: _template.cssContent
  };
};