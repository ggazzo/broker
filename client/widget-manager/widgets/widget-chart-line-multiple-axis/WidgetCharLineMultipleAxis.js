import Highcharts from 'highcharts'
require('highcharts/modules/exporting')(Highcharts)

Template.WidgetChartLineMultipleAxis.helpers({
  widgets() {
    return Widget.find({});
  }
});

Template.WidgetChartLineMultipleAxis.events({});
Template.WidgetChartLineMultipleAxis.onCreated(function() {

});
let a = 0;
Template.WidgetChartLineMultipleAxis.onRendered(function() {
  let that = this
  Tracker.autorun(function() {
    let widget = that.data.data
    // Tracker.autorun(function() {
    let series = widget.series.map(({
      device,
      attribute,
      ...options
    }, index) => {
      let cursor = Data.find({
        owner: device,
        name: attribute
      })
      return { ...options,
        yAxis: index,
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
          zoomType: 'xy'
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
        yAxis: [{ // Primary yAxis
          labels: {
            format: '{value}°C',
            style: {
              color: Highcharts.getOptions().colors[0]
            }
          },
          title: {
            text: 'Temperature',
            style: {
              color: Highcharts.getOptions().colors[0]
            }
          }
        }, { // Primary yAxis
          labels: {
            format: '{value}°C',
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          },
          title: {
            text: 'Temperature 2',
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          },
          opposite: true
        }],
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

    } catch (e) {
      console.log(e);
    } finally {

    }
  });
})
Template.WidgetChartLineMultipleAxis.onDestroyed(function() {
  const instance = Template.instance()
  if (instance.cursor) instance.cursor.forEach(c => c.stop())

});