/**
 * 書評個別ページ用: reviews.json の related を表示する。
 * 対象レイアウトに以下を追加すること（data-reviews-manifest は index / authors と同値に揃え、一括公開後にバンプすると CDN キャッシュを切れる）:
 *   <div id="review-related-root"></div>
 *   <link rel="stylesheet" href="/review-related.css">
 *   <script src="/review-related.js" defer></script>
 */
(function () {
    'use strict';

    var root = document.getElementById('review-related-root');
    if (!root) {
        return;
    }

    var path = window.location.pathname;
    var m = path.match(/\/reviews\/(ja|en|zh-tw)\/([^/]+)$/);
    if (!m) {
        return;
    }

    var lang = m[1];
    var htmlName = decodeURIComponent(m[2]);
    if (!/\.html$/i.test(htmlName)) {
        return;
    }
    var filenameMd = htmlName.replace(/\.html$/i, '.md');

    var headingLabel = {
        ja: '関連する書評',
        en: 'Related reviews',
        'zh-tw': '相關書評'
    };

    var reviewsManifestVer = document.documentElement.getAttribute('data-reviews-manifest') || '1';
    fetch('/reviews.json?v=' + encodeURIComponent(reviewsManifestVer), { cache: 'no-cache' })
        .then(function (res) {
            if (!res.ok) {
                throw new Error('reviews.json fetch failed');
            }
            return res.json();
        })
        .then(function (reviews) {
            if (!reviews || !reviews.length) {
                return;
            }
            var current = reviews.find(function (r) {
                return r.filename === filenameMd;
            });
            var related = (current && current.related) ? current.related : [];
            if (!related.length) {
                root.setAttribute('hidden', '');
                return;
            }

            var byFilename = {};
            reviews.forEach(function (r) {
                if (r.filename) {
                    byFilename[r.filename] = r;
                }
            });

            var section = document.createElement('section');
            section.className = 'review-related';
            section.setAttribute('aria-labelledby', 'review-related-heading');

            var h2 = document.createElement('h2');
            h2.id = 'review-related-heading';
            h2.textContent = headingLabel[lang] || headingLabel.ja;
            section.appendChild(h2);

            var ul = document.createElement('ul');
            ul.className = 'review-related-list';

            related.forEach(function (relItem) {
                var fn = relItem.filename;
                if (!fn) {
                    return;
                }
                var r = byFilename[fn];
                if (!r) {
                    return;
                }
                var langs = r.languages || ['ja'];
                var targetLang = langs.indexOf(lang) !== -1 ? lang : langs[0];
                var href = '/reviews/' + targetLang + '/' + encodeURIComponent(
                    r.filename.replace('.md', '.html')
                );

                var li = document.createElement('li');
                var a = document.createElement('a');
                a.className = 'review-related-item';
                a.href = href;

                var row = document.createElement('div');
                row.className = 'review-related-row';

                if (r.image) {
                    var pic = document.createElement('picture');
                    var tw = document.createElement('div');
                    tw.className = 'review-related-thumb-wrap';
                    var srcWebp = '/' + String(r.image).replace(/\.png$/i, '.webp');
                    var srcPng = '/' + r.image;
                    var source = document.createElement('source');
                    source.type = 'image/webp';
                    source.srcset = srcWebp;
                    var img = document.createElement('img');
                    img.src = srcPng;
                    img.alt = '';
                    img.loading = 'lazy';
                    img.decoding = 'async';
                    pic.appendChild(source);
                    pic.appendChild(img);
                    tw.appendChild(pic);
                    row.appendChild(tw);
                }

                var textWrap = document.createElement('div');
                textWrap.className = 'review-related-text';

                var title = document.createElement('div');
                title.className = 'review-related-item-title';
                title.textContent = r.title || fn;

                var author = document.createElement('div');
                author.className = 'review-related-item-author';
                author.textContent = r.author || '';

                textWrap.appendChild(title);
                textWrap.appendChild(author);
                row.appendChild(textWrap);
                a.appendChild(row);
                li.appendChild(a);
                ul.appendChild(li);
            });

            section.appendChild(ul);
            root.innerHTML = '';
            root.removeAttribute('hidden');
            root.appendChild(section);
        })
        .catch(function () {
            root.setAttribute('hidden', '');
        });
}());
