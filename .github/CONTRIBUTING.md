# 贡献 @careteen/cli

## 目录

- [快速启动](#快速启动)
- [新增项目模板](#新增项目模板)
- [新增命令](#新增命令)
- [扩展add命令](#扩展add命令)
- [提MergeRequest](#提-merge-request)
- [发布](#发布)

## 快速启动

```bash
$ git clone https://github.com/careteenL/cli.git
$ npm i -g yrm
$ yarn
$ cd packages/cli
$ yarn link
$ yarn dev
```

在其他目录下使用

```bash
$ cd /tmp
$ careteen create xxx
```

## 新增项目模板

> 以下步骤为新增`xxx`项目模板例子

- 先在`https://github.com/careteenL/cli`下新建模板项目`xxx`
- 然后再在此仓库拉新分支`template-xxx`
- 在`packages/cli/src/constants.js`的`templateRepos`中新增仓库名`xxx`
- 打`tag`命名时类似`v1.0.0`（使用脚手架时依赖tag）
- `push`代码

### 提供`ask-for-cli.js`文件（可选）

> 目的是根据用户填写修改变量的值

1. 在根目录新建`ask-for-cli.js`文件

```js
// 需要根据用户填写修改的字段
const requiredPrompts = [
  {
    type: 'input',
    name: 'repoNameEn',
    message: 'please input repo English Name ? (e.g. `smart-phone`.careteen.cn)',
  },
  {
    type: 'input',
    name: 'repoNameEnCamel',
    message: 'please input repo English Camel Name ?(e.g. smart-case.careteen.cn/`smartPhone`)',
  },
  {
    type: 'input',
    name: 'repoNameZh',
    message: 'please input repo Chinese Name ?(e.g. `智能话机`)',
  },
];

// 需要修改字段所在文件
const effectFiles = [
  `README.md`,
  `code/package.json`,
  `code/client/README.md`,
  `code/client/config/config.ts`,
  `code/client/src/app.ts`,
  `code/server/app.js`,
  `code/server/config.js`,
  `nginx-conf/work/res.conf`,
]

module.exports = {
  requiredPrompts,
  effectFiles,
};
```

2. 在`effectFiles`字段的文件中使用`ejs`写`requiredPrompts`中的`name`变量

例如在`code/client/package.json`文件中

```json
{
  "name": "<%=repoNameEnCamel%>",
  "version": "1.0.0",
  "private": true,
  "description": "<%=repoNameEn%> fe"
  // ...
}
```

## 新增命令

下面以新增`careteen add xxx`为例：

1. 前往`packages/cli/src/index.ts`文件中，在`mapActions`中新增一份`add`

```ts
const mapActions: IAction = {
  add: {
    alias: 'a',
    description: 'add a material',
    examples: [
      'careteen add <material-name>',
    ],
  },
  // ...
};
```

2. 新建`packages/cli/src/add`目录，以及`packages/cli/src/add/index.ts`文件

```ts
module.exports = async (...args) => {
  console.log('args: ', args);
  // TODO: write logic...
};
```

## 扩展add命令

`careteen add material`命令的目标是提供公司内部**不同技术栈**`物料（空页面、列表页、空组件...）`，并在不同目录下创建对应文件。

下面以新增`在 umi 框架下新建 空页面 `为例：

1. 新建`packages/cli/src/add/umi.page`目录，并新建如下目录

```shell
.
├── empty
│   ├── index.ts
│   └── template.ts
└── index.ts 
```

2. 编辑`packages/cli/src/add/umi.page/empty.ts`文件

```ts
import { jsContent } from './template';
import { IGenerateRule } from '../../../index.d';
module.exports = (cwdDir: string, pageName: string): IGenerateRule => {
  // 目的是返回需要新建的**文件目录和文件内容**
  return {
    [`src/pages/${pageName}/index.tsx`]: jsContent,
    // ...
  };
};
```

3. 编辑`src/add/umi.page/template.ts`文件

```ts
export const jsContent = `
// TODO: write here...
`;
```

详细内容可参考[umi.page目录结构](../packages/cli/src/add/umi.page)。


## 提 Merge Request

- 前往 https://github.com/careteenL/cli/pulls
- `Target branch`选择`feat/contribution`分支（注意，其他分支不予通过！！！）
