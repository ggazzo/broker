import Highcharts from 'highcharts'
import Data from '../../../../collections/Data'
require('highcharts/modules/exporting')(Highcharts)

Template.WidgetChartLine.helpers({
  widgets() {
    return Widget.find({});
  }
});

Template.WidgetChartLine.events({});
Template.WidgetChartLine.onCreated(function() {

});
let a = 0;
Template.WidgetChartLine.onRendered(function() {
  let that = this
  Tracker.autorun(function() {
    let widget = that.data.data
    // Tracker.autorun(function() {
    let series = widget.series.map(({
      device,
      attribute,
      ...options
    }) => {
      let cursor = Data.find({
        owner: device,
        name: attribute
      })
      return { ...options,
        cursor,
        data: cursor.fetch().map((data) => [new Date(data.createAt).getTime(), parseFloat(data.value)])
      }
    })

    if (series.length == 0) {
      return
    }
    try {
      let map = Highcharts.chart(that.find('.graph'), {
        chart: {
          zoomType: 'x'
        },
        title: {
          text: widget.title
        },
        subtitle: {
          text: widget.subtitle
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: widget.yAxis
          }
        },
        legend: {
          layout: 'vertical',
          align: 'left',
          x: 80,
          verticalAlign: 'top',
          y: 55,
          floating: true,
          backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        credits: {
          enabled: false
        },
        tooltip: {
          shared: true
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true
            }
          }
        },

        series: series.map(({
          cursor,
          ...options
        }) => options)
      });

      // // return
      // const instance = Template.instance();
      // instance.cursor = series.map(s => s.cursor)
      // instance.cursor.forEach(function(
      //   cursor, index) {
      //   cursor.stop = cursor.observeChanges({
      //     added: function(id, data) {
      //       debugger
      //       // map.series[index].addPoint([new Date(data.createAt).getTime(), parseFloat(data.value)])
      //     }
      //   }).stop;
      // })
    } catch (e) {
      console.log(e);
    } finally {

    }
  });
})
Template.WidgetChartLine.onDestroyed(function() {
  const instance = Template.instance()
  if (instance.cursor) instance.cursor.forEach(c => c.stop())

});