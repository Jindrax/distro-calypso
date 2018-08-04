<template>
  <q-card :style="{position: absolute, top: posY, left: posX}">
    <q-card-title class="bg-primary text-white">
      {{d.properties.name}}
    </q-card-title>
    <q-card-main class="q-py-xs bg-white">
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
  props: ['d', 'mouse', 'windowHeight', 'leftSide'],
  data() {
    return {
      absolute: 'absolute',
      offset: {
        x: 5,
        y: -5
      },
      height: 0
    };
  },
  computed:{
    bottomMargin: function(){
      return this.windowHeight - this.height;
    },
    posX: function(){
      console.log('mouseX: ', this.mouse.x);
      return this.mouse.x + this.offset.x - this.leftSide + "px"
    },
    posY: function(){
      if (this.mouse.y > this.bottomMargin) {
            console.log('mouseY: ', this.mouse.y);
            return (this.mouse.y - this.height + "px");
          } else {
            console.log('mouseY: ', this.mouse.y);
            return this.mouse.y + this.offset.y + "px";
          }
    }
  },
  mounted() {
    this.height = this.$el.clientHeight;
  },
};
</script>

<style>
</style>
