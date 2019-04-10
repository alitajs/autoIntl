const fs = require('fs');
const path = require('path');
const randomstring = require('randomstring');
const argv = process.argv;

let file = argv[2];

const wordArr = [];
const totalArr = [];
// console.log('file', argv);
if (!file) {
  console.error('⚠️ ⚠️ ⚠️ the file path must be required');
  process.exit();
}

const pathArr = []
const readDir = (path) => {
  const exists = fs.existsSync(path);
  const stat = fs.statSync(path);
  if (exists && stat) {
    if (stat.isFile()) {
      pathArr.push(path)
      return;
    }

    const handleFile = fs.readdirSync(path);
    if (handleFile && handleFile.length) {
      handleFile.forEach(item => {
        readDir(`${path}/${item}`)
      })
    }
  }
}

readDir(`${process.cwd()}/${file}`)

const write = [];
pathArr.forEach((item, i) => {
  if (!(['.js', '.jsx'].indexOf(path.extname(item)) > -1)) return;
  let pathStr;
  let ext = ['.js', '.jsx'][['.js', '.jsx'].indexOf(path.extname(item))];
  pathStr = path.basename(item, ext)
  if (pathStr === 'index') {
    pathStr = (((path.parse(item)).dir).split(path.sep)).pop();
  }

  const data = fs.readFileSync(item, "utf8");
  let gData = filterText(data, pathStr);
  if (!/react-intl-universal/.test(gData)) {
    gData = "import intl from 'react-intl-universal';\n" + gData;
  }
  fs.writeFileSync(item, gData, 'utf8');
})


if (pathArr.length) {
  console.log();
  console.log(' ✅ 国际化文件替换成功');
  wordArr.forEach((o) => {
    const value = `${o.key}: '${o.value}',`
    write.push(value)
  });
  const str = `const langZh = {\n ${write.join("\n")} };\n export default langZh;`
  fs.writeFileSync('i18n.js', str, 'utf8');
  console.log();
  console.log(' ✅ 国际化词条整理成功');
}

function filterText(text, objName) {
  let pattern = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)|((=)?(\s+)?(|`|"|')?(\s+)?([\u4e00-\u9faf]|\uFF1F|\u3002|\uFF01|\uFF0C|\u3001|\uFF1B|\uFF1A|\u300C|\u300D|\u300E|\u300F|\u2018|\u2019|\u201C|\u201D|\uFF08|\uFF09|\u3014|\u3015|\u3010|\u3011|\u2014|\u300A|\u300B|\u3008|\u3009)+('|"|`)?)/g

  return text.replace(pattern, (word) => {
    if (!(/^\/{2,}/.test(word) || /^\/\*/.test(word)) && /([\u4e00-\u9faf]|\uFF1F|\u3002|\uFF01|\uFF0C|\u3001|\uFF1B|\uFF1A|\u300C|\u300D|\u300E|\u300F|\u2018|\u2019|\u201C|\u201D|\uFF08|\uFF09|\u3014|\u3015|\u3010|\u3011|\u2014|\u300A|\u300B|\u3008|\u3009)+/g.test(word)) {
      let uuid = randomstring.generate(4);
      let currentObj = []
      let str
      if (totalArr.length && totalArr.indexOf((word.match(/([\u4e00-\u9faf]|\uFF1F|\u3002|\uFF01|\uFF0C|\u3001|\uFF1B|\uFF1A|\u300C|\u300D|\u300E|\u300F|\u2018|\u2019|\u201C|\u201D|\uFF08|\uFF09|\u3014|\u3015|\u3010|\u3011|\u2014|\u300A|\u300B|\u3008|\u3009)+/g))[0])) {
        currentObj = wordArr.filter(item => item.value === (word.match(/([\u4e00-\u9faf]|\uFF1F|\u3002|\uFF01|\uFF0C|\u3001|\uFF1B|\uFF1A|\u300C|\u300D|\u300E|\u300F|\u2018|\u2019|\u201C|\u201D|\uFF08|\uFF09|\u3014|\u3015|\u3010|\u3011|\u2014|\u300A|\u300B|\u3008|\u3009)+/g))[0])
      }

      if (currentObj.length) {
        str = `intl.get('${currentObj[0].key}')`;
      } else {
        str = `intl.get('${objName}_i18n_${uuid}')`;
        totalArr.push((word.match(/([\u4e00-\u9faf]|\uFF1F|\u3002|\uFF01|\uFF0C|\u3001|\uFF1B|\uFF1A|\u300C|\u300D|\u300E|\u300F|\u2018|\u2019|\u201C|\u201D|\uFF08|\uFF09|\u3014|\u3015|\u3010|\u3011|\u2014|\u300A|\u300B|\u3008|\u3009)+/g))[0]);
        wordArr.push({
          key: `${objName}_i18n_${uuid}`,
          value: `${(word.match(/([\u4e00-\u9faf]|\uFF1F|\u3002|\uFF01|\uFF0C|\u3001|\uFF1B|\uFF1A|\u300C|\u300D|\u300E|\u300F|\u2018|\u2019|\u201C|\u201D|\uFF08|\uFF09|\u3014|\u3015|\u3010|\u3011|\u2014|\u300A|\u300B|\u3008|\u3009)+/g))[0]}`,
        })
      }

      if (/=/.test(word)) return word.replace(/(`|"|')?(\s+)?([\u4e00-\u9faf]|\uFF1F|\u3002|\uFF01|\uFF0C|\u3001|\uFF1B|\uFF1A|\u300C|\u300D|\u300E|\u300F|\u2018|\u2019|\u201C|\u201D|\uFF08|\uFF09|\u3014|\u3015|\u3010|\u3011|\u2014|\u300A|\u300B|\u3008|\u3009)+(\s+)?('|"|`)?/, `\{${str}\}`);
      if (/(`|"|')(\s+)?([\u4e00-\u9faf]|\uFF1F|\u3002|\uFF01|\uFF0C|\u3001|\uFF1B|\uFF1A|\u300C|\u300D|\u300E|\u300F|\u2018|\u2019|\u201C|\u201D|\uFF08|\uFF09|\u3014|\u3015|\u3010|\u3011|\u2014|\u300A|\u300B|\u3008|\u3009)+(\s+)?('|"|`)/.test(word)) return word.replace(/(`|"|')?(\s+)?([\u4e00-\u9faf]|\uFF1F|\u3002|\uFF01|\uFF0C|\u3001|\uFF1B|\uFF1A|\u300C|\u300D|\u300E|\u300F|\u2018|\u2019|\u201C|\u201D|\uFF08|\uFF09|\u3014|\u3015|\u3010|\u3011|\u2014|\u300A|\u300B|\u3008|\u3009)+(\s+)?('|"|`)?/, `${str}`);
      return word.replace(/([\u4e00-\u9faf]|\uFF1F|\u3002|\uFF01|\uFF0C|\u3001|\uFF1B|\uFF1A|\u300C|\u300D|\u300E|\u300F|\u2018|\u2019|\u201C|\u201D|\uFF08|\uFF09|\u3014|\u3015|\u3010|\u3011|\u2014|\u300A|\u300B|\u3008|\u3009)+/, `$\{${str}\}`);
    }

    return word
  })
}