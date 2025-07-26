# MCP Server TypeScript Sample

Express.js + MCPサーバーのサンプルプロジェクトです。

## ディレクトリ構成

```
project-root/
├── .env                       # 環境変数
├── .env.example               # 環境変数のテンプレート
└── src/
    ├── index.ts               # エントリーポイント（サーバ起動）
    ├── server.ts              # サーバ起動スクリプト
    ├── config/                # 設定関連
    ├── mcp/
    │   ├── tools/             # Toolの定義
    │   ├── resources/         # Resourceの定義
    │   └── prompts/           # Promptの定義
    ├── middleware/            # Expressのミドルウェア
    └── routes/                # ルーティング
```

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 環境変数の設定:
```bash
cp .env.example .env
# .envファイルを編集して適切な値を設定してください
```

3. ビルド:
```bash
npm run build
```

4. サーバー起動:
```bash
npm start
```

開発モード:
```bash
npm run dev
```

## エンドポイント

- `http://localhost:3000/mcp`(デフォルト設定の場合)

## ツールの追加方法
1. `src/mcp/tools/` ディレクトリに新しいツールファイルを作成
2. `src/mcp/index.ts` でツールを登録
