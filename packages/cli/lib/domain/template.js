"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nginxContent = void 0;

const nginxContent = (env = 'dev', index) => `upstream xxx-res-${env}${index || ''}.cn {
  server 127.0.0.1:8099;
}
`;

exports.nginxContent = nginxContent;