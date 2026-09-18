/* =========================================================
   自动扫描 assets/icons/ 文件夹，生成 SITES 条目清单
   用法：node tools/scan-icons.js
   ========================================================= */
const fs   = require('fs');
const path = require('path');

const root      = path.join(__dirname, '..');
const iconDir   = path.join(root, 'assets', 'icons');
const outputFile= path.join(root, 'js', 'sites.generated.js');

if (!fs.existsSync(iconDir)) {
  console.error('❌ 找不到文件夹：' + iconDir);
  process.exit(1);
}

const exts = /\.(png|jpe?g|svg|webp|gif|ico|avif)$/i;

const files = fs.readdirSync(iconDir)
  .filter(f => exts.test(f))
  .sort((a, b) => a.localeCompare(b, 'zh-CN'));

if (!files.length) {
  console.warn('⚠️  assets/icons/ 里没有找到图片文件');
  process.exit(0);
}

const lines = files.map(f => {
  const base = path.parse(f).name;
  const name = base.charAt(0).toUpperCase() + base.slice(1);
  return `  { name: '${name}', icon: '${f}', url: '#', desc: '', color: 'ffffff' },`;
});

const content =
`/* =========================================================
   此文件由 tools/scan-icons.js 自动生成
   生成时间：${new Date().toLocaleString('zh-CN')}
   共 ${files.length} 个图标
   ---------------------------------------------------------
   把下面的条目复制到 js/config.js 的 SITES 数组里，
   再填写 url / desc / color 即可。
   ========================================================= */
const SITES = [
${lines.join('\n')}
];
`;

fs.writeFileSync(outputFile, content, 'utf8');
console.log(`✅ 已生成 ${files.length} 个条目 -> js/sites.generated.js`);
