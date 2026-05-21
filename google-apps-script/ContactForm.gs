/**
 * Google Apps Script — script.google.com project (standalone).
 * Deploy: Web app · Execute as Me · Who has access: Anyone
 *
 * SHEET ID (from spreadsheet URL):
 * https://docs.google.com/spreadsheets/d/1OWy_me9fyFqcx_vZUhEvioTCMJIryLfnnF5BtcZZbh4/edit
 */
var SHEET_ID = "1OWy_me9fyFqcx_vZUhEvioTCMJIryLfnnF5BtcZZbh4";

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    var p = e.parameter;

    sheet.appendRow([
      new Date(),
      p.Name || "",
      p.Email || "",
      p.Mobile || "",
      p.Subject || "",
      p.Message || "",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "comm.link relay online", sheetId: SHEET_ID })
  ).setMimeType(ContentService.MimeType.JSON);
}
