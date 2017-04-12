import Highcharts from 'highcharts/highstock'
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
Template.WidgetChartLine.onRendered(async function() {

  const that = this
  // Tracker.autorun(function() {
  const widget = that.data.data
  // Tracker.autorun(function()
  const instance = Template.instance()

  let series = await Promise.all(widget.series.map(({
    device,
    attribute,
    ...options
  }) => {
    return new Promise((resolve, reject) => {
      Meteor.call('data.get',{ id:device, key:attribute}, function (error, data) {
        if(error){
          return reject(error);
        }
        const ret = {
          ...options,
          data: data.map(data => [new Date(data.createAt).getTime(), parseFloat(data.value)])
        }
        return resolve(ret);
      });
    });
  }));
  if (series.length == 0) {
    return
  }
  this.subscribe('DataFromDashboard', {keys: widget.series.map(({device}) => device), variables: widget.series.map(({attribute}) => attribute)} )
  let map = Highcharts.stockChart(that.find('.graph'), {
    chart: {
      animation: false,
      zoomType: 'x',
      events: {
        load: () => {
          instance.cursor = widget.series.map(({ device, attribute, ...options }, index) => {
            let cursor = Data.find({
                owner: device, name: attribute
              },
              {
                sort: {"createAt":1}
              });
            return cursor.observe({
              added: (data) => {
                map && map.series[index].addPoint([new Date(data.createAt).getTime(), parseFloat(data.value)]);
              }
            }).stop
          });
        }
      }
    },
    rangeSelector: {

                buttons: [{
                    type: 'day',
                    count: 1,
                    text: '1d'
                },{
                    type: 'day',
                    count: 3,
                    text: '3d'
                }, {
                    type: 'week',
                    count: 1,
                    text: '1w'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                selected: 0
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
    series
  })
})
Template.WidgetChartLine.onDestroyed(function() {
  const instance = Template.instance()
  if (instance.cursor) instance.cursor.forEach(c => c())

});
