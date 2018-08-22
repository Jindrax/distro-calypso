const fs = require('fs');
const XLSX = require('xlsx');
const excel = require('exceljs');
const path = './data.xlsx';
const regex = /\r\n/g;

let workbook = new excel.Workbook();
workbook.xlsx.readFile(path)
  .then(function () {
    workbook.eachSheet((sheet, sheetId) => {
      console.log("Inicio de pagina");
      let first_cell = sheet.getCell(2, 1); 
      console.log(sheet.name ,first_cell.address);
      console.log("Fin de pagina");
    });
  });