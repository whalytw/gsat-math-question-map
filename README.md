# 學測數學試題單元地圖

Repository 建議名稱：**gsat-math-question-map**

將 110 至 115 年共 11 份學測數學考卷，依六冊龍騰課本及單元分類。網站內容移植自本專案最後完成的 Word 文件。

## 使用方式

- 開啟網頁時，110～115 年預設全部勾選。
- 可同時勾選任意多個年度；未勾選的年度題目與年度索引會隱藏。
- 某單元或冊別沒有符合年度的題目時，該節也會隱藏。
- 冊別、單元、每個題目前方均有方框「−／＋」，可各自收摺或展開。
- 預設各層全部展開；也有「全部展開」「全部收摺」按鈕。
- 「全選年度」「取消全選」方便重設；若全部取消，會顯示提示。
- 冊別使用不同粉彩底色，單元使用淺灰底色。
- 同一題可以出現在不同單元，所以「原題題數」與「單元認列筆數」不同。
- 內容共 220 道原題、468 筆單元認列、58 個單元；保留題組共用題幹、原題圖片、認列依據及逐題索引。

## 本機查看

先完整解壓縮，直接用 Chrome／Edge 開啟 **index.html** 即可使用；無須安裝套件或執行建置。

請保留 index.html、style.css、app.js、data.js 與 assets 資料夾的相對位置。不要只複製 index.html，也不要直接在壓縮檔內開啟。

## 發布到 GitHub Pages

1. 在 GitHub 建立 repository，名稱建議填 **gsat-math-question-map**。
2. 把本資料夾內的全部檔案與 assets 資料夾加入 repository 根目錄。根目錄應直接看到 index.html，而不是再包一層同名資料夾。
3. Commit 並 push 到 main。
4. 在該 repository 的 **Settings → Pages**，把 Source 設為 **Deploy from a branch**。
5. Branch 選 **main**，資料夾選 **/(root)**，然後 Save。
6. 等待 GitHub Pages 顯示網站網址，使用該網址分享。

通常網址格式為：https://你的帳號.github.io/gsat-math-question-map/

圖片較多，建議使用 GitHub Desktop 一次提交整個資料夾；如用 GitHub 網頁上傳，請分批加入圖片，並保留 assets 路徑。不要將 ZIP 本身當成網站內容上傳。

GitHub 官方說明：
- [設定 GitHub Pages 發布來源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [透過 GitHub Desktop 加入既有專案](https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-a-repository-from-your-local-computer-to-github-desktop)

## 檔案

| 檔案 | 用途 |
| --- | --- |
| index.html | 網頁入口與年度篩選控制 |
| style.css | 排版、六冊配色與行動裝置樣式 |
| app.js | 建立樹狀內容、年度篩選、展開收摺 |
| data.js | 從 Word 移植的題目與單元分類內容 |
| assets/ | 230 張去除重複儲存的原題與題組圖片 |
| .nojekyll | 讓 GitHub Pages 直接提供靜態檔案 |

網站不使用外部字型、CDN 或資料庫。頁面重新開啟後會回到全年度勾選、全部展開的預設狀態。

## 來源及權利

考題影像取自專案提供的 110～115 年學測數學原卷；冊別與單元依專案提供的龍騰課本及已完成的 Word 分類結果整理。原題及教材之權利屬各原權利人。本專案未將整冊課本 PDF 放入網站，也未將第三方題目影像授權為開源素材。

