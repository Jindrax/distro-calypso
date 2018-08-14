<template>
  <q-page padding>
    <q-tabs>
        <q-tab v-for="(value,key) in data"
          :key='key'
          :name='key'
          :label='key'
          slot="title"
          @select='selectTab(key)'
        />
        <q-tab-pane v-for="(value,key) in data" :key='key' :name='key'>
          <q-input
            v-for="(field, key) in value"
            :key='key' v-model="field.valor"
            :stack-label='field.texto'
            type = 'number'
            align ='right'
            class = 'q-mb-sm'
          />
          <q-list-header>
            Municipios
          </q-list-header>
          <q-item-separator/>
          <mun-info
            v-for="(mun, key, index) in munsByDept[key]"
            :key = "uid(index, key)"
            :mun = mun
          />
        </q-tab-pane>
    </q-tabs>
  </q-page>
</template>

<script>
import fs from "fs";
import { uid } from 'quasar';
import MunInfo from '../components/mun-info';
var file_path = __statics + "/consolidado.json";
var munsData = JSON.parse(fs.readFileSync(file_path, "utf8"));

export default {
  name: 'editPage',
  components: {
    'mun-info': MunInfo
  },
  data: function(){
    return {
    }
  },
  props:{
    data: {}
  },
  beforeDestroy: function(){
    fs.writeFile(file_path, JSON.stringify(munsData), function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("The consolidado was saved!");
      this.$root.$emit('save-totals', 'message');
    });
  },
  computed:{
    muns: function(){
      var filtered = [];
      munsData.objects.mpios.geometries.forEach(element => {
        filtered.push(element.properties);
      });
      return filtered;
    },
    munsByDept: function(){
      var byDept = {
        'Regional': [],
        'Tolima': [],
        'Huila': [],
        'Caqueta': []
      };
      this.muns.forEach(element => {
        if(element.dpt == 'TOLIMA'){
          byDept.Tolima.push(element);
        }else if(element.dpt == 'HUILA'){
          byDept.Huila.push(element);
        }else if(element.dpt == 'CAQUETA'){
          byDept.Caqueta.push(element);
        }else{
          byDept.Regional.push(element);
        }
      });
      byDept.Regional.sort(function(a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      byDept.Tolima.sort(function(a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      byDept.Huila.sort(function(a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      byDept.Caqueta.sort(function(a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      return byDept;
    }
  },
  methods:{
    selectTab: function(dept){
      this.$root.$emit('tab-selected', dept);
    },
    uid: function(index, key){
      return uid();
    }
  }
}
</script>

<style>
</style>
