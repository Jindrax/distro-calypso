<template>
  <q-card>
    <q-card-title class="bg-primary text-white">
      {{d.properties.name}}
    </q-card-title>
    <q-card-separator />
    <q-card-main class="q-py-xs">
      <q-item v-for="(value, key) in d.properties" :key="key" dense class="q-px-xs">
        <q-item-side>
          {{key}}:
        </q-item-side>
        <q-item-main>
          {{value}}
        </q-item-main>
      </q-item>
    </q-card-main>
  </q-card>
</template>

<script>
export default {
  name: "tooltip",
  props: ["d"],
  data() {
    return {};
  }
};
</script>

<style>
</style>
