const fs = require('fs');
const XLSX = require('xlsx');
const excel = require('exceljs');
const path = './data.xlsx';
const mapFile = './src/assets/consolidado.json';
//Produccion
//const map = __statics + '/consolidado.json';

let workbook = new excel.Workbook();
workbook.xlsx.readFile(path)
  .then(function () {
    fs.readFile(mapFile, 'utf8', (err, data) => {
      if (err != null) {
        console.log(err);
        return;
      }
      let mapData = JSON.parse(data);
      workbook.eachSheet((sheet, sheetId) => {
        sheet.eachRow((row, rowNumber) => {
          let header = typeof row.getCell(1).value == 'string' ? row.getCell(1).value.replace(/[\n\r]/g, ' ').trim() : 'null';
          if (header == 'Nombre Municipio') {
            let newData = {};
            let dataRow = sheet.getRow(rowNumber + 1);
            row.eachCell((cell, colNumber) => {
              if (colNumber > 1) {
                newData[cell.value.replace(/[\n\r]/g, ' ').trim()] = dataRow.getCell(colNumber).value;
              }
            });
            let foundMunicipio = mapData.objects.mpios.geometries.find((municipio)=>{
              return municipio.name.trim().toUpperCase() == dataRow.getCell(1).value.trim().toUpperCase();
            });
            if(foundMunicipio != null || foundMunicipio != undefined){
              foundMunicipio.properties = newData;
              console.log(newData);
            }
          }
        });        
      });
      fs.writeFile(mapFile, JSON.stringify(mapData), function(err) {
        if(err) {
          return console.log(err);
        }
        console.log("The consolidado was saved!");
      });
    });
  });
/*
let buffers = [];
stream.on('data', function (data) {
  buffers.push(data);
});
stream.on('end', function () {
  var buffer = Buffer.concat(buffers);
  var workbook = XLSX.read(buffer, {
    type: "buffer"
  });
  console.log(workbook.Sheets[workbook.SheetNames[1]]);
  fs.writeFileSync('./data.json', JSON.stringify(workbook.Sheets[workbook.SheetNames[1]]));
});
*/
