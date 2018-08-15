const fs = require('fs');
const mapFile = './src/statics/consolidado.json';
const biblioteca = './colombia-municipios.json';
//Produccion
//const map = __statics + '/consolidado.json';

const includes = ['ESPINAL', 'PITALITO'];

fs.readFile(mapFile, 'utf8', (err, dataMap) => {
  if (err != null) {
    console.log(err);
    return;
  }
  let mapData = JSON.parse(dataMap);
  fs.readFile(biblioteca, 'utf8', (err, dataBiblio) => {
    let biblioData = JSON.parse(dataBiblio);
    includes.forEach((object)=>{
      let municipio = biblioData.objects.mpios.geometries.find((municipio)=>{
        return municipio.properties.name == object;
      });
      console.log(municipio);
      municipio.name = municipio.properties.name;
      municipio.dpt = municipio.properties.dpt;
      mapData.objects.mpios.geometries.push(municipio);
    });
    fs.writeFile(mapFile, JSON.stringify(mapData), function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("The consolidado was saved!");
    });
  });
});
