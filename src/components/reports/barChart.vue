<template>
  <div>
    <apexchart
      type="bar"
      width="100%"
      height="100%"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "BarChart",
  components: { apexchart: VueApexCharts },
  props: ["barData", "propType"],
  data: function () {
    return {
      options: {},
      title: {
        text: "Product Trends by Month",
        align: "left",
      },
      series: [
        {
          name: "Product Sales",
          data: [0,0,0,0],
        },
      ],
    };
  },
  methods: {
    updateChart() {
      if(this.barData.data){
      var x = this.barData.data.map(function (x) {
        return x.product_name;
      });
      this.options = {
        chart: {
          redrawOnParentResize: true,
          id: "vuechart-example",
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
        },
        xaxis: {
          categories: x,
        },
        yaxis: {
          labels: {
            maxWidth: 60,
            truncate: true,
          },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#2B7CBD"],
      };
      var y;
      if (this.propType == "revenue") {
        y = this.barData.data.map(function (x) {
          return x.revenue;
        });
      } else {
        y = this.barData.data.map(function (x) {
          return x.count;
        });
      }
      this.series = [{ name: "VIPPS", data: y }];
    }
    }
  },

  watch: {
    barData: {
      handler: function () {
        this.updateChart();
      },
    },
    propType: {
      handler: function () {
        this.options.xaxis.categories = [""];
        this.updateChart();
      },
    },
  },

  beforeMount() {
    this.updateChart();
  },
};
</script>
