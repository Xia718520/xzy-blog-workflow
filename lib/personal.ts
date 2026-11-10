// 夏正印（GeneXia）个人品牌资产注册表 — The Personal Registry for GeneXia
// 全站严禁出现“星火”错别字

export interface BrandConfig {
  name: string
  enName: string
  tagline: string
  taglineEn: string
  bio: string
  bioEn: string
  heroIntroZh?: string
  heroIntroEn?: string
  sectionIntroBlog?: string
  sectionIntroBlogEn?: string
  sectionIntroProjects?: string
  sectionIntroProjectsEn?: string
  sectionIntroPhotos?: string
  sectionIntroPhotosEn?: string
  avatar: string
  headshotLight: string
  headshotDark: string
  poster: string
  location: string
  timezone?: string
  timezoneLabel?: string
  city?: string
  locationCoordinates: {
    lat: string
    lng: string
  }
}

export const brandConfig: BrandConfig = {
  name: '夏正印',
  enName: 'GeneXia',
  tagline: '以技术为底色，以沟通为桥梁，以成长为信仰；不甘于定义自己，始终保持好奇与野心，在技术与商业的交汇处，探索更广阔的世界',
  taglineEn:
    'Technology as the foundation, communication as the bridge, growth as the faith; never defined by others, always curious and ambitious, exploring a wider world where technology meets business',
  bio: '不甘于定义自己，始终保持好奇与野心，在技术与商业的交汇处，探索更广阔的世界。',
  bioEn:
    'Unwilling to be defined by others, always curious and ambitious, exploring a wider world where technology meets business.',
  heroIntroZh: '以技术为底色，以沟通为桥梁，以成长为信仰；',
  heroIntroEn: 'a technologist grounded in technology, a communicator building bridges, and a believer in growth. ',
  avatar: '/images/avatar.png',
  headshotLight: '/images/headshot.jpg',
  headshotDark: '/images/portrait-square.jpg',
  poster: '/images/portrait-poster.jpg',
  location: 'Wuhan, Hubei, China (UTC+8)',
  timezone: 'Asia/Shanghai',
  timezoneLabel: 'UTC+8',
  city: '武汉',
  locationCoordinates: {
    lat: '30.5928° N',
    lng: '114.3055° E',
  },
}

export const personalInfo = {
  name: '夏正印',
  enName: 'GeneXia',
  email: '2724152780@qq.com',
  handle: 'GeneXia',
  githubUser: 'Xia718520',
  github: 'https://github.com/Xia718520',
  xiaoHongShu: '', // 小红书没有主页外链，改以二维码渠道展示（见 lib/channels.ts 的 extraChannels）
  xiaoBaoTong: '', // 仅做字样展示，后续有真实专栏时再接入跳转
  weChatOfficial: 'XooZooY99',
  weChatOfficialQr: '/images/wechat-qr.jpg',
}

export interface NavItem {
  href: string
  zh: string
  en: string
  description?: string
  descriptionEn?: string
}

export const navItems: readonly NavItem[] = [
  { href: '/', zh: '首页', en: 'Home', description: '关于与全景', descriptionEn: 'About & Overview' },
  { href: '/blog', zh: '写作', en: 'Writing', description: '深度思考与公开记录', descriptionEn: 'Essays & Learnings' },
  { href: '/projects', zh: '项目', en: 'Projects', description: '代表作与真实成果', descriptionEn: 'Selected Works' },
  { href: '/photos', zh: '相册', en: 'Photos', description: '视觉画廊与海报记录', descriptionEn: 'Visual Gallery' },
] as const

export interface Experience {
  company: string
  companyEn: string
  role: string
  roleEn: string
  from: string
  to?: string
  url?: string
}

