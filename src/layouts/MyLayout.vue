<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header ref="header">
      <q-toolbar color="negative" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'">
        <q-toolbar-title>
          Distribucion Calypso
        </q-toolbar-title>
        <q-btn :icon="'folder'" color="primary" :label="'Cargar'" @click="recargar" />
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer v-model="drawer" :content-class="[$q.theme === 'mat' ? 'bg-grey-2' : null, 'dock']">
      <q-list no-border link inset-delimiter separator>
        <q-list-header :class="['dock-font']">Departamentos</q-list-header>
        <q-collapsible v-for="(dept, key) in departamentos" :key="key" :label="key" group='depts' :ref='key'>
          <q-item v-for="(value, key) in dept" :key="key">
            <q-item-main :label="key + ': ' + value" :class="['dock-info']" />
          </q-item>
        </q-collapsible>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view :header="header" />
    </q-page-container>
  </q-layout>
</template>

<script>
import fs from "fs";

export default {
  name: "MyLayout",
  data() {
    return {
      drawer: true,
      departamentos: undefined,
      editando: false,
      header: undefined
    };
  },
  created: function() {
    var self = this;
    var file_path = __statics + "/totales.json";
    this.departamentos = JSON.parse(fs.readFileSync(file_path, "utf8"));
    this.$root.$on("tab-selected", function(message) {
      let selected = self.$refs[message][0];
      selected.show();
    });
    this.$root.$on("save-totals", function() {
      if (self.departamentos != null || self.departamentos != undefined) {
        fs.writeFile(file_path, JSON.stringify(self.departamentos), function(
          err
        ) {
          if (err) {
            return console.log(err);
          }
          self.$q.notify({
            message: "Se han guardado los cambios satisfactoriamente",
            timeout: 1500,
            icon: "save"
          });
        });
      }
    });
    this.$q.electron.ipcRenderer.on("reloaded", () => {
      var file_path = __statics + "/totales.json";
      this.departamentos = JSON.parse(fs.readFileSync(file_path, "utf8"));
    });
  },
  mounted: function() {
    this.header = this.$refs.header.$el;
  },
  methods: {
    enrutar: function() {
      if (this.editando) {
        this.$router.replace("/");
        this.editando = false;
      } else {
        this.$router.replace({
          name: "edit",
          params: { data: this.departamentos }
        });
        this.editando = true;
      }
    },
    recargar: function() {
      this.$q.electron.ipcRenderer.send("reload");
    }
  }
};
</script>

<style>
.dock {
  width: 30%;
}
.dock-font {
  font-size: 1.2vw;
  color: red;
}

.dock-info {
  font-size: 1vw;
}
</style>
