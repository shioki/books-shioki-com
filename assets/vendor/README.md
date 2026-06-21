# site/assets/vendor

サードパーティ JavaScript ライブラリをローカルに同梱（vendoring）しています。
CDN 依存を避け、オフラインや CDN 障害時でもページが動作するようにするためです。

| ファイル | ライブラリ | バージョン | 取得元 | ライセンス |
|----------|-----------|-----------|--------|-----------|
| `chart.umd.min.js` | Chart.js | 4.4.1 | https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js | MIT |
| `cytoscape.min.js` | Cytoscape.js | 3.30.2 | https://cdn.jsdelivr.net/npm/cytoscape@3.30.2/dist/cytoscape.min.js | MIT |

## 利用ページ

- `chart.umd.min.js` … `dashboard.html`（読書データの各チャート）
- `cytoscape.min.js` … `graph.html`（書評の関係グラフ）

## 更新方法

バージョンを上げる場合は同じ URL のバージョン部分を差し替えて再ダウンロードし、
本 README の表と各 HTML の参照を更新してください。
