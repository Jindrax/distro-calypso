<template>
  <q-page class="flex flex-center" id="viewport">
    <q-resize-observable @resize="onResize" />
    <tooltip v-if="d != undefined" v-show="false" :d="d" ref="tooltip"/>
  </q-page>
</template>

<style>

div.tooltip {
  position: absolute;
  background-color: white;
  border: 1px solid black;
  color: black;
  font-weight: bold;
  padding: 3px 3px;
  display: none;
}

.tract-border {
  fill: none;
  stroke: #777;
  stroke-width: 0.5px;
  pointer-events: none;
}

.cat1 {
  fill: green;
}

.cat2 {
  fill: orange;
}

.cat3 {
  fill: blue;
}

.cat4 {
  fill: yellow;
}
</style>

<script>
import { dom } from "quasar";
const { height, width } = dom;
import * as d3 from "d3";
import * as topojson from "topojson";
import fs from "fs";
import Tooltip from "../components/tooltip";

export default {
  name: "PageIndex",
  data: function() {
    return {
      svg: undefined,
      tooltip: undefined,
      tooltipOffset: { x: 15, y: -15 },
      height: 0,
      leftSide: 0,
      d: undefined
    };
  },
  computed: {
    bottomMargin: function() {
      return this.height * 0.75;
    }
  },
  methods: {
    onResize(size) {
      var self = this;
      this.leftSide = this.$el.getBoundingClientRect().left;
      this.height = size.height;
      let file_path = __statics + "/consolidado.json";
      let vp = document.getElementById("viewport");
      if (this.svg != undefined) {
        d3.select("svg").remove();
      }
      if (this.tooltip == undefined) {
        this.tooltip = d3
          .select(vp)
          .append("div")
          .attr("class", "tooltip");
      }
      var svg = d3
        .select(vp)
        .append("svg")
        .attr("id", "lienzo")
        .attr("width", size.width)
        .attr("height", size.height)
        .style("overflow", "hidden");
      var data = JSON.parse(fs.readFileSync(file_path, "utf8"));
      if (data != undefined) {
        var land = topojson.feature(data, {
          type: "GeometryCollection",
          geometries: data.objects.mpios.geometries.filter(function(d) {
            return ((d.id / 10000) | 0) % 100 !== 99;
          })
        });
        var margin = { w: size.width * (3 / 100), h: size.height * (3 / 100) };
        var path = d3.geoPath().projection(
          d3
            .geoTransverseMercator()
            .rotate([74 + 30 / 60, -38 - 50 / 60])
            .fitExtent(
              [
                [margin.w, margin.h],
                [size.width - margin.h, size.height - margin.h]
              ],
              land
            )
        );
        svg
          .selectAll("path")
          .data(land.features)
          .enter()
          .append("path")
          .attr("class", function(d) {
            if (d.properties.category == "1") {
              return "cat1";
            }
            if (d.properties.category == "2") {
              return "cat2";
            }
            if (d.properties.category == "3") {
              return "cat3";
            }
            if (d.properties.category == "4") {
              return "cat4";
            }
          })
          .attr("d", path)
          .on("mouseover", function(d) {
            self.showTooltip(d, self);
          })
          .on("mousemove", function(d) {
            self.moveTooltip(self);
          })
          .on("mouseout", function(d) {
            self.hideTooltip(self);
          })
          .on("click", function(d) {
            console.log("funciona");
          });
        svg
          .append("path")
          .datum(
            topojson.mesh(data, data.objects.mpios, function(a, b) {
              return a !== b;
            })
          )
          .attr("class", "tract-border")
          .attr("d", path);
      }
      this.$data.svg = svg;
    },
    showTooltip(d, self) {
      self.d = d;
      self.moveTooltip(self);
      self.tooltip
        .style("display", "block")
        .html(self.$refs.tooltip.$el.innerHTML);
    },
    moveTooltip(self) {
      console.log(self.$refs.tooltip.$el.clientHeight);
      self.tooltip
        .style("top", function() {
          if (d3.event.pageY > self.bottomMargin) {
            return (
              d3.event.pageY -
              self.tooltip.node().getBoundingClientRect().height +
              "px"
            );
          } else {
            return d3.event.pageY + self.tooltipOffset.y + "px";
          }
        })
        .style("left", d3.event.pageX + self.tooltipOffset.x - self.leftSide + "px");
    },
    hideTooltip(self) {
      self.tooltip.style("display", "none");
    }
  },
  components:{
    Tooltip
  }
};
</script>
