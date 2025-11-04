function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Parsează datele primite
  var data = JSON.parse(e.postData.contents);

  // Generăm numele sheet-ului/tab-ului pentru ziua curentă (ex: 2025-10-19)
  var today = new Date();
  var sheetName = Utilities.formatDate(today, "GMT+3", "yyyy-MM-dd"); // schimbă timezone dacă vrei

  // Verificăm dacă sheet-ul există deja
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName); // creează sheet-ul
    // Adaugă antet
    sheet.appendRow(["Timestamp","Value1","Value2","Value3","Value4","Value5","Value6","Value7","Value8"]);
  }

  // Convertim timestamp-ul din fișier în ISO 8601
  var ts = new Date(data.timestamp);

  // Adaugă un rând nou cu timestamp ISO + 8 valori
  sheet.appendRow([
    ts.toISOString(),
    data.value1,
    data.value2,
    data.value3,
    data.value4,
    data.value5,
    data.value6,
    data.value7,
    data.value8
  ]);

  // Răspunde cu JSON
  return ContentService
          .createTextOutput(JSON.stringify({"status":"ok"}))
          .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var today = new Date();
  var sheetName = Utilities.formatDate(today, "GMT+3", "yyyy-MM-dd");
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return ContentService
            .createTextOutput(JSON.stringify({"error":"Sheet not found"}))
            .setMimeType(ContentService.MimeType.JSON);
  }

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return ContentService
            .createTextOutput(JSON.stringify({"error":"No data"}))
            .setMimeType(ContentService.MimeType.JSON);
  }

  var values = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues();

  // Trimite ultima valoare ca JSON
  var response = {
    "timestamp": values[0][0],  // deja ISO 8601
    "value1": values[0][1],
    "value2": values[0][2],
    "value3": values[0][3],
    "value4": values[0][4],
    "value5": values[0][5],
    "value6": values[0][6],
    "value7": values[0][7],
    "value8": values[0][8]
  };

  return ContentService
          .createTextOutput(JSON.stringify(response))
          .setMimeType(ContentService.MimeType.JSON);
}