// 三段企业实习，按起始时间倒序
export const experience: Experience[] = [
  {
    company: 'NIO上海蔚来汽车有限公司',
    companyEn: 'NIO',
    role: 'AI 全栈开发实习生',
    roleEn: 'AI Full-Stack Developer Intern',
    from: '2026.04',
    to: '2026.10',
  },
  {
    company: '福鑫数科（杭州）人工智能有限公司',
    companyEn: 'Fuxin AI (Hangzhou)',
    role: '全栈开发实习生',
    roleEn: 'Full-Stack Developer Intern',
    from: '2025.11',
    to: '2026.04',
  },
  {
    company: '华程国际旅行社集团',
    companyEn: 'Huacheng International Travel Group',
    role: '前端开发实习生',
    roleEn: 'Frontend Developer Intern',
    from: '2025.06',
    to: '2025.11',
  },
]

export interface Record_ {
  artist: string
  album: string
  year: number
  genre: string
  spineColor: string
  spineInk: string
  url: string
  art: string
  cover: string
  mood: string
  moodEn: string
  comment: string
  commentEn: string
  audioSrc?: string
}

// 6 首循环播放歌单封面与外链
export const records: Record_[] = [
  {
    artist: 'Annika Wells',
    album: 'Sucks Being Sober',
    year: 2021,
    genre: 'Pop',
    spineColor: '#f32e01',
    spineInk: '#f7f4ed',
    art: '/images/records/sucks-being-sober.jpg',
    cover: '/images/records/sucks-being-sober.jpg',
    url: 'https://music.163.com/#/song?id=1811376825',
    mood: '周末夜听',
    moodEn: 'For Weekend Nights',
    comment: '清醒的代价听起来太无聊，这首把微醺前的雀跃唱得理直气壮。',
    commentEn: 'Sobriety never sounded so dull; this one wears its pre-drunk glee with pride.',
  },
  {
    artist: 'The Weeknd',
    album: 'Starboy',
    year: 2016,
    genre: 'R&B',
    spineColor: '#c70432',
    spineInk: '#f7f4ed',
    art: '/images/records/starboy.jpg',
    cover: '/images/records/starboy.jpg',
    url: 'https://music.163.com/#/song?id=431610014',
    mood: '自信时听',
    moodEn: 'For Confidence',
    comment: '合成器一响气场全开，夜路也能走出红毯感。',
    commentEn: 'Synths hit and the aura switches on—every night walk becomes a runway.',
  },
  {
    artist: '卢广仲',
    album: '100种生活',
    year: 2008,
    genre: 'Folk',
    spineColor: '#aabd7f',
    spineInk: '#171717',
    art: '/images/records/100-zhong-sheng-huo.jpg',
    cover: '/images/records/100-zhong-sheng-huo.jpg',
    url: 'https://music.163.com/#/song?id=109616',
    mood: '发呆时听',
    moodEn: 'For Daydreams',
    comment: '用一百种假设安抚没走过的路，木吉他一扫愁绪尽消。',
    commentEn: 'A hundred hypothetical lives to soothe the roads not taken, swept away by one acoustic strum.',
  },
  {
    artist: 'The Weepies',
    album: 'Gotta Have You',
    year: 2006,
    genre: 'Folk',
    spineColor: '#557536',
    spineInk: '#f7f4ed',
    art: '/images/records/gotta-have-you.jpg',
    cover: '/images/records/gotta-have-you.jpg',
    url: 'https://music.163.com/#/song?id=19572271',
    mood: '想念时听',
    moodEn: 'For Missing Someone',
    comment: '轻声絮语里的坦荡告白，想念一个人时最好的背景音。',
    commentEn: 'An easygoing confession in whispery folk—the best backdrop when someone’s on your mind.',
  },
  {
    artist: 'SZA',
    album: 'Snooze',
    year: 2022,
    genre: 'R&B',
    spineColor: '#345d7d',
    spineInk: '#f7f4ed',
    art: '/images/records/snooze.jpg',
    cover: '/images/records/snooze.jpg',
    url: 'https://music.163.com/#/song?id=2004563430',
    mood: '赖床时听',
    moodEn: 'For Slow Mornings',
    comment: '慵懒声线里的清醒提醒：别在不值得的人身上打瞌睡。',
    commentEn: 'A lazy drawl with a sharp edge: don’t doze off on the wrong one.',
  },
  {
    artist: 'Taylor Swift',
    album: 'Back To December',
    year: 2010,
    genre: 'Country Pop',
    spineColor: '#60442c',
    spineInk: '#f7f4ed',
    art: '/images/records/back-to-december.jpg',
    cover: '/images/records/back-to-december.jpg',
    url: 'https://music.163.com/#/song?id=19293014',
    mood: '怀念时听',
    moodEn: 'For Nostalgia',
    comment: '迟到的歉意写成流行抒情，冬天适合听遗憾慢慢化开。',
    commentEn: 'A belated apology wrapped in country-pop shimmer; regret thawing out in winter.',
  },
]

