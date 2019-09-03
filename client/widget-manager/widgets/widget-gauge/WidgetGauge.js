import ChartModuleMore from 'highcharts/highcharts-more.js'
import HCSoldGauge from 'highcharts/modules/solid-gauge'
import Highcharts from 'highcharts'
import Data from '../../../../collections/Data'

ChartModuleMore(Highcharts)
HCSoldGauge(Highcharts)

Template.WidgetGauge.helpers({
  widgets() {
    return Widget.find({})
  }
})

Template.WidgetGauge.events({})
Template.WidgetGauge.onCreated(function() {

})
let a = 0
Template.WidgetGauge.onRendered(function() {



  const [widget] = this.data.data.series

  const { bands, unit, suffix } = this.data.data

  Highcharts.chart(this.find('.graph'), {

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

    pane: {
      startAngle: -150,
      endAngle: 150,
      background: [{
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, '#FFF'],
            [1, '#333']
          ]
        },
        borderWidth: 0,
        outerRadius: '109%'
      }, {
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, '#333'],
            [1, '#FFF']
          ]
        },
        borderWidth: 4,
        outerRadius: '107%'
      }, {
        // default background
      }, {
        backgroundColor: '#DDD',
        borderWidth: 0,
        outerRadius: '105%',
        innerRadius: '103%'
      }]
    },

    // the value axis
    yAxis: {
      min: Math.min.apply(null, bands.map(({ from }) => from).filter(e => e !== undefined).map(e => parseFloat(e))),
      max: Math.max.apply(null, bands.map(({ to }) => to).filter(e => e !== undefined).map(e => parseFloat(e))),

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
        step: 1,
        rotation: 'auto'
      },
      title: {
        text: unit
      },
      plotBands: bands.filter(e => !!e.from)
    },

    series: [{
      name: widget.title,
      data: [80],
      tooltip: {
        valueSuffix: suffix,
      }
    }]

  },
    // Add some life
  (chart) => {
    this.subscribe('DataFromDashboard', {
      keys: widget.device,
      variables: widget.attribute
    })
    const cursor = Data.find({
      owner: widget.device,
      name: widget.attribute
    }, {
      sort: {
        'createAt': 1
      }
    })

    this.observe = cursor.observe({
      added: (data) => {
        const [point] = chart.series[0].points
        point.update(parseFloat(data.value))
      }
    })
  })
})

Template.WidgetGauge.onDestroyed(function() {
  const instance = Template.instance()
  if (instance.cursor) instance.cursor.forEach(c => c.stop())

})
