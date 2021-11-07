import axios from 'axios';

function getPackageVersion(id: string, range = '') {
  // const registry = (await require('./shouldUseTaobao')())
  //   ? `https://registry.npm.taobao.org`
  //   : `https://registry.npmjs.org`;
  const registry = 'https://registry.npm.taobao.org'; // TODO区分npm源
  return axios.get(
    // 关于npm对package的定义 https://docs.npmjs.com/about-packages-and-modules
    `${registry}/${encodeURIComponent(id).replace(/^%40/, '@')}/${range}`,
  );
}
export default getPackageVersion;
