"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsContent = exports.cssContent = void 0;
const jsContent = `
import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import './index.less';

interface IProps {
  currentUser?: CurrentUser;
}
const Component: React.FC<IProps> = (props) => {
  console.log(props);
  return <div>Component</div>;
};

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(Component);
`;
exports.jsContent = jsContent;
const cssContent = `
// TODO: write here ...
`;
exports.cssContent = cssContent;