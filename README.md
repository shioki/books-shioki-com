# 公開サイト（books.shioki.com）のソース

このフォルダは **公開用リポジトリ books-shioki-com にデプロイするコンテンツの正本**です。

- **編集**: ここ（Private リポジトリ内）のファイルだけを編集する
- **公開**: `scripts/deploy_books_site.py` を実行すると、内容が Public の books-shioki-com にコピーされ、git push まで実行される

含めるファイルの目安:
- `index.html` … トップページ（DADS デザイン適用済み）
- 必要に応じて `CNAME` や `README.md` などもここに置き、デプロイ対象にできる
