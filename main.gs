// google drive
let saveImageFolderID = PropertiesService.getScriptProperties().getProperty("SAVE_IMAGE_FOLDER_ID");

// kintone
let kintoneAccessToken = PropertiesService.getScriptProperties().getProperty("KINTONE_ACCESS_TOKEN");
let kintoneAppID = PropertiesService.getScriptProperties().getProperty("KINTONE_APP_ID");
let kintoneSubDomain = PropertiesService.getScriptProperties().getProperty("KINTONE_SUB_DOMAIN");
let kintoneUserName = PropertiesService.getScriptProperties().getProperty("KINTONE_USER_NAME");
let kintoneUserPass = PropertiesService.getScriptProperties().getProperty("KINTONE_USER_PASS");


function doGet(e) {
  var streatName = e.parameter.streatName;
  var weaponName = e.parameter.weaponName;
  var latitude = e.parameter.latitude;
  var longitude = e.parameter.longitude;

  //MapのBlob(Binary Large Object)を作る。
  var map = Maps.newStaticMap()
  .setLanguage("ja")
  .setSize(512, 512)
  .setZoom(15)
  .setCenter(latitude,longitude)
  .addMarker(latitude,longitude)
  .getBlob();

  // /getSavedImageID()メソッドでURLを作成
  var savedImageID = getSavedImageID(map);

  response = {
    weaponName:weaponName,
    streatName:streatName,
    latitude:latitude,
    longitude:longitude,
    savedImageID:savedImageID
  };

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}

function sendWeaponToObniz(weaponName) {
  var obnizID = PropertiesService.getScriptProperties().getProperty("OBNIZ_ID");
  var urlObniz = "https://obniz.com/obniz/" + obnizID + "/message?data=spetialGun";
  let responseDataGET2 = UrlFetchApp.fetch(urlObniz).getContentText();
}

function testSendWeaponToObniz() {
  sendWeaponToObniz("spetialGun");
}

function init_polygon(streatName){
  var _polygon = function(){
    this.v = new Array();
  };
  var polygon = new _polygon();
  var v = function(x, y){
    this.x = x;
    this.y = y;
  };
  
  if (streatName === "Yaegaki") {
    polygon.v.push(new v(721263739303794,76227395740790));
    polygon.v.push(new v(717969662108274,76527800555564));
    polygon.v.push(new v(717846294233290,76507048401870));
    polygon.v.push(new v(721223862553494,76203000963880));
  } else if (streatName === "NezuGinza") {
    polygon.v.push(new v(718881723570334,76673493994193));
    polygon.v.push(new v(717908398122226,76532943901790));
    polygon.v.push(new v(718044629367940,76521482037953));
    polygon.v.push(new v(718979988035010,76664560787887));
  } else if (streatName === "NezuMiyanaga") {
    polygon.v.push(new v(717949591579160,76529100572992));
    polygon.v.push(new v(716688359648180,76655379470730));
    polygon.v.push(new v(716617578374820,76632565994550));
    polygon.v.push(new v(717796068074655,76508576507416));
  }
  return polygon;
}

function convertLatitudeAndLongitude(latitudeAndLongitudeList) {
  var convertedLatitude = parseFloat("0."+(String(latitudeAndLongitudeList[0])).split(".")[1]) * 1000000000000000;
  var convertedLongitude = parseFloat("0."+(String(latitudeAndLongitudeList[1])).split(".")[1]) * 100000000000000;
  var convertedLatitudeAndLongitudeList = [convertedLatitude, convertedLongitude];
  return convertedLatitudeAndLongitudeList;
}

// 緯度と経度の値からプレイエリアを断定
function detectUserLocation(latitudeAndLongitudeList) {
  var convertedLatitudeAndLongitudeList = convertLatitudeAndLongitude(latitudeAndLongitudeList);
  var _point = function(x, y){
    this.x = x;
    this.y = y;
  };
  var point = new _point(convertedLatitudeAndLongitudeList[0],convertedLatitudeAndLongitudeList[1]);

  var polygonYaegaki = init_polygon("Yaegaki");
  var countCrossingEdgeYaegaki = countEdge(polygonYaegaki, point);
  if (countCrossingEdgeYaegaki%2 == 1) {
    return "Yaegaki";
  }

  var polygonNezuGinza = init_polygon("NezuGinza");
  var countCrossingEdgeNezuGinza = countEdge(polygonNezuGinza, point);
  if (countCrossingEdgeNezuGinza%2 == 1) {
    return "NezuGinza";
  }

  var polygonNezuMiyanaga = init_polygon("NezuMiyanaga");
  var countCrossingEdgeNezuMiyanaga = countEdge(polygonNezuMiyanaga, point);
  if (countCrossingEdgeNezuMiyanaga%2 == 1) {
    return "NezuMiyanaga";
  }
  return null;
}

