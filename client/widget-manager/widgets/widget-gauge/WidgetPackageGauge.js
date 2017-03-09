import Widgets from '../../widgets'
import SimpleSchema from 'simpl-schema'
SimpleSchema.extendOptions(['autoform'])

const pluginName = "Gauge"
WidgetPackageGaugeSchema = new SimpleSchema({
  "title": {
    type: String
  },
  "yAxis": {
    label: 'Inner text',
    type: String
  },
  bands: {
    type: Array,
    optional: false
  },
  "bands.$": Object,
  "bands.$.from": {
    type: Number
  },
  "bands.$.to": {
    type: Number
  },
  "bands.$.color": {
    type: String,
    autoform: {
      type: "color"
    }
  },
  series: {
    type: Array,
    optional: false
  },
  "series.$": Object,
  "series.$.device": {
    type: String,
    autoform: {
      type: "select",
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
  "series.$.suffix": {
    type: String
  },
  "series.$.attribute": {
    type: String,
    autoform: {
      type: "select",
      afFieldInput: {
        options: function() {
          return Variables.find().map(function(p) {
            return {
              label: p.name,
              value: p.name
              // value: p._id.toHexString()
            };
          });
        }
      }
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
Widgets.add({
  name: pluginName,
  template: 'WidgetPackageGauge',
  group: 'chart',
  description: 'bla bla',
  image: '/gauge.png',
  schema: WidgetPackageGaugeSchema
})

// 
// Template.WidgetPackageGauge.events({
//   'change select': function(e) {
//     console.log(e, this)
//   }
// })
// Template.WidgetPackageGaugeDeviceAttr.onRendered(function() {
//   $(this.find('.device')).select2()
//   $(this.find('.attr')).select2()
// })
// Template.WidgetPackageGauge.onCreated(function() {
AutoForm.addHooks('WidgetPackageGauge', {
  onSubmit: function(insertDoc, updateDoc, currentDoc) {
    this.event.preventDefault()

    debugger
    Meteor.call('widgets.add', {
      'name': 'WidgetGauge',
      'dashboard': FlowRouter.current().params.id,
      data: {
        'title': insertDoc.title,
        'subtitle': insertDoc.subtitle,
        'yAxis': insertDoc.yAxis,
        'series': insertDoc.series
      }
    }, (err, result) => {
      if (err) return this.done(err); // failed to submit, call onError with the provided error
      this.done(null, result); // submitted successfully, call onSuccess with `result` arg set to "foo"

    })
    // You must call this.done()!
    //this.done(); // submitted successfully, call onSuccess
  }
}, true);

// });