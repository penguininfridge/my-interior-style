# 見つけよう！あなたのヨーロッパインテリアスタイル診断

セラトレーディングの取扱ブランド・納品事例をもとにした、12問のスタイル診断サイト（Next.js App Router）。

## ローカルで動かす
```bash
npm install
npm run dev        # http://localhost:3000
```

## Vercel へのデプロイ
1. このフォルダを GitHub にリポジトリとして push
2. Vercel で「Add New → Project」からリポジトリを選ぶ（Framework は Next.js が自動選択される）
3. Environment Variables に `NEXT_PUBLIC_SITE_URL` = 本番URL（例 `https://xxxx.vercel.app`）を追加
4. Deploy

## ファイル構成
| ファイル | 役割 |
|---|---|
| `data/diagnosis.ts` | ブランド・納品事例・6タイプ・12問・デザイナー理由。文言や写真の差し替えはここだけ |
| `lib/engine.ts` | 入場演出・質問・集計・結果表示の動き |
| `components/Diagnosis.tsx` | 画面の骨組み（HTML） |
| `app/globals.css` | デザイン（色・フォント・字の大きさ） |
| `app/page.tsx` | 結果URL `?r=minimal` などをシェアした時のタイトル・画像（OGP） |

## 公開前の確認事項
- 写真は cera.co.jp の納品事例から直接読み込んでいます。公開前にセラトレーディングの使用許諾を確認してください。
