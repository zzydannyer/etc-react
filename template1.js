/* eslint-disable import/no-commonjs */
/**
 * pages模版快速生成脚本,执行命令 npm run tep `文件名`
 */

const fs = require('fs');
// import addTep from './template/tep1/add.js'

const dirName = process.argv[2];

if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：npm run tep rest');
  process.exit(0);
}
const addTep = require('./template/tep1/add.js');
const indexTep = require('./template/tep1/indexTep.js');
const ruleTep = require('./template/tep1/ruleTep.js');
const interfaceTep = require('./template/tep1/interfaceTep.js');
const detialTep = require('./template/tep1/detialTep.js');

// less文件模版
const lessTep = `

 `;

fs.mkdirSync(`./src/pages/${dirName}`); // mkdir $1
process.chdir(`./src/pages/${dirName}`); // cd $1

fs.writeFileSync(`${dirName}.tsx`, indexTep);
fs.writeFileSync(`${dirName}.less`, lessTep);
fs.writeFileSync(`${dirName}.interface.ts`, interfaceTep);

fs.mkdirSync(`_part`);
process.chdir(`_part`);
fs.mkdirSync(`Add`);
process.chdir(`Add`);
fs.writeFileSync(`index.tsx`, addTep);
fs.writeFileSync(`rules.tsx`, ruleTep);
process.chdir(`../`);
fs.mkdirSync(`Detail`);
process.chdir(`Detail`);
fs.writeFileSync(`index.tsx`, detialTep);

console.log(`模版${dirName}已创建,需要手动添加路由`);

process.exit(0);
