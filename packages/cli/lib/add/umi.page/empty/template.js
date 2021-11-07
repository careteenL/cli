"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.servicesContent = exports.modelsContent = exports.jsContent = exports.cssContent = void 0;
const jsContent = `
import React from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import './index.less';

interface IProps {
  currentUser?: CurrentUser;
}
const Page: React.FC<IProps> = (props) => {
  console.log(props);
  return <PageHeaderWrapper>Page</PageHeaderWrapper>;
};

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(Page);
`;
exports.jsContent = jsContent;
const cssContent = `
// TODO: write here ...
`;
exports.cssContent = cssContent;

const modelsContent = (upperPageName, lowerPageName) => `
import type { Effect, Reducer } from 'umi';
import {
  get${upperPageName}List,
} from '@/services/${lowerPageName}';

export type ${upperPageName}ModelState = {
  ${lowerPageName}List: {
    list: any[];
  };
};

export type ${upperPageName}ModelType = {
  namespace: string;
  state: ${upperPageName}ModelState;
  effects: {
    get${upperPageName}List: Effect;
  };
  reducers: {
    updateState: Reducer;
  };
};

const ${upperPageName}Model: ${upperPageName}ModelType = {
  namespace: '${lowerPageName}',

  state: {
    ${lowerPageName}List: {
      list: [],
    },
  },

  effects: {
    *get${upperPageName}List({ payload }, { call, put }) {
      const res = yield call(get${upperPageName}List, payload);
      yield put({
        type: 'updateState',
        payload: {
          ${lowerPageName}List: {
            list: res ? res.map((l: any) => ({
              ...l, 
              id: l.${lowerPageName}Id,
              key: l.${lowerPageName}Id,
            })) : []
          },
        },
      });
    },
  },

  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default ${upperPageName}Model;

`;

exports.modelsContent = modelsContent;

const servicesContent = (upperPageName, lowerPageName) => `
import { MainDomain } from '@/utils/env';

import request from './decorator';
import originRequest from '@/utils/request';

export async function get${upperPageName}List(
  params: any,
): Promise<any> {
  return request(\`\${MainDomain}/${lowerPageName}\`, {
    params,
  });
}

export async function post${upperPageName}(
  params: any,
): Promise<any> {
  return originRequest(\`\${MainDomain}/${lowerPageName}\`, {
    method: 'POST',
    data: params,
  });
}
`;

exports.servicesContent = servicesContent;