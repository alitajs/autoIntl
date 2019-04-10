# autoIntl

一键提取项目中的中文，自动引入 `react-intl-universal` 。
特别适用于一开始项目没有国际化要求，快上线的时候，说要国际化的情景。

## 使用方法

```sh
$ npm i autoIntl -g
```

自动提取 src 目录下的所有的 `js|jsx` 文件

```sh
autoIntl src/
```

会在根目录下生成 i18n.js

```js
const langZh = {
  test_i18n_Y823: '姓名？',
  test_i18n_3MK2: '年，龄。',
  test_i18n_lP1N: '编（号）',
  test_i18n_NUbK: '哈哈哈！',
};
export default langZh;
```

例如：
test/index.js

```js
const cardNum = 123;
const ss = [
  {
    title: '姓名？',
  },
  {
    age: '年，龄。',
  },
  {
    id: '编（号）',
  },
  {
    job: '哈哈哈！',
  },
  {
    card: `银行卡号是${cardNum}，余额20万`,
  },
  {
    more: `更多信息是${cardNum}，余额20万`,
  },
];
```

运行

```sh
autoIntl test

 ✅ 国际化文件替换成功

 ✅ 国际化词条整理成功
✨  Done in 0.22s.
```

test/index.js

```js
import intl from 'react-intl-universal';
const cardNum = 123;
const ss = [
  {
    title: intl.get('test_i18n_k4ff'),
  },
  {
    age: intl.get('test_i18n_rXqn'),
  },
  {
    id: intl.get('test_i18n_LINE'),
  },
  {
    job: intl.get('test_i18n_ypGq'),
  },
  {
    card: `${intl.get('test_i18n_XiiD')}${cardNum}${intl.get('test_i18n_X5BP')}20${intl.get(
      'test_i18n_soPx'
    )}`,
  },
  {
    more: `${intl.get('test_i18n_8zH3')}${cardNum}${intl.get('test_i18n_X5BP')}20${intl.get(
      'test_i18n_soPx'
    )}`,
  },
];
```

生成 i18n.js

```js
const langZh = {
  test_i18n_k4ff: '姓名？',
  test_i18n_rXqn: '年，龄。',
  test_i18n_LINE: '编（号）',
  test_i18n_ypGq: '哈哈哈！',
  test_i18n_XiiD: '银行卡号是',
  test_i18n_X5BP: '，余额',
  test_i18n_soPx: '万',
  test_i18n_8zH3: '更多信息是',
};
export default langZh;
```

可以直接通过LocaleProvider,在项目中使用
```js
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import intl from 'react-intl-universal';

import langZh from './i18n';
// locale data
const locales = {
  'zh-CN': zhlang,
};
const compents = {
  'zh-CN': zhCN,
};

const getLocale = () => {
  // 服务器应返回当前请求ip所在区域，并设置在cookie里
  // 优先获取用户选择的语言
  let locale = getCookie('userLocale');
  if (!locale) {
    // 如果用户没有选择语言，获取服务器返回的区域语言
    locale = getCookie('areaLocale');
  }
  if (!locales[locale]) {
    // 不存在cookie 或者 不支持当前语言
    locale = 'zh-CN';
  }
  window.locale = locale;
  return locale;
};
ReactDOM.render(
  <LocaleProvider locale={compents[getLocale()]}>
    <Provider store={store}>
      <CApp />
    </Provider>
  </LocaleProvider>,
  document.getElementById('root')
);
```