import Widgets from '../../widgets'
import SimpleSchema from 'simpl-schema'
SimpleSchema.extendOptions(['autoform'])

const pluginName = "List"
WidgetPackageChartLineSchema = new SimpleSchema({
  name: {
    type: String,
    autoValue: () => "WidgetChartLine",
    autoform: {
      afFieldInput: {
        type: 'hidden'
      }
    }
  },
  dashboard: {
    type: String,
    autoValue: () => "WidgetChartLine",
    autoform: {
      afFieldInput: {
        type: 'hidden'
      }
    }
  },
  "title": {
    type: String
  },
  "subtitle": {
    type: String
  },
  "yAxis": {
    type: String
  },
  series: {
    type: Array
  },
  "series.$": Object,
  "series.$.device": {
    type: String,
    autoform: {
      afFieldInput: {
        options: function() {
          return Thing.find().map(function(p) {
            return {
              label: p.name,
              value: p._id
            };
          });
        }
      }
    }
  },
  "series.$.name": {
    type: String,
    autoform: {
      type: "select",
      afFieldInput: {
        options: function() {
          return Variables.find().map(function(p) {
            return {
              label: p.name,
              value: p._id
            };
          });
        }
      }
    }
  },
  "series.$.color": {
    type: String,
    autoform: {
      type: "color"
    }
  },
  createAt: {
    type: Date,
    label: "Create At",
    autoValue: () => new Date(),
    autoform: {
      afFieldInput: {
        type: 'hidden'
      }
    }
  }
})


Template.WidgetPackageChartLine.helpers({});

Widgets.add({
  name: pluginName,
  template: 'WidgetPackageChartLine',
  group: 'chart',
  description: 'bla bla',
  image: '/chart.png',
  schema: WidgetPackageChartLineSchema
})
// 
// Template.WidgetPackageChartLine.events({
//   'change select': function(e) {
//     console.log(e, this)
//   }
// })
// Template.WidgetPackageChartLineDeviceAttr.onRendered(function() {
//   $(this.find('.device')).select2()
//   $(this.find('.attr')).select2()
// })
// Template.WidgetPackageChartLineDeviceAttr.onCreated(function() {
//   this.handler = new ReactiveVar();
// });