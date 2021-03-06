import {
  app,
  BrowserWindow,
  ipcMain
} from 'electron';
const fs = require('fs');
const excel = require('exceljs');
const path = require('path');

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = path.join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

const excelFile = path.join(__statics, 'data.xlsx');
const mapFile = path.join(__statics, 'consolidado.json');
const totalsFile = path.join(__statics, 'totales.json');
const testFile = path.join(__statics, 'test.txt');

let mainWindow

let regex = /\r\n/g;
let departamentos = ['TOLIMA', 'HUILA', 'CAQUETA'];

function loadData(trash, event) {
  let workbook = new excel.Workbook();
  workbook.xlsx.readFile(excelFile)
    .then(function () {
      fs.readFile(mapFile, 'utf8', (err, data) => {
        if (err != null) {
          console.log(err);
          return;
        }
        let mapData = JSON.parse(data);
        let testArray = [];
        let totales = {
          'Regional': {},
          'TOLIMA': {},
          'HUILA': {},
          'CAQUETA': {},
        };
        let municipios_visitados = [];
        let excluidos = workbook.getWorksheet('SISTEMA').getRow(2).values;
        let no_acumulables = workbook.getWorksheet('SISTEMA').getRow(4).values;
        workbook.eachSheet((sheet, sheetId) => {
          sheet.eachRow((row, rowNumber) => {
            let header = typeof row.getCell(1).value == 'string' ? row.getCell(1).value.replace(regex, ' ').trim() : 'null';
            testArray.push(header);
            if (header == 'Nombre Municipio') {
              let newData = {};
              let dataRow = sheet.getRow(rowNumber + 1);
              let numericProps = {};
              row.eachCell((cell, colNumber) => {
                if (colNumber > 1) {
                  let prop = cell.value.replace(regex, ' ').trim();
                  let value = dataRow.getCell(colNumber).value;
                  newData[prop] = value;
                  if (typeof value == 'number' && !excluidos.includes(prop)) {
                    numericProps[prop] = value;
                  }
                }
              });
              let foundMunicipio = mapData.objects.mpios.geometries.find((municipio) => {
                return municipio.name.replace(regex, ' ').trim().toUpperCase() == dataRow.getCell(1).value.replace(regex, ' ').trim().toUpperCase();
              });
              if (foundMunicipio != null || foundMunicipio != undefined) {
                newData.name = foundMunicipio.name;
                foundMunicipio.properties = newData;
                for(let prop in numericProps){
                  if(municipios_visitados.includes(foundMunicipio.name) && no_acumulables.includes(prop)){
                    console.log('Municipio: ', foundMunicipio.name);
                  }else{
                    if(departamentos.includes(foundMunicipio.dpt)){
                      if(totales[foundMunicipio.dpt][prop]==undefined){
                        totales[foundMunicipio.dpt][prop] = numericProps[prop];
                      }else{
                        totales[foundMunicipio.dpt][prop] += numericProps[prop];
                      }
                    }else{
                      if(totales['Regional'][prop]==undefined){
                        totales['Regional'][prop] = numericProps[prop];
                      }else{
                        totales['Regional'][prop] += numericProps[prop];
                      }
                    }
                    municipios_visitados.push(foundMunicipio.name);
                  }
                }
              } else {
                console.log(dataRow.getCell(1).value.replace(regex, ' ').trim().toUpperCase(), sheetId, rowNumber);
              }
            }
          });
        });
        fs.writeFile(testFile, testArray, function (err) {
          if (err) {
            return console.log(err);
          }
        });
        fs.writeFile(totalsFile, JSON.stringify(totales), function (err) {
          if (err) {
            return console.log(err);
          }
          fs.writeFile(mapFile, JSON.stringify(mapData), function (err) {
            if (err) {
              return console.log(err);
            }
            if(Object.keys(event).length > 0){
              event.sender.send('reloaded');
            }else{
              createWindow();
            }
            console.log("The consolidado was saved!");
          });
        });
      });
    });
}



function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    show: false
  })

  mainWindow.maximize()

  mainWindow.setMaximizable(false)

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', loadData)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('reload', (event, arg) => {
  loadData(null, event);
})
