# recent-tab-switcher

現在のタブから、直前に開いていたタブへショートカットキーで移動するChrome拡張機能

このリポジトリはCodexを使用して作成

## インストール

1. Chromeで `chrome://extensions` を開く
2. 右上の「デベロッパーモード」を有効にする
3. 「パッケージ化されていない拡張機能を読み込む」を押す
4. このリポジトリのフォルダーを選ぶ
5. 拡張機能が追加され、タブの移動履歴の記録が始まる

## 使い方

- Windows / Linuxでは `Ctrl+Shift+K` を押す
- macOSでは `Command+Shift+K` を押す
- 直前に開いていたタブへ移動する
- 続けて同じキーを押すと、移動前のタブへ戻る

## ショートカットキーの変更

1. Chromeで `chrome://extensions/shortcuts` を開く
2. `recent-tab-switcher` の「直前に開いていたタブへ移動」を選ぶ
3. 任意のキーを入力する
4. 次回から入力したキーでタブが切り替わる
