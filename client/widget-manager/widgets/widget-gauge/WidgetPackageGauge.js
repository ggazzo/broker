


import Widgets from '../../widgets'
import SimpleSchema from 'simpl-schema'


const fields = ['title', 'yAxis', 'device', 'attribute', 'suffix', 'unit'];

const toEvent = event => ({
	[`change #${event}`]: (e, i) => {
		i.state.set(event, e.target.value);
	}
})

const toEventClass = event => ({
	[`change .js-${event}`]: function (e, i) {
		const devices = i.state.get('band');
		devices[this.index][event] = e.target.value;
		i.state.set('band', devices)
	}
})

const autoBind = (events, fn = toEvent) => Object.assign(...events.flatMap(fn));
const validate = doc => Object.values(doc).every(e => e);
const newBand = () => {
	return Object.fromEntries(['color', 'yAxis', 'device', 'attribute'].map(e => [e]))
}

Template.WidgetPackageGauge.helpers({
	selectedDevice() {
		return Template.instance().state.get('device');
	},
	injectIndex(data, index) {
		data.index = index;
	},
	devices() {
		return Thing.find().map(function (p) {
			return {
				label: p.name,
				value: p._id
			}
		})
	},
	log() {
		console.log(this);
	},
	name(id) {
		return Thing.findOne(id).name
	},
	done() {
		return this.done
	},
	variables() {
		return Template.instance().state.get('variables');
	},
	band(index) {
		return Template.instance().state.get('band')[index].device;
	},
	bands() {
		return Template.instance().state.get('band');
	}
});

Template.WidgetPackageGauge.events({
	'click .js-add'(e, i) {
		i.state.set('band', [...i.state.get('band'), newBand()]);
	},
	'click .js-done'(e, i) {
		const devices = i.state.get('band');
		const device = devices[this.index];
		if (!validate(device)) {
			return;
		}
		device.done = true;
		devices.push(newBand());
		i.state.set('band', devices);
	},
	'submit form'(e, i) {
		e.preventDefault();
		const { band, ...doc } = i.state.all();

		if (!validate(doc)) {
			return;
		}


		const { title, device, attribute } = doc;

		Meteor.call('widgets.add', {
			'name': 'WidgetGauge',
			'dashboard': FlowRouter.current().params.id,
			data: {
				title,
				bands: band,
				'series': [{
					device,
					attribute
				}]
			}
		})
	},
	...autoBind(['color', 'from', 'to'], toEventClass),
	...autoBind(fields),
});

Template.WidgetPackageGauge.onCreated(function () {
	this.state = new ReactiveDict();
	this.state.set('band', [newBand()]);

	this.autorun(() => {
		const device = this.state.get('device');
		if (!device) {
			return this.state.set('variables', []);
		}
		this.state.set('variables', Thing.findOne(device).variable);
	})

	this.autorun(() => {
		console.log(this.state.all())
	})
});












const pluginName = 'Gauge'
WidgetPackageGaugeSchema = new SimpleSchema({
  'title': {
    type: String
  },
  'yAxis': {
    label: 'Inner text',
    type: String
  },
  bands: {
    type: Array,
    optional: false
  },
  'bands.$': Object,
  'bands.$.from': {
    type: Number
  },
  'bands.$.to': {
    type: Number
  },
  'bands.$.color': {
    type: String,
    autoform: {
      type: 'color'
    }
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
  'series.$.suffix': {
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
      if (err) return this.done(err) // failed to submit, call onError with the provided error
      this.done(null, result) // submitted successfully, call onSuccess with `result` arg set to "foo"

    })
    // You must call this.done()!
    //this.done(); // submitted successfully, call onSuccess
  }
}, true)

// });
