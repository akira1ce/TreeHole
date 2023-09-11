import { IntlShape } from 'react-intl';

/**
 * getLocalMap
 * @param intl intl 实例
 * @param localConfig 国际化配置
 * @returns 
 */
function getLocalMap<T>(intl: IntlShape, localConfig: T) {
  const localmap: T = {};
  const localKeys = Object.keys(localConfig);

  localKeys.map((item) => {
    localmap[item] = intl.formatMessage({ id: item, defaultMessage: 'undefined' });
  });

  return localmap;
}

export default getLocalMap;
