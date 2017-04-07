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
  // Tracker.autorun(function() {
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
    },{"sort":{"createAt":1}})
    return { ...options,
      cursor: Data.find({
        owner: device,
        name: attribute
      },{"sort":{"createAt":1}}),
      data: cursor.fetch().map((data) => [new Date(data.createAt).getTime(), parseFloat(data.value)])
      // .sort({createAt:1})
    }
  })

  if (series.length == 0) {
    return
  }
  try {
    const instance = Template.instance();
    let map = Highcharts.chart(that.find('.graph'), {
      chart: {
        animation: false,
        zoomType: 'x',
        events: {
                load: function () {
                  instance.cursor = series.map(s => s.cursor)
                  instance.cursor.forEach(function(
                    cursor, index) {
                      cursor.stop = cursor.observe({
                        added: (data) => {
                          map && map.series[index].addPoint([new Date(data.createAt).getTime(), parseFloat(data.value)])
                          // Meteor.setTimeout(() => {console.log('ao'); resolve()}, 1)
                          // const old = tmp;
                          // tmp = new Promise((resolve) => {
                          //   old.then(()=>{
                          //   })
                          //
                          // });

                        }
                      }).stop;
                    })
                }
              }
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
        series: {
            turboThreshold:1000,
            animation: {
                duration: 0,
            }
        },

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
    // FlowRouter.subsReady("Data", function() {

        //  do something
      // });

    // const instance = Template.instance();
    } catch (e) {
      console.log(e);
    } finally {

    }
    // })
  })
  Template.WidgetChartLine.onDestroyed(function() {
    const instance = Template.instance()
    if (instance.cursor) instance.cursor.forEach(c => c.stop())

  });
