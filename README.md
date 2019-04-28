# 餐廳清單 2.0

此專案提供使用者新增、刪除及修改餐廳的資訊，例如:餐廳類別、地址、評分、描述等

## 功能列表

- 依照餐廳名稱及餐廳類別搜尋
- 依照餐廳名稱、類別及地區排序
- 檢視餐廳詳細資訊包含類別、地址、電話、評分、圖片及 Google Map
  - 點選`Back`返回首頁瀏覽全部餐廳資料
  - 點選`Edit`編輯此筆餐廳資料
  - 點選`Delete`刪除此筆餐廳資料
  - 點選 Google Map`顯示詳細地圖`可查看位置詳細資料
- 點選`Create`新增餐廳包含上傳圖片、評分、類別、地址等資訊，Google Map 位置會依照輸入之地址產生
- 點選 :pencil2: 可編輯此餐廳資料
- 點選 :wastebasket: 可刪除此餐廳資料

### 安裝

1.開啟終端機(Terminal)cd 到存放專案本機位置並執行:

```
git clone https://github.com/Eason0in/Restaurant-CRUD.git
```

2.初始

```
cd Restaurant-CRUD  //切至專案資料夾
```

```
npm install  //安裝套件
```

3.產生預設使用者及餐廳資料至 MongoDB

```
npm run insertSeeds  //執行增加資料至 MongoDB
```

終端顯示 `users insert done! 及 restaurants insert done!` 即完成新增資料

```
Ctrl+C *2  //連按兩下Ctrl+C結束批次工作
```

4.開啟程式

```
npm run start  //執行程式
```

終端顯示 `db is connected!` 即啟動完成，請至[http://localhost:3000](http://localhost:3000)開始使用程式

## Test Data

- Account
  - email_1：asd@asd
  - email_2：asd2@asd
  - password：asd
- Facebook
  - email：restaurant_eppxhys_test@tfbnw.net
  - password：asD333

## Screen Photo

![登入](https://github.com/Eason0in/Restaurant-CRUD/blob/master/public/img/login.JPG)
![首頁](https://github.com/Eason0in/Restaurant-CRUD/blob/master/public/img/index.JPG)
![修改](https://github.com/Eason0in/Restaurant-CRUD/blob/master/public/img/edit.JPG)
![搜尋](https://github.com/Eason0in/Restaurant-CRUD/blob/master/public/img/search.JPG)

## 使用工具

- [Visual Studio Code](https://visualstudio.microsoft.com/zh-hant/) - 開發環境
- [Express](https://www.npmjs.com/package/express) - 應用程式架構
- [Express-Fileupload](https://www.npmjs.com/package/express-fileupload) - 上傳圖片並放置指定目錄
- [Express-Handlebars](https://www.npmjs.com/package/express-handlebars) - 模板引擎
- [MongoDB](https://www.mongodb.com/) - 資料庫
- [Mongoose](https://www.npmjs.com/package/mongoose) - MongoDB 的 ODM 可以在程式中與資料庫溝通

## 致謝

- [星星依評分填色 CodePen](https://codepen.io/mjweaver01/pen/rGaBaz) - Mike Weaver
- [版面設計參考貓途鷹](https://www.tripadvisor.com.tw/)- TripAdvisor LLC
- [開發者](https://github.com/Eason0in)- Eason
