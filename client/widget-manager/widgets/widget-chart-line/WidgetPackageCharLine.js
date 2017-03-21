import Widgets from '../../widgets'
import SimpleSchema from 'simpl-schema'
SimpleSchema.extendOptions(['autoform'])

const pluginName = 'List'
WidgetPackageChartLineSchema = new SimpleSchema({
  'title': {
    type: String
  },
  'subtitle': {
    type: String
  },
  'yAxis': {
    type: String
  },
  series: {
    type: Array,
    optional: false
  },
  'series.$': Object,
  'series.$.device': {
    type: String,
    autoform: {
      type: 'select',
      afFieldInput: {
        options: function() {
          return Thing.find().map(function(p) {
            return {
              label: p.name,
              value: p._id
            }
          })
        }
      }
    }
  },
  'series.$.name': {
    type: String
  },
  'series.$.attribute': {
    type: String,
    autoform: {
      type: 'select',
      afFieldInput: {
        options: function() {
          return Variables.find().map(function(p) {
            return {
              label: p.name,
              value: p.name
              // value: p._id.toHexString()
            }
          })
        }
      }
    }
  },
  'series.$.color': {
    type: String,
    autoform: {
      type: 'color'
    }
  },
  createAt: {
    type: Date,
    label: 'Create At',
    autoValue: () => new Date(),
    autoform: {
      afFieldInput: {
        type: 'hidden'
      }
    }
  }
})
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
// Template.WidgetPackageChartLine.onCreated(function() {
AutoForm.addHooks('WidgetPackageChartLineID', {
  onSubmit: function(insertDoc, updateDoc, currentDoc) {
    this.event.preventDefault()

    debugger
    Meteor.call('widgets.add', {
      'name': 'WidgetChartLine',
      'dashboard': FlowRouter.current().params.id,
      data: {
        'title': insertDoc.title,
        'subtitle': insertDoc.subtitle,
        'yAxis': insertDoc.yAxis,
        'series': insertDoc.series
      }
    }, (err, result) => {
      if (err) return this.done(err) // failed to submit, call onError with the provided error
      this.done(null, result) // submitted successfully, call onSuccess with `result` arg set to "foo"

    })
    // You must call this.done()!
    //this.done(); // submitted successfully, call onSuccess
  }
}, true)

// });