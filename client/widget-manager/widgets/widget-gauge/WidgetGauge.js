import Highcharts from 'highcharts'
require('highcharts/modules/exporting')(Highcharts)

Template.WidgetGauge.helpers({
  widgets() {
    return Widget.find({});
  }
});

Template.WidgetGauge.events({});
Template.WidgetGauge.onCreated(function() {

});
let a = 0;
Template.WidgetGauge.onRendered(function() {
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
          type: 'gauge',
          plotBackgroundColor: null,
          plotBackgroundImage: null,
          plotBorderWidth: 0,
          plotShadow: false
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
        // the value axis
        yAxis: {
          min: 0,
          max: 200,

          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 10,
          minorTickPosition: 'inside',
          minorTickColor: '#666',

          tickPixelInterval: 30,
          tickWidth: 2,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: '#666',
          labels: {
            step: 2,
            rotation: 'auto'
          },
          title: {
            text: 'km/h'
          },
          plotBands: [{
            from: 0,
            to: 120,
            color: '#55BF3B' // green
          }, {
            from: 120,
            to: 160,
            color: '#DDDF0D' // yellow
          }, {
            from: 160,
            to: 200,
            color: '#DF5353' // red
          }]
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
Template.WidgetGauge.onDestroyed(function() {
  const instance = Template.instance()
  if (instance.cursor) instance.cursor.forEach(c => c.stop())

});