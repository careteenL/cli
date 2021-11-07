export const jsContent = `
import React, { useState, useEffect, useRef } from 'react';
import { Button, message, Tooltip } from 'antd';
import FilterTable from '@focus/pro-filter-table';
import './index.less';

interface FilterRef {
  updateByCurFilter: () => void;
  resetAndReload: () => void;
  getCurrentFilter: () => Record<string, any>;
}

export default () => {
  const [refreshTimeStamp] = useState(Date.now());
  const tableData = { list: [
    {
      regionPath: '北京',
      updateTime: '2021-01-01 12:34:56',
      key: 1,
    },
    {
      regionPath: '成都',
      updateTime: '2021-01-01 12:34:56',
      key: 2,
    },
  ], timeStamp: 0, pageNo: 1, pageSize: 10, hasNext: false, total: 2 }
  const [tableDataTmp, setTableDataTmp] = useState(tableData);
  const tableRef = useRef<FilterRef>(null);
  const onAddMember = function () {
    message.warn('添加成员...')
  }
  const getList = function () {
    // update tableData after request api
  }
  const matchRows = function (row) {
    // return handle(row)
    return row
  }
  const onSelect = function (selectedRows) {
    // handle selectedRows
  }
  const onManageSort = (record) => {
    message.warn('管理楼盘展示排序...')
  }
  // options and treeData support belong to models' state
  const listFilter = [
    {
      id: 0,
      key: 'one',
      label: '筛选条件1',
      width: 170,
      type: 'select',
      options: [{
        value: 0,
        title: '选项1',
      },
      {
        value: 1,
        title: '选项2',
      }],
    },
    {
      id: 1,
      key: 'two',
      label: '筛选条件2',
      width: 170,
      type: 'treeSelect',
      placeholder: '请选择筛选条件2',
      customHandlerValue: (curNode) => {
        return {
          [curNode.key]: curNode.value
        }
      },
      treeData: [{
        value: 0,
        title: '选项1',
        children: [{
          value: 1,
          title: '选项1-1',
        }]
      }],
    },
  ];
  const columns = [
    {
      title: '所属区域',
      dataIndex: 'regionPath',
      key: 'regionPath',
      width: 270,
      align: 'left',
      render: (regionPath: any) => (
        <Tooltip placement="topLeft" title={regionPath}>
          <span style={{ maxWidth: '270px' }}>
            {regionPath}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
      width: 180,
    },    
    {
      title: '操作',
      width: 200,
      key: 'action',
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <span key={record.id}>
            <Button style={{ fontSize: '12px' }} type="link" onClick={() => onManageSort(record)}>
              管理楼盘展示排序
            </Button>
          </span>
        );
      },
    },
  ];
  useEffect(() => {
    if (tableData.timeStamp) {
      setTableDataTmp(tableData);
    }
  }, [tableData]);

  return (
    <FilterTable
      ref={tableRef}
      hideTitle={false}
      supportSelect={true}
      refreshTimeStamp={refreshTimeStamp}
      selectedRecords={['1', '2', '3']}
      onSelect={onSelect}
      title={'楼盘列表'}
      // loading={loading}
      createNewData={{ label: '添加成员', operate: onAddMember }}
      searchColumns={listFilter}
      searchApi={getList}
      tableColumns={columns}
      tableData={tableDataTmp}
      matchTableData={matchRows}
      scroll={{ x: '800px', y: '270px' }}
    />
  )
};
`;

export const cssContent = `
// TODO: write here ...
`;

export const modelsContent = (upperPageName: string, lowerPageName: string) => (`
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

`);

export const servicesContent = (upperPageName: string, lowerPageName: string) => (`
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
`);
