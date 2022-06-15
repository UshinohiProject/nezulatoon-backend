function sendWeaponToObniz(weaponName) {
  var obnizID = PropertiesService.getScriptProperties().getProperty("OBNIZ_ID")
  var urlObniz = "https://obniz.com/obniz/" + obnizID + "/message?data=spetialGun"
  let responseDataGET2 = UrlFetchApp.fetch(urlObniz).getContentText();
  console.log(responseDataGET2);
}

function testSendWeaponToObniz() {
  sendWeaponToObniz("spetialGun")
}