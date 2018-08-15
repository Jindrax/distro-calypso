<template>
  <q-card :style="{position: absolute, top: posY, left: posX}">
    <q-resize-observable @resize="onResize"/>
    <q-card-title class="bg-primary text-white">
      {{d.properties.name}}
    </q-card-title>
    <q-card-main v-if="d.properties.category == null || d.properties.category == undefined" class="q-py-xs bg-white">
      <q-item v-for="(value, key) in d.properties" v-if="!bannedProps.includes(key)" :key="key" dense class="q-px-xs">
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
  props: ["d", "mouse", "parent", "leftSide"],
  data() {
    return {
      absolute: "absolute",
      offset: {
        x: 5,
        y: 5
      },
      height: 0,
      bottomMargin: 100000,
      bannedProps: ["name"]
    };
  },
  mounted: function() {
    this.height = this.$el.clientHeight;
    this.bottomMargin =
      this.parent.clientHeight +
      this.parent.offsetTop -
      this.height -
      this.offset.y;
  },
  watch: {
    mouse: function(val) {
      this.height = this.$el.clientHeight;
      this.bottomMargin =
        this.parent.clientHeight +
        this.parent.offsetTop -
        this.height -
        this.offset.y;
    }
  },
  computed: {
    posX: function() {
      return this.mouse.x + this.offset.x - this.leftSide + "px";
    },
    posY: function() {
      if (this.mouse.y > this.bottomMargin) {
        return this.mouse.y - this.height - this.parent.offsetTop + "px";
      } else {
        return this.mouse.y + this.offset.y - this.parent.offsetTop + "px";
      }
    }
  },
  methods: {
    onResize: function(size){
      this.height = size.height;
      this.bottomMargin =
        this.parent.clientHeight +
        this.parent.offsetTop -
        this.height -
        this.offset.y;
      console.log('Height', this.height);
      console.log('Margin', this.bottomMargin);
    }
  }
};
</script>

<style>
</style>
