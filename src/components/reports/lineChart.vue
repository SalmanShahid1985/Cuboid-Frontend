<template>
  <div :class="fetchingData ? 'flex-center' : ''">
    <div class="flex-center" v-if="fetchingData">
      <v-progress-circular size="100" indeterminate color="orange darken-1" />
    </div>
    <apexchart
      v-else
      type="line"
      height="100%"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "lineChart",
  components: { apexchart: VueApexCharts },
  props: ["lineData", "propType", "dateFilter", "vatFilter", "paymentMethodFilter"],
  data: function () {
    return {
      options: {},
      fetchingData: false,
      title: {
        text: "Product Trends by Month",
        align: "left",
      },
      series: [{ name: "Vipps", data: [0, 0] }],
      vatType: "with",
      paymentMethod: "all",
    };
  },
  computed: {
    month() {
      let monthList = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      var monthNumber = new Date(this.dateFilter).getMonth();
      return monthList[monthNumber];
    },
  },
  methods: {
    updateData() {
      if (this.lineData.data) {
        let dateList = [];
        if (this.propType) {
          if(this?.lineData?.stripe) {
             dateList = this.lineData.data.stripe.data.map(function (x) {
              return x.date;
            });
          } else {
             dateList = this.lineData.data.vipps.data.map(function (x) {
              return x.date;
            });
          }
          var keyList = Object.keys(this.lineData.data);
          this.series = [];
        }
        if (this.propType && this.propType == "revenue") {
          for (i = 0; i < keyList.length; i++) {
            var x = this.lineData.data[keyList[i]].data.map(function (x) {
              return x.revenue;
            });
            this.series.push({
              name: keyList[i],
              data: x,
            });
          }

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
              categories: dateList,
              labels: {
                style: {
                  fontSize: "10px",
                },
              },
            },
            stroke: {
              curve: "smooth",
            },
            dataLabels: {
              enabled: false,
            },
            colors: ["#2B7CBD", "#f8932d", "red"],
          };
        } else if (this.propType && this.propType == "count") {
          for (i = 0; i < keyList.length; i++) {
            var y = this.lineData.data[keyList[i]].data.map(function (x) {
              return x.count;
            });
            this.series.push({
              name: keyList[i],
              data: y,
            });
          }

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
              categories: dateList,
              labels: {
                style: {
                  fontSize: "10px",
                },
              },
            },
            stroke: {
              curve: "smooth",
            },
            dataLabels: {
              enabled: false,
            },
            colors: ["#2B7CBD", "#f8932d", "red"],
          };
        } else {
          var z = [];
          var month = new Date(this.dateFilter).getMonth() + 1;
          var year = new Date(this.dateFilter).getFullYear();
          var numberDays = new Date(year, month, 0).getDate();
          var dates = [];
          for (var i = 0; i < numberDays; i++) {
            dates.push(`${this.month}, ${i}`);
          }
          for (var i = 0; i < numberDays; i++) {
            z.push(this.checkDateTotal(i));
          }
          this.series = [
            {
              name: this.paymentMethod,
              data: z,
            },
          ];
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
              categories: dates,
            },
            stroke: {
              curve: "smooth",
            },
            dataLabels: {
              enabled: false,
            },
            colors: ["#2B7CBD", "#f8932d", "red"],
          };
        }
      }
      this.fetchingData = false;
    },
    checkDateTotal(b) {
      var val = 0;
      var valuefilter = this.lineData.data.filter(
        (x) => new Date(x._id).getUTCDate() == b
      )[0];
      if (valuefilter) {
        val = this.vatType === 'with' ? parseInt(valuefilter.totalwithVAT) : parseInt(valuefilter.totalwithoutVAT);
      }
      return val;
    },
  },
  mounted() {
    this.vatType = this.vatFilter;
    this.paymentMethod = this.paymentMethodFilter;
    console.log(this.vatType);
    console.log('linechart', this.lineData);
    this.updateData();
  },
  watch: {
    propType: {
      handler: function () {
        this.updateData();
      },
    },
    lineData: {
      handler: function () {
        this.updateData();
      },
    },
    dateFilter: {
      handler: function () {
        if (this.propType) {
          this.fetchingData = true;
          setTimeout(() => {
            this.fetchingData = false
          }, 5000)
        }
      },
    },
  },
};
</script>


