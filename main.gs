function doGet(e) {
  var streatName = e.parameter.streatName;
  var weaponName = e.parameter.weaponName;
  var latitude = e.parameter.latitude;
  var longitude = e.parameter.longitude;

  response = {
    weaponName:weaponName,
    streatName:streatName,
    latitude:latitude,
    longitude:longitude
  };

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}

function sendWeaponToObniz(weaponName) {
  var obnizID = PropertiesService.getScriptProperties().getProperty("OBNIZ_ID");
  var urlObniz = "https://obniz.com/obniz/" + obnizID + "/message?data=spetialGun";
  let responseDataGET2 = UrlFetchApp.fetch(urlObniz).getContentText();
  console.log(responseDataGET2);
}

function testSendWeaponToObniz() {
  sendWeaponToObniz("spetialGun");
}

function paint() {
  
}