// Crossing Number Algorithmを用いて指定された地点から一意の方向を見た時にいくつ辺を跨ぐかを計算
function countEdge(polygon, point){
  numEdge = 0;
  for(i = 0; i < polygon.v.length - 1; i++){
    // 上向きの辺。点Pがy軸方向について、始点と終点の間にある。ただし、終点は含まない。(ルール1)
    if( ((polygon.v[i].y <= point.y) && (polygon.v[i+1].y > point.y))
    // 下向きの辺。点Pがy軸方向について、始点と終点の間にある。ただし、始点は含まない。(ルール2)
      || ((polygon.v[i].y > point.y) && (polygon.v[i+1].y <= point.y)) ){
    // ルール1,ルール2を確認することで、ルール3も確認できている。
      // 辺は点pよりも右側にある。ただし、重ならない。(ルール4)
      // 辺が点pと同じ高さになる位置を特定し、その時のxの値と点pのxの値を比較する。
      vt = (point.y - polygon.v[i].y) / (polygon.v[i+1].y - polygon.v[i].y);
      if(point.x < (polygon.v[i].x + (vt * (polygon.v[i+1].x - polygon.v[i].x)))){
        ++numEdge;
      }
    }
  }
  return numEdge;
}

function testDetectUserLocation() {
  var location = detectUserLocation([35.71887591777907, 139.76420657026688]);
  console.log(location);
}

//Blob情報から画像を特定のフォルダに公開権限をつけてアップロード
function getSavedImageID(blob){
//フォルダのインスタンス取得
  var folder = DriveApp.getFolderById(saveImageFolderID);
//blobから画像を作成
  var file = folder.createFile(blob);
//権限付与
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
//アップロードが終わったらIDを取得してアクセス可能なURL化して返す。
  return "http://drive.google.com/uc?export=view&id=" + file.getId();
}

function testGetSavedImageID() {
  var latitude = 35.718080079531816;
  var longitude = 139.76547040461537;

  //MapのBlob(Binary Large Object)を作る。
  var map = Maps.newStaticMap()
  .setLanguage("ja")
  .setSize(512, 512)
  .setZoom(15)
  .setCenter(latitude,longitude)
  .addMarker(latitude,longitude)
  .getBlob();

  // /getSavedImageID()メソッドでURLを作成
  console.log(saveImageFolderID);
  var savedImageID = getSavedImageID(map);
  console.log(savedImageID);
}

// 塗られるエリアをランダムで生成
function generatePaintedArea(streatName, numPaint) {
  var paintedCoordinateList = [];
  for (let i=0; i<numPaint; i++) {
    //0以上1未満の乱数を生成
    let rand = Math.random();
    //1~100の整数になるように数値計算
    rand = Math.floor(rand*20)+1;
    console.log(rand);
    var paintedCoordinate = streatName + String(rand);
    var indexOfRand = paintedCoordinateList.indexOf(paintedCoordinate);
    console.log(indexOfRand);
    if (indexOfRand = -1) {
      paintedCoordinateList.push(paintedCoordinate);
    } else {
      i = i - 1;
    }
    console.log(paintedCoordinateList);
  }
  return (paintedCoordinateList)
}

function testGeneratePaintedArea() {
  var paintedCoordinateList = generatePaintedArea("a", 3);
  console.log(paintedCoordinateList);
}



