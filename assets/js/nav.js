/*
 * nav.js
 * 全ページ共通のグローバルナビを生成する。
 * #site-nav 要素があればそこへ、無ければ body 先頭へ自己挿入する。
 * 現在ページのハイライト（aria-current）と、言語クエリ(?lang=)の引き継ぎを行う。
 */
(function (global) {
  'use strict';

  var NAV_ITEMS = [
    { href: '/',                  ja: 'トップ',           en: 'Home',       'zh-tw': '首頁' },
    { href: '/milestone.html',    ja: '300記念',          en: '300 Books',  'zh-tw': '300 紀念' },
    { href: '/authors.html',      ja: 'よく読む著者',     en: 'Authors',    'zh-tw': '常讀作者' },
    { href: '/shelves.html',      ja: 'テーマ棚',         en: 'Shelves',    'zh-tw': '主題書架' },
    { href: '/dashboard.html',    ja: 'データ',           en: 'Dashboard',  'zh-tw': '數據' },
    { href: '/graph.html',        ja: '関係図',           en: 'Graph',      'zh-tw': '關係圖' },
    { href: '/okiwa-profile.html', ja: 'キャラ紹介',      en: 'Character',  'zh-tw': '角色介紹' }
  ];

  function getLang() {
    if (global.BooksCommon && typeof global.BooksCommon.getLang === 'function') {
      return global.BooksCommon.getLang();
    }
    try {
      var l = new URLSearchParams(global.location.search).get('lang');
      if (l === 'en' || l === 'zh-tw') return l;
    } catch (e) { /* noop */ }
    return 'ja';
  }

  function normalizePath(p) {
    if (!p) return '/';
    // index は "/" と "/index.html" を同一視
    if (p === '/index.html') return '/';
    return p;
  }

  function withLang(href, lang) {
    if (lang === 'ja') return href;
    return href + (href.indexOf('?') === -1 ? '?' : '&') + 'lang=' + encodeURIComponent(lang);
  }

  function injectStyle() {
    if (document.getElementById('bnav-style')) return;
    var css =
      '#site-nav{width:100%;min-width:0;}' +
      '.bnav{display:flex;flex-wrap:wrap;justify-content:center;gap:.1rem;width:100%;max-width:100%;' +
      'box-sizing:border-box;padding:.5rem 1rem;border-bottom:1px solid #e6e6e6;background:#fff;}' +
      '.bnav a{color:#0031d8;text-decoration:none;font-size:.875rem;' +
      'padding:.5rem .9rem;border-radius:624px;white-space:nowrap;}' +
      '.bnav a:hover{text-decoration:underline;}' +
      '.bnav a[aria-current="page"]{background:#f0f9ff;border:1px solid #c0e4ff;font-weight:700;}' +
      '@media(max-width:600px){.bnav{flex-wrap:nowrap;overflow-x:auto;justify-content:flex-start;' +
      'padding:.4rem .5rem;gap:.05rem;-webkit-overflow-scrolling:touch;}' +
      '.bnav a{padding:.5rem .6rem;}}';
    var style = document.createElement('style');
    style.id = 'bnav-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function build() {
    injectStyle();
    var lang = getLang();
    var current = normalizePath(global.location.pathname);

    var nav = document.createElement('nav');
    nav.className = 'bnav';
    nav.setAttribute('aria-label', 'サイトナビゲーション');

    NAV_ITEMS.forEach(function (item) {
      var a = document.createElement('a');
      a.href = withLang(item.href, lang);
      a.textContent = item[lang] || item.ja;
      if (normalizePath(item.href) === current) {
        a.setAttribute('aria-current', 'page');
      }
      nav.appendChild(a);
    });

    var mount = document.getElementById('site-nav');
    if (mount) {
      mount.innerHTML = '';
      mount.appendChild(nav);
    } else {
      document.body.insertBefore(nav, document.body.firstChild);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})(window);
