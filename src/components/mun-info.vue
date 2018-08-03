<template>
  <q-collapsible 
    :label="mun.name"
    group='muns'
  >
    <q-input
        v-for="(value, key, index) in mun"
        :key="uid(index, key)"
        v-model="mun[key]"
        :stack-label='labels[key]'
        align ='right'
        class = 'q-mb-sm'
        v-if = 'labels[key]'
    />
  </q-collapsible>
</template>

<script>
import { uid } from 'quasar';
export default {
  name: "mun-info",
  props: {
    mun: {}
  },
  data() {
    return {
      labels: {
        population: 'Poblacion: ',
        actualclients: 'Clientes Actuales: ',
        posnewclients: 'Posibles nuevos clientes: ',
        pospqnclients: 'Posibles Clientes PQN: ',
        posvariousclients: 'Posibles Clientes Varios: ',
        posmixclients: 'Posibles Clientes PQN Varios: ',
        progsales:'Ventas Programadas: $',
        category:'Categoria'
      }
    };
  },
  methods: {
    uid: function(index, key){
      return uid();
    }
  }
};
</script>

<style>
</style>