var KintoneManager = (function() {
  "use strict";
  function KintoneManager(subdomain, apps, user, pass){
      this.subdomain = subdomain;
      this.authorization = null;
      this.apps = apps;

      if (arguments.length > 3) {
          this.authorization = Utilities.base64Encode(user + ":" + pass);
      } else if (arguments.length > 2) {
          // 引数が3つの場合はエンコード済みの認証情報として処理
          this.authorization = user;
      }
  }
  // レコードの作成
  KintoneManager.prototype.create = function(app_name, records) {
      var app = this.apps[app_name];
      var payload = {
        app: app.appid,
        records: records
      };
      var response = UrlFetchApp.fetch(
          "@1/records.json".replace(/@1/g,this._getEndpoint(app.guestid)),
         this._postOption(app, payload)
      );
      return response;
  };
    // レコードの検索
    KintoneManager.prototype.search = function(app_name, query){
       var q = encodeURIComponent(query);
       var app = this.apps[app_name];
       var response = UrlFetchApp.fetch(
         "@1/records.json?app=@2&query=@3"
            .replace(/@1/g, this._getEndpoint(app.guestid))
            .replace(/@2/g, app.appid)
            .replace(/@3/g, q),
         this._getOption(app)
       );
       return response;
    };
    // レコードの更新
    KintoneManager.prototype.update = function(app_name, records) {
        var app = this.apps[app_name];
        var payload = {
          app: app.appid,
          records: records
        };
        var response = UrlFetchApp.fetch(
            "@1/records.json".replace(/@1/g, this._getEndpoint(app.guestid)),
           this._putOption(app, payload)
        );
        return response;
    };
    // レコードの削除
    KintoneManager.prototype.destroy = function(app_name, record_ids){
       var app = this.apps[app_name];
       var query = "app=" + app.appid;
       for(var i=0; i<record_ids.length;i++){
           query += "&ids[@1]=@2".replace(/@1/g,i).replace(/@2/g,record_ids[i]);
       }
       var response = UrlFetchApp.fetch(
         "@1/records.json?@2"
            .replace(/@1/g, this._getEndpoint(app.guestid))
            .replace(/@2/g, query),
         this._deleteOption(app)
       );
       return response;
    };
    // GETメソッドの時のオプション情報
    KintoneManager.prototype._getOption = function(app) {
       var option = {
          method: "get",
          headers: this._authorizationHeader(app),
          muteHttpExceptions: true
       };
       return option;
    };
    // POSTメソッドの時のオプション情報
    KintoneManager.prototype._postOption = function(app,payload) {
       var option = {
               method: "post",
               contentType: "application/json",
               headers: this._authorizationHeader(app),
               muteHttpExceptions: true,
               payload: JSON.stringify(payload)
       };
       return option;
    };
    // PUTメソッドの時のオプション情報
    KintoneManager.prototype._putOption = function(app,payload) {
       var option = {
               method: "put",
               contentType: "application/json",
               headers: this._authorizationHeader(app),
               muteHttpExceptions: true,
               payload: JSON.stringify(payload)
       };
       return option;
    };
    // DELETEメソッドの時のオプション情報
    KintoneManager.prototype._deleteOption = function(app) {
       var option = {
          method: "delete",
          headers: this._authorizationHeader(app),
          muteHttpExceptions: true
       };
       return option;
    };
    // エンドポイントの取得
    KintoneManager.prototype._getEndpoint = function(guest_id) {
      var endpoint = "https://@1.cybozu.com".replace(/@1/g,this.subdomain);
      if (guest_id == null) {
        return endpoint + "/k/v1";
      } else {
        return endpoint + "/k/guest/@1/v1".replace(/@1/g, guest_id);
      }
    };
    // ヘッダーの認証情報
    KintoneManager.prototype._authorizationHeader = function(app) {
      if (this.authorization) {
         // パスワード認証
         return { "X-Cybozu-Authorization": this.authorization };
      } else if (app.token) {
         // APIトークン認証
         return { "X-Cybozu-API-Token": app.token };
      } else {
        throw new Error("kintone APIを呼ぶための認証情報がありません。");
      }
    };
    return KintoneManager;
})();


var subdomain = kintoneSubDomain;
// var apps = {
//   YOUR_APPLICATION1: { appid: 1, name: "nezulatoon_db", token: kintoneAccessToken },
// };

// console.log(apps);

// var kintone_manager = new KintoneManager(subdomain, apps);

var apps = {
  YOUR_APPLICATION1: { appid: 1, name: "アプリ１"},
};
var user = kintoneUserName;
var pass = kintoneUserPass;

var kintone_manager = new KintoneManager(subdomain, apps, user, pass);

function sendRecordToKintone(streatName, numPaint, paintColor) {
  var paintedCoordinateList = generatePaintedArea(streatName, numPaint);
  console.log("#####");
  console.log(paintedCoordinateList);


  console.log(paintedCoordinateList.length);

  var insertData = '[{"id": 1, "record": {';
  for (let i=0; i<paintedCoordinateList.length; i++) {
    var paintedCoordinate = paintedCoordinateList[i];
    var record = Utilities.formatString('"%s": {"value": "%s"}', paintedCoordinate, paintColor);
    insertData += record;
    if (i != paintedCoordinateList.length - 1) {
      insertData += ",";
    }
  }
  insertData += '}}]';

  console.log(insertData);
  console.log("#####");
  var records = JSON.parse(insertData);
  console.log("#####");
  console.log(records);

  var response = kintone_manager.update("YOUR_APPLICATION1", records);
  console.log("response: ");
  console.log(response);
  // ステータスコード
  // 成功すれば200になる
  var code = response.getResponseCode();
  console.log("######");
  console.log(response.getContentText());
  console.log("STATUS: ");
  console.log(code);
}

function testSendRecordToKintone(){
  var streatName = "a";
  var numPaint = 3;
  var paintColor = "red";
  sendRecordToKintone(streatName, numPaint, paintColor);
}
