export interface Book {
  title: string
  author: string
  year: number
  category: string
  spineTitle?: string
  spineAuthor?: string
  spineColor: string
  spineInk: string
  art: string
  cover: string
  coverWidth?: number
  coverHeight?: number
  spine?: number
  url: string
  comment: string
  commentEn: string
}

// 8 本珍藏原书正封与直达链接
export const books: Book[] = [
  {
    title: '史蒂夫·乔布斯传',
    author: '沃尔特·艾萨克森',
    year: 2011,
    category: '人物传记',
    spineTitle: '乔布斯传',
    spineAuthor: 'WI',
    spineColor: '#e2e2e2',
    spineInk: '#171717',
    art: '/images/books/steve-jobs.jpg',
    cover: '/images/books/steve-jobs.jpg',
    coverWidth: 1127,
    coverHeight: 1503,
    spine: 28,
    url: 'https://book.douban.com/subject/6831742/',
    comment: '把产品当作品做。打动我的不是改变世界的大话，而是连机箱里面看不见的走线都要规整——凡是交付给别人的东西，自己得先看得起。',
    commentEn: 'Treat products as craft. What struck me wasn\'t grand slogans, but making even unseen internal wiring tidy—if you ship it, respect your own craft first.',
  },
  {
    title: '原则',
    author: '瑞·达利欧',
    year: 2018,
    category: '商业思考',
    spineTitle: '原则',
    spineAuthor: 'RD',
    spineColor: '#c53929',
    spineInk: '#f7f4ed',
    art: '/images/books/principles.jpg',
    cover: '/images/books/principles.jpg',
    coverWidth: 1536,
    coverHeight: 2048,
    spine: 26,
    url: 'https://book.douban.com/subject/27608239/',
    comment: '做事情最怕掩耳盗铃。把碰到的每次翻车、每次卡住都当成机器里的齿轮故障，写成复盘清单。机器坏了修机器，别陷入情绪内耗。',
    commentEn: 'Don\'t deceive yourself. Treat every failure or bottleneck as a mechanical glitch to log and fix, rather than wallowing in emotional exhaustion.',
  },
  {
    title: '思考，快与慢',
    author: '丹尼尔·卡尼曼',
    year: 2012,
    category: '认知心理',
    spineTitle: '思考快与慢',
    spineAuthor: 'DK',
    spineColor: '#ffffff',
    spineInk: '#171717',
    art: '/images/books/thinking-fast-and-slow.jpg',
    cover: '/images/books/thinking-fast-and-slow.jpg',
    coverWidth: 768,
    coverHeight: 1024,
    spine: 24,
    url: 'https://book.douban.com/subject/10786473/',
    comment: '直觉往往让人急于求成、浮于表面。每次觉得“稳了”或者“做不到”时，停下来强迫自己把逻辑步长拆细，看看到底卡在哪一步。',
    commentEn: 'Intuition often makes us rush into shallow assumptions. Whenever I feel "done" or "hopeless", I force myself to slow down and trace the exact breakdown step by step.',
  },
  {
    title: '价值心法',
    author: '姜胡说',
    year: 2023,
    category: '商业认知',
    spineTitle: '价值心法',
    spineAuthor: 'JHS',
    spineColor: '#1d2a44',
    spineInk: '#f7f4ed',
    art: '/images/books/value-mindset.jpg',
    cover: '/images/books/value-mindset.jpg',
    coverWidth: 563,
    coverHeight: 800,
    spine: 22,
    url: 'https://book.douban.com/subject/36528726/',
    comment: '江湖老师教的五环闭环：需求、供给、触达、交换、反馈。没有解决真实需求，再花哨的技术也是空中楼阁；一次解决一个真问题，交付物才是硬道理。',
    commentEn: 'The five-loop closed loop from Jianghu: demand, supply, outreach, exchange, feedback. Tech is meaningless without real problems; deliver tangible value every single time.',
  },
  {
    title: '纳瓦尔宝典',
    author: '埃里克·乔根森',
    year: 2022,
    category: '人生哲学',
    spineTitle: '纳瓦尔宝典',
    spineAuthor: 'EJ',
    spineColor: '#d6cbb8',
    spineInk: '#171717',
    art: '/images/books/naval-almanack.jpg',
    cover: '/images/books/naval-almanack.jpg',
    coverWidth: 560,
    coverHeight: 800,
    spine: 22,
    url: 'https://book.douban.com/subject/35860718/',
    comment: '专科生没有耀眼的背书，但可以用代码和内容做杠杆。打造属于自己的独到经验，公开构建、真实记录，让每一次自学都有迹可循。',
    commentEn: 'Without elite credentials, code and content are our levers. Build unique insights, build in public, and ensure every self-taught milestone leaves verifiable proof.',
  },
  {
    title: '富兰克林自传',
    author: '本杰明·富兰克林',
    year: 1791,
    category: '人物传记',
    spineTitle: '富兰克林自传',
    spineAuthor: 'BF',
    spineColor: '#583e2e',
    spineInk: '#f7f4ed',
    art: '/images/books/benjamin-franklin.jpg',
    cover: '/images/books/benjamin-franklin.jpg',
    coverWidth: 600,
    coverHeight: 800,
    spine: 24,
    url: 'https://book.douban.com/subject/1007056/',
    comment: '一个印刷学徒凭着自学日积月累改变命运。他的美德清单本质就是可落地的日常自律系统——不画大饼，把手头每件小事踏踏实实做周全。',
    commentEn: 'A printer\'s apprentice who transformed his destiny through self-study. His virtue ledger is a daily operating system—no empty promises, just steady craftsmanship.',
  },
  {
    title: '穷查理宝典',
    author: '彼得·考夫曼',
    year: 2005,
    category: '投资与智慧',
    spineTitle: '穷查理宝典',
    spineAuthor: 'CM',
    spineColor: '#1a2732',
    spineInk: '#f7f4ed',
    art: '/images/books/poor-charlie.jpg',
    cover: '/images/books/poor-charlie.jpg',
    coverWidth: 1364,
    coverHeight: 1819,
    spine: 28,
    url: 'https://book.douban.com/subject/26938981/',
    comment: '想明白怎么做之前，先列出怎么做一定会完蛋。避开偷懒、浮躁和装懂这些显而易见的大坑，脚踏实地走稳每一步，路就走对了。',
    commentEn: 'Before figuring out success, list what guarantees disaster. Invert the problem, avoid laziness and pretense, and progress takes care of itself.',
  },
  {
    title: '刻意练习',
    author: '安德斯·埃里克森',
    year: 2016,
    category: '技能精进',
    spineTitle: '刻意练习',
    spineAuthor: 'AE',
    spineColor: '#c89d66',
    spineInk: '#171717',
    art: '/images/books/deliberate-practice.jpg',
    cover: '/images/books/deliberate-practice.jpg',
    coverWidth: 768,
    coverHeight: 1024,
    spine: 24,
    url: 'https://book.douban.com/subject/26886321/',
    comment: '自学不是漫无目的地看视频刷教程，而是给自己设计明确的靶子，做完立刻看结果对不对。在拉伸区反复碰壁、校准，能力才能真正长在身上。',
    commentEn: 'Self-learning isn\'t passively watching tutorials. It\'s aiming at concrete targets, getting immediate feedback, and stretching outside comfort until skills stick.',
  },
]
