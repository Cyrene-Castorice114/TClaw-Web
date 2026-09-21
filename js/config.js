/* =========================================================
   个人主页配置
   ========================================================= */

/* ---------- 个人信息 ---------- */
const PROFILE = {
  avatar: 'assets/avatar/avatar.jpg',
  name:   'Terror Claw-Miao Neko',
  role:   'Bash-Shell 脚本开发者',
  bio:    '喵～16岁高二高中生，平时喜欢摸摸鱼，敲敲代码(其实全程都在玩捏)，是一个不干正经事的猫猫喵',
  email:  'castorice0914@hoha.top',
};

/* ---------- 右侧面板标题 ---------- */
const PANEL = {
  title:    '能找到TClaw的链接',
  subtitle: '找到了就代表TClaw喜欢你哦~',
};

/* ---------- 网站列表 ---------- */
const SITES = [
  { name: 'GitHub',   url: 'https://github.com/Cyrene-Castorice114', desc: '关注咱的Github账号', color: 'ffffff' },
  { name: 'Gitcode',  url: 'https://gitcode.com/Cyrene-Castorice',   desc: '咱的Gitcode页面咪', color: '1E80FF' },
  { name: '哔哩哔哩', url: 'https://space.bilibili.com/1668108830?spm_id_from=333.337.0.0', desc: '咱的Bilibili账号咪', color: '00A1D6' },
  { name: 'Discord',  url: 'https://www.discord.com/',               desc: '添加TClaw的Discord联系方式ww', color: '0084FF' },
  { name: 'QQ',       url: 'https://qm.qq.com/q/BmZKPqSlyw',         desc: '添加TClaw的QQ喵', color: 'ffffff' },
  { name: 'Mail',     url: 'mailto:castorice0914@hoha.top',          desc: '使用邮箱联系TClaw捏～', color: 'EA4335' },
  { name: 'Telegram', url: 'https://t.me/',                          desc: '阿巴阿巴,TG是什么东西喵？', color: '26A5E4' },
  { name: 'X',        url: 'https://x.com/dmina423598',                         desc: '查看TClaw的X界面', color: 'ffffff' },
  { name: 'YouTube',  url: 'https://www.youtube.com/@HoshinoAiAWA',                   desc: '油管？输油的东西嘛...', color: 'FF0000' },
];

/* ---------- 额外栏目 ----------
   type: cards | projects | friends | tags | list
   --------------------------------------------------------- */
const SECTIONS = [

  /* 开源项目 */
  {
    title: '开源项目',
    subtitle: 'TClaw上传的开源仓库',
    type: 'projects',
    items: [
      {
        name: 'Capha-Script',
        desc: '可在Linux以及移动端Termux上运行的Bash-shell脚本工具箱',
        tags: ['Bash', 'Linux', 'Termux'],
        color: 'a78bfa',
        sources: [
          {
            label:    'GitHub',
            repo:     'https://github.com/Cyrene-Castorice114/Capha-Script',
          },
          {
            label:    'Gitcode',
            repo:     'https://gitcode.com/Cyrene-Castorice/Capha-Script',
          },
        ],
        readme: 'https://raw.githubusercontent.com/Cyrene-Castorice114/Capha-Script/main/README.md',
      },
      {
        name: 'TClaw_Web',
        desc: 'TClaw网站源码',
        tags: ['CSS', 'HTML', 'JS'],
        color: '60a5fa',
        sources: [
          {
            label:    'GitHub',
            repo:     'https://github.com/Cyrene-Castorice114/TClaw-Web',
            download: 'https://github.com/Cyrene-Castorice114/TClaw-Web/releases/latest/download/TClaw_web.zip'
          },
          {
            label:    'Gitcode',
            repo:     'https://gitcode.com/Cyrene-Castorice/TClaw-Web',
            download: 'https://raw.gitcode.com/Cyrene-Castorice/TClaw-Web/archive/refs/heads/1.0.1.zip',
          },
        ],
        readme: 'https://raw.githubusercontent.com/Cyrene-Castorice114/TClaw-Web/main/README.md',
      },
    ],
  },

  /* 技能栈 */
  {
    title: 'TClawの技能',
    subtitle: '还不如了解一下了解TClaw都擅长什么呢',
    type: 'tags',
    items: [
      'JavaScript', 'Python', 'C++', 'Servers',
      'Linux', 'Bash', 'CSS', 'HTML',
    ],
  },

  /* 友情链接 */
  {
    title: '友情链接',
    subtitle: 'TClaw的朋友圈以及网站/工具推荐',
    type: 'friends',
    items: [
      { name: '梦娘の导航页',      url: 'https://link.mengniang.ink', desc: 'ElectricityDream Space Web', color: 'a78bfa', icon: 'https://link.mengniang.ink/images/favicon.png' },
      { name: 'NAS油条总站',       url: 'https://nasyt.hoha.top',     desc: 'NAS油条总站🤓🤓👍',          color: '60a5fa' },
      { name: 'NAS油条的jm本子站', url: 'https://jm.ljgy.site',       desc: 'NAS油条的本子网站🤯',        color: '34d399' },
    ],
  },

];