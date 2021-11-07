export const nginxContent = (env = 'dev', index?: number) => `upstream xxx-res-${env}${
  index || ''
}.cn {
  server 127.0.0.1:8099;
}
`;
