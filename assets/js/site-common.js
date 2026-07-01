/*
 * site-common.js
 * books.shioki.com の新ページ群（milestone / dashboard / shelves / graph）で共有する
 * ラベル辞書・言語ヘルパ・データ取得ユーティリティ。
 * 既存の index.html / authors.html のインライン定義と整合させること。
 * グローバル window.BooksCommon として公開する（ES module ではない）。
 */
(function (global) {
  'use strict';

  var LANGS = ['ja', 'en', 'zh-tw'];

  var LANG_LABELS = { ja: '日本語', en: 'English', 'zh-tw': '繁體中文' };

  // index.html / authors.html の CATEGORY_LABELS と同期すること
  var CATEGORY_LABELS = {
    'すべて':               { en: 'All',                'zh-tw': '全部' },
    '小説':                 { en: 'Novel',              'zh-tw': '小說' },
    'ビジネス・経済':       { en: 'Business',           'zh-tw': '商業經濟' },
    'ビジネス教育':         { en: 'Business Education', 'zh-tw': '商業教育' },
    '参考図書・白書':       { en: 'References & White Papers', 'zh-tw': '參考書與白皮書' },
    '社会・思想':           { en: 'Society',            'zh-tw': '社會思想' },
    'エッセイ・ノンフィクション': { en: 'Essay',        'zh-tw': '散文紀實' },
    '技術・サイエンス':     { en: 'Tech',               'zh-tw': '技術科學' },
    '文学・評論':           { en: 'Literature & Criticism', 'zh-tw': '文學與評論' },
    '本・図書館':           { en: 'Books & Libraries',  'zh-tw': '圖書與圖書館' },
    '読書法':               { en: 'Reading Methods',    'zh-tw': '讀書法' },
    'エッセー・随筆':       { en: 'Essays',             'zh-tw': '散文隨筆' },
    '日本のエッセー・随筆': { en: 'Japanese Essays',    'zh-tw': '日本散文隨筆' },
    '外国のエッセー・随筆': { en: 'Foreign Essays',     'zh-tw': '外國散文隨筆' },
    '近現代の作品':         { en: 'Modern Works',       'zh-tw': '近現代作品' },
    '歴史・地理':           { en: 'History & Geography','zh-tw': '歷史與地理' },
    '世界史':               { en: 'World History',      'zh-tw': '世界史' },
    'ヨーロッパ史':         { en: 'European History',   'zh-tw': '歐洲史' },
    'ヨーロッパ史一般':     { en: 'European History (General)', 'zh-tw': '歐洲史概論' },
    '歴史学':               { en: 'Historiography',     'zh-tw': '歷史學' },
    '経営学・キャリア・MBA': { en: 'Management / Career / MBA', 'zh-tw': '經營學・職涯・MBA' },
    '資格・就職・MBA':      { en: 'Certification / Career / MBA', 'zh-tw': '資格・就職・MBA' },
    'MBA(経営学修士)':      { en: 'MBA',                'zh-tw': 'MBA（企管碩士）' },
    '小説・文芸':           { en: 'Fiction & Literature','zh-tw': '小說與文藝' },
    '日本の小説・文芸':     { en: 'Japanese Fiction',   'zh-tw': '日本小說與文藝' },
    '医学・薬学':           { en: 'Medicine & Pharmacy','zh-tw': '醫學與藥學' },
    '社会・政治':           { en: 'Society & Politics', 'zh-tw': '社會與政治' },
    '政治':                 { en: 'Politics',           'zh-tw': '政治' },
    '政治入門':             { en: 'Politics (Intro)',   'zh-tw': '政治入門' },
    'ノンフィクション':     { en: 'Nonfiction',         'zh-tw': '非虛構' },
    '評論・文学研究':       { en: 'Criticism & Literary Studies', 'zh-tw': '評論與文學研究' },
    '外国文学研究':         { en: 'Foreign Literature Studies', 'zh-tw': '外國文學研究' },
    '英米文学':             { en: 'British & American Literature', 'zh-tw': '英美文學' },
    'その他の外国文学':     { en: 'Other Foreign Literature', 'zh-tw': '其他外國文學' },
    'イギリス・アメリカ':   { en: 'UK & America',       'zh-tw': '英國與美國' },
    '暮らし・健康・子育て': { en: 'Lifestyle / Health / Parenting', 'zh-tw': '生活・健康・育兒' },
    '趣味・実用':           { en: 'Hobbies & Practical', 'zh-tw': '趣味與實用' },
    'スポーツ':             { en: 'Sports',               'zh-tw': '體育' },
    'スポーツ・アウトドア': { en: 'Sports & Outdoors',    'zh-tw': '運動與戶外' },
    'アート・建築・デザイン': { en: 'Art, Architecture & Design', 'zh-tw': '藝術・建築與設計' },
    '写真':                 { en: 'Photography',        'zh-tw': '攝影' },
    '写真技術':             { en: 'Photographic Technique', 'zh-tw': '攝影技術' },
    'クッキング・レシピ':   { en: 'Cooking & Recipes',  'zh-tw': '烹飪與食譜' },
    '家事・生活の知識':     { en: 'Housekeeping & Lifestyle', 'zh-tw': '家事與生活知識' },
    '整理・収納':           { en: 'Organization & Storage', 'zh-tw': '整理與收納' },
    '社会学':               { en: 'Sociology',          'zh-tw': '社會學' },
    '社会学概論':           { en: 'Intro to Sociology', 'zh-tw': '社會學概論' },
    '社会病理':             { en: 'Social Pathology',   'zh-tw': '社會病理' },
    '消費者問題':           { en: 'Consumer Issues',    'zh-tw': '消費者問題' },
    '文化人類学・民俗学':   { en: 'Cultural Anthropology & Folklore', 'zh-tw': '文化人類學與民俗學' },
    '人文・思想':           { en: 'Humanities & Thought','zh-tw': '人文與思想' },
    '倫理学・道徳':         { en: 'Ethics & Morality',  'zh-tw': '倫理學與道德' },
    '人生論・教訓':         { en: 'Life Lessons',       'zh-tw': '人生論與教訓' },
    '自己啓発':             { en: 'Self-help',          'zh-tw': '自我啟發' },
    '自己変革':             { en: 'Self-transformation', 'zh-tw': '自我蛻變' },
    '宗教':                 { en: 'Religion',           'zh-tw': '宗教' },
    '宗教入門':             { en: 'Religion (Intro)',   'zh-tw': '宗教入門' },
    '思想・社会':           { en: 'Thought & Society',  'zh-tw': '思想與社會' },
    '思想':                 { en: 'Thought',            'zh-tw': '思想' },
    '科学・テクノロジー':   { en: 'Science & Technology', 'zh-tw': '科學與科技' },
    '工学':                 { en: 'Engineering',        'zh-tw': '工程學' },
    'IT':                   { en: 'IT',                 'zh-tw': '資訊科技' },
    '情報社会':             { en: 'Information Society','zh-tw': '資訊社會' },
    'アプリケーション':       { en: 'Applications',         'zh-tw': '應用程式' },
    'コンピュータ・IT':     { en: 'Computer & IT',        'zh-tw': '電腦與 IT' },
    'ジェンダー':           { en: 'Gender Studies',       'zh-tw': '性別研究' },
    'ビジネススキル':       { en: 'Business Skills',      'zh-tw': '商業技能' },
    'マーケティング':       { en: 'Marketing',            'zh-tw': '行銷' },
    'マーケティング・セールス': { en: 'Marketing & Sales', 'zh-tw': '行銷與銷售' },
    '一般':                 { en: 'General',              'zh-tw': '一般' },
    '人生論':               { en: 'Philosophy of Life',   'zh-tw': '人生論' },
    '労働問題':             { en: 'Labor Issues',         'zh-tw': '勞動問題' },
    '哲学・思想':           { en: 'Philosophy & Thought', 'zh-tw': '哲學與思想' },
    '女性学':               { en: "Women's Studies",      'zh-tw': '女性學' },
    '実践経営・リーダーシップ': { en: 'Practical Management & Leadership', 'zh-tw': '實踐經營與領導力' },
    '家族問題':             { en: 'Family Issues',        'zh-tw': '家庭問題' },
    '心理学':               { en: 'Psychology',           'zh-tw': '心理學' },
    '心理学入門':           { en: 'Psychology (Intro)',   'zh-tw': '心理學入門' },
    '政治史・比較政治':     { en: 'Political History & Comparative Politics', 'zh-tw': '政治史與比較政治' },
    '教育学':               { en: 'Education',            'zh-tw': '教育學' },
    '日本史':               { en: 'Japanese History',     'zh-tw': '日本史' },
    '日本史一般':           { en: 'Japanese History (General)', 'zh-tw': '日本史概論' },
    '日本語・国語学':       { en: 'Japanese Language',    'zh-tw': '日語與國語學' },
    '祭り':                 { en: 'Festivals',            'zh-tw': '祭典' },
    '経済学':               { en: 'Economics',            'zh-tw': '經濟學' },
    '美容・ダイエット':     { en: 'Beauty & Diet',        'zh-tw': '美容與減肥' },
    '英米の小説・文芸':     { en: 'British & American Fiction', 'zh-tw': '英美小說與文藝' },
    '言語学':               { en: 'Linguistics',          'zh-tw': '語言學' },
    '論文作法・文章技術':   { en: 'Academic Writing',     'zh-tw': '論文寫作與文章技巧' },
    'その他':               { en: 'Others',             'zh-tw': '其他' },
    '未分類':               { en: 'Uncategorized',      'zh-tw': '未分類' }
  };

  /*
   * テーマ棚（shelves.html）の定義。
   * 細粒度の categories を読者向けテーマに束ねる。1冊が複数テーマに属してよい。
   * cats は reviews.json の categories 実値に合わせている。
   */
  var THEMES = [
    {
      id: 'money-life',
      labels: { ja: 'お金と人生', en: 'Money & Life', 'zh-tw': '金錢與人生' },
      cats: ['ビジネス・経済', '経営学・キャリア・MBA', '経済学', '人生論・教訓', '人生論', '消費者問題', 'マーケティング', 'マーケティング・セールス', '労働問題', 'ビジネス教育', 'ビジネススキル', '実践経営・リーダーシップ', '資格・就職・MBA', 'MBA(経営学修士)']
    },
    {
      id: 'literature',
      labels: { ja: '文学の名作', en: 'Great Literature', 'zh-tw': '文學名作' },
      cats: ['文学・評論', '小説・文芸', '日本の小説・文芸', '外国文学研究', '近現代の作品', '評論・文学研究', '英米文学', '英米の小説・文芸', 'その他の外国文学', '小説', 'イギリス・アメリカ']
    },
    {
      id: 'society',
      labels: { ja: '社会を読む', en: 'Reading Society', 'zh-tw': '解讀社會' },
      cats: ['社会・政治', '政治', '政治入門', '社会学', '社会学概論', '社会・思想', '社会病理', 'ジェンダー', '女性学', '家族問題', '情報社会', '政治史・比較政治', '文化人類学・民俗学', '祭り']
    },
    {
      id: 'thinking',
      labels: { ja: '考える力', en: 'Ways of Thinking', 'zh-tw': '思考的力量' },
      cats: ['人文・思想', '倫理学・道徳', '哲学・思想', '思想', '思想・社会', '宗教', '宗教入門', '心理学', '心理学入門', '教育学']
    },
    {
      id: 'essay',
      labels: { ja: 'エッセイで一息', en: 'A Breather: Essays', 'zh-tw': '隨筆小憩' },
      cats: ['エッセー・随筆', '日本のエッセー・随筆', '外国のエッセー・随筆', 'エッセイ・ノンフィクション', 'ノンフィクション']
    },
    {
      id: 'science-tech',
      labels: { ja: '科学と技術', en: 'Science & Tech', 'zh-tw': '科學與技術' },
      cats: ['科学・テクノロジー', '技術・サイエンス', '工学', 'IT', 'コンピュータ・IT', 'アプリケーション', '医学・薬学', '数学']
    },
    {
      id: 'history',
      labels: { ja: '歴史をたどる', en: 'Tracing History', 'zh-tw': '回溯歷史' },
      cats: ['歴史・地理', '世界史', 'ヨーロッパ史', 'ヨーロッパ史一般', '歴史学', '日本史', '日本史一般']
    },
    {
      id: 'life-skills',
      labels: { ja: '暮らしと学び', en: 'Life & Learning', 'zh-tw': '生活與學習' },
      cats: ['暮らし・健康・子育て', '趣味・実用', '自己啓発', '自己変革', '読書法', '本・図書館', '家事・生活の知識', '整理・収納', 'クッキング・レシピ', 'スポーツ', 'スポーツ・アウトドア', 'アート・建築・デザイン', '写真', '写真技術', '日本語・国語学', '言語学', '論文作法・文章技術', '美容・ダイエット', 'ダイエット', '食事療法', '家庭医学・健康', '健康法', '参考図書・白書']
    }
  ];

  function isLang(l) {
    return LANGS.indexOf(l) !== -1;
  }

  function getLang() {
    try {
      var params = new URLSearchParams(global.location.search);
      var l = params.get('lang');
      if (isLang(l)) return l;
    } catch (e) { /* noop */ }
    return 'ja';
  }

  /* 現在のクエリを保ちつつ lang を差し替えた href を返す（同一ページ用） */
  function langSwitchHref(lang) {
    var params;
    try {
      params = new URLSearchParams(global.location.search);
    } catch (e) {
      params = new URLSearchParams();
    }
    if (lang === 'ja') {
      params.delete('lang');
    } else {
      params.set('lang', lang);
    }
    var qs = params.toString();
    return qs ? '?' + qs : global.location.pathname;
  }

  function langLabel(lang) {
    return LANG_LABELS[lang] || lang;
  }

  /* カテゴリ名を指定言語に変換（ja はそのまま） */
  function catLabel(cat, lang) {
    if (!cat) return '';
    if (lang === 'ja' || !lang) return cat;
    var rec = CATEGORY_LABELS[cat];
    if (rec && rec[lang]) return rec[lang];
    return cat;
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(s == null ? '' : String(s)));
    return d.innerHTML;
  }

  function getCategories(review) {
    if (Array.isArray(review.categories) && review.categories.length) {
      return review.categories.filter(function (c) { return !!c && c !== 'Kindle本'; });
    }
    var c = (review.category || '').trim();
    return (c && c !== 'Kindle本') ? [c] : [];
  }

  function primaryCategory(review) {
    var cats = getCategories(review);
    return cats.length ? cats[0] : '未分類';
  }

  function htmlName(review) {
    return encodeURIComponent((review.filename || '').replace('.md', '.html'));
  }

  /* レビューURL。指定言語が無ければ ja にフォールバック */
  function reviewHref(review, lang) {
    var langs = review.languages || ['ja'];
    var useLang = (lang && langs.indexOf(lang) !== -1) ? lang : 'ja';
    return 'reviews/' + useLang + '/' + htmlName(review);
  }

  function webpSrc(image) {
    if (!image) return '';
    return image.replace(/\.png$/i, '.webp');
  }

  function reviewActivityAt(r) {
    return r.updated_at || r.created_at || r.date || '';
  }

  function fetchReviews() {
    return fetch('reviews.json', { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error('reviews.json fetch failed: ' + res.status);
      return res.json();
    });
  }

  /* ──────────────────────────────────────────────────────────
   * 著者集計（authors.html のロジックを移植）
   * AUTHOR_NORMALIZE は scripts/utils/author_names.py と、
   * 各辞書は authors.html と同期すること。
   * ────────────────────────────────────────────────────────── */

  var AUTHOR_LABELS = {
    '佐藤賢一':             { en: 'Kenichi Sato',           'zh-tw': '佐藤賢一' },
    '出口 治明':            { en: 'Haruaki Deguchi',        'zh-tw': '出口治明' },
    '相場英雄':             { en: 'Hideo Aiba',             'zh-tw': '相場英雄' },
    'アビジット・Ｖ・バナジー': { en: 'Abhijit V. Banerjee', 'zh-tw': '阿比吉特·班納吉' },
    'エスター・デュフロ':   { en: 'Esther Duflo',           'zh-tw': '艾絲特·杜芙洛' },
    'ジャレド・ダイアモンド': { en: 'Jared Diamond',         'zh-tw': '賈德·戴蒙' },
    'ダニエル・サスキンド': { en: 'Daniel Susskind',         'zh-tw': '丹尼爾·薩斯金德' },
    'トマ・ピケティ':       { en: 'Thomas Piketty',         'zh-tw': '托瑪·皮凱提' },
    'ニーアル・ファーガソン': { en: 'Niall Ferguson',        'zh-tw': '尼爾·弗格森' },
    'マイケル・サンデル':   { en: 'Michael Sandel',          'zh-tw': '邁可·桑德爾' },
    '山口 周':              { en: 'Shu Yamaguchi',           'zh-tw': '山口周' },
    '斎藤幸平':             { en: 'Kohei Saito',             'zh-tw': '齋藤幸平' },
    '早見和真':             { en: 'Kazuma Hayami',           'zh-tw': '早見和真' },
    '村上春樹':             { en: 'Haruki Murakami',         'zh-tw': '村上春樹' },
    '田内 学':              { en: 'Manabu Tauchi',           'zh-tw': '田內學' },
    '近内悠太':             { en: 'Yuta Chikauchi',          'zh-tw': '近內悠太' },
    '野口悠紀雄':           { en: 'Yukio Noguchi',           'zh-tw': '野口悠紀雄' }
  };

  var AUTHOR_NORMALIZE = {
    'トマ ピケティ': 'トマ・ピケティ',
    'エステル・デュフロ': 'エスター・デュフロ',
    'マイケル サンデル': 'マイケル・サンデル',
    'ニーアル ファーガソン': 'ニーアル・ファーガソン',
    'ジョセフ Ｅ スティグリッツ': 'ジョセフ・Ｅ・スティグリッツ',
    'カビール セガール': 'カビール・セガール',
    'エイモア トールズ': 'エイモア・トールズ',
    'ルーシー クレハン': 'ルーシー・クレハン',
    '井上 章一': '井上章一',
    '佐藤 賢一': '佐藤賢一',
    '柴田 裕之': '柴田裕之',
    '出口治明': '出口 治明',
    '相場 英雄': '相場英雄',
    '斎藤 幸平': '斎藤幸平',
    '橘 玲': '橘玲',
    '大野和基': '大野 和基',
    '小田嶋 隆': '小田嶋隆',
    '新庄 耕': '新庄耕',
    '村井 章子': '村井章子',
    '山本 幸久': '山本幸久',
    '山田 美明': '山田美明',
    '濱野大道': '濱野 大道',
    '藤田 美菜子': '藤田美菜子',
    '近藤 康太郎': '近藤康太郎',
    '鈴木 大介': '鈴木大介',
    '高須 正和': '高須正和',
    '山形 浩生': '山形浩生',
    '村上 春樹': '村上春樹',
    '伊藤 羊一': '伊藤羊一',
    'ブレイディみかこ': 'ブレイディ みかこ'
  };

  var NON_AUTHORS = {
    '広野和美': true, '山形浩生': true, '村井章子': true,
    '岡本 麻左子': true, '柴田元幸': true, '柴田裕之': true,
    '上原裕美子': true, '鬼澤 忍': true, '会田弘継': true,
    '山岡由美': true, '関美和': true, '秋山 勝': true,
    '橋川 史': true, '飯嶋 貴子': true, '立木勝': true,
    '屋代通子': true, '小坂 恵理': true, '桐谷知未': true,
    '長尾 高弘': true, '榊原 彰': true, '小野木明恵': true,
    '濱野 大道': true, '依田光江': true, '千葉 敏生': true,
    '松丸 さとみ': true, '雨宮 寛': true, '今井 章子': true,
    '山田美明': true, '山田文': true, '三宅康雄': true,
    '長尾莉紗': true, '高取芳彦': true, '藤田美菜子': true,
    '柴田さとみ': true, '関根光宏': true, '芝瑞紀': true,
    '島崎由里子': true, '倉嶋雅人': true, '鈴木力衛': true,
    '宇佐川 晶子': true, '山田陽子': true, '高里ひろ': true,
    '大野 和基': true, '大野 一': true, '福井憲彦': true,
    '文豪e叢書編集部': true, '栗原聡': true
  };

  var PER_BOOK_EXCLUDE = {
    'テクノ封建制': { '斎藤幸平': true },
    '日本経済AI成長戦略': { '松尾 豊': true, '松尾\u3000豊': true },
    'ハードウェアハッカー': { '高須正和': true },
    '欲望の資本主義': { 'ＮＨＫ「欲望の資本主義」制作班': true }
  };

  var TRANSLATOR_ONLY_FOR = {
    '村上春樹': { 'ティム・オブライエン': true }
  };

  var PRIMARY_ROLES = { '著': true, '原著': true, '原作': true, '原案': true };

  function normalizeName(name) {
    var n = name.trim().replace(/\u3000/g, ' ');
    return AUTHOR_NORMALIZE[n] || n;
  }

  function splitAuthors(raw) {
    return raw.split(/,\s+and\s+|\s+and\s+|,\s+|、/);
  }

  function isNonAuthorByRoles(rawName, authorRoles) {
    if (!authorRoles) return null;
    var role = authorRoles[rawName];
    if (!role) return null;
    return !PRIMARY_ROLES[role];
  }

  function isNonAuthor(normName, rawName, title, allNormNames, authorRoles) {
    var roleResult = isNonAuthorByRoles(rawName, authorRoles);
    if (roleResult !== null) return roleResult;
    if (NON_AUTHORS[normName]) return true;
    for (var keyword in PER_BOOK_EXCLUDE) {
      if (title.indexOf(keyword) !== -1 && PER_BOOK_EXCLUDE[keyword][normName]) {
        return true;
      }
    }
    if (TRANSLATOR_ONLY_FOR[normName]) {
      var checkSet = TRANSLATOR_ONLY_FOR[normName];
      for (var i = 0; i < allNormNames.length; i++) {
        if (checkSet[allNormNames[i]]) return true;
      }
    }
    return false;
  }

  /* 著者ごとの集計（冊数降順・同数同順位）。authors.html と同じ結果。 */
  function buildAuthorData(reviews) {
    var counts = {};
    var books = {};
    var genreSets = {};

    reviews.forEach(function (r) {
      var raw = (r.author || '').trim();
      var title = (r.title || '').trim();
      if (!raw) return;
      var parts = splitAuthors(raw);
      var normNames = parts.map(normalizeName);
      var seen = {};
      var cats = getCategories(r);
      var authorRoles = r.author_roles || null;

      normNames.forEach(function (norm, idx) {
        var rawName = parts[idx] ? parts[idx].trim().replace(/\u3000/g, ' ') : norm;
        if (seen[norm] || isNonAuthor(norm, rawName, title, normNames, authorRoles)) return;
        seen[norm] = true;
        counts[norm] = (counts[norm] || 0) + 1;
        if (!books[norm]) books[norm] = [];
        books[norm].push({ title: title, filename: r.filename || '', languages: r.languages || ['ja'] });
        if (!genreSets[norm]) genreSets[norm] = {};
        cats.forEach(function (c) { genreSets[norm][c] = true; });
      });
    });

    var entries = [];
    for (var name in counts) {
      entries.push({ name: name, count: counts[name], books: books[name], genres: Object.keys(genreSets[name]) });
    }
    entries.sort(function (a, b) {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name, 'ja');
    });
    var rank = 1;
    for (var i = 0; i < entries.length; i++) {
      if (i > 0 && entries[i].count < entries[i - 1].count) rank = i + 1;
      entries[i].rank = rank;
    }
    return entries;
  }

  /** 指定順位までの著者を返す（同順位はすべて含む）。dashboard Top10 用。 */
  function topAuthorEntries(entries, maxRank) {
    var limit = maxRank == null ? 10 : maxRank;
    return entries.filter(function (e) { return e.rank <= limit; });
  }

  function authorLabel(name) {
    return AUTHOR_LABELS[name] || null;
  }

  global.BooksCommon = {
    LANGS: LANGS,
    LANG_LABELS: LANG_LABELS,
    CATEGORY_LABELS: CATEGORY_LABELS,
    THEMES: THEMES,
    isLang: isLang,
    getLang: getLang,
    langSwitchHref: langSwitchHref,
    langLabel: langLabel,
    catLabel: catLabel,
    escapeHtml: escapeHtml,
    getCategories: getCategories,
    primaryCategory: primaryCategory,
    reviewHref: reviewHref,
    htmlName: htmlName,
    webpSrc: webpSrc,
    reviewActivityAt: reviewActivityAt,
    fetchReviews: fetchReviews,
    AUTHOR_LABELS: AUTHOR_LABELS,
    buildAuthorData: buildAuthorData,
    topAuthorEntries: topAuthorEntries,
    authorLabel: authorLabel
  };
})(window);
