# 公開手順

スマホから確認するには、ローカルURLではなく公開URLが必要です。
このプロジェクトはGitHub Pagesで公開する前提にしています。

## 1. GitHubリポジトリを作る

GitHub上で新しいリポジトリを作ります。

例:

```bash
prompt-parts
```

## 2. ローカルからpushする

```bash
git init
git add .
git commit -m "Create prompt parts PWA"
git branch -M main
git remote add origin https://github.com/<your-name>/prompt-parts.git
git push -u origin main
```

## 3. Pages設定

GitHubのリポジトリで以下を設定します。

```text
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

## 4. 公開URLを見る

`Actions` タブで `Deploy to GitHub Pages` が成功すると、公開URLが表示されます。
そのURLをスマホで開けば確認できます。

## この設計にした理由

- 無料で公開できる
- SNSでURLをそのまま共有できる
- スマホから遠隔確認できる
- ビルドやサーバー運用が不要
- PWAとしてホーム画面に追加できる
