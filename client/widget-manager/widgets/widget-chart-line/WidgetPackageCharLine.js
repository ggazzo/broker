import Widgets from '../../widgets'
import SimpleSchema from 'simpl-schema'
SimpleSchema.extendOptions(['autoform'])


const validate = doc => Object.values(doc).every(e => e);

Template.WidgetPackageChartLine.helpers({
	selectedDevice() {
		return Template.instance().state.get('device');
	},
	variables() {
		return Template.instance().state.get('variables');
	},
	devices() {
		return Thing.find().map(function (p) {
			return {
				label: p.name,
				value: p._id
			}
		})
	},
	disabled() {
		const doc = Template.instance().state.all();

		return validate(doc) ? '' : 'disabled';
	}
});

const toEvent = event => ({[`change #${event}`]: (e, i) => {
	i.state.set(event, e.target.value);
}})

const autoBind = events => Object.assign(...events.flatMap(toEvent));

const fields = ['title', 'color', 'yAxis', 'device', 'attribute'];

Template.WidgetPackageChartLine.events({
	'submit form'(e, i) {
		e.preventDefault();
		const doc = i.state.all();

		if (!validate(doc)) {
			return;
		}


		const { device, color, attribute } = doc;

		Meteor.call('widgets.add', {
			'name': 'WidgetChartLine',
			'dashboard': FlowRouter.current().params.id,
			data: {
				'title': doc.title,
				'subtitle': doc.subtitle,
				'yAxis': doc.yAxis,
				'series': [{
					device,
					color,
					attribute
				}]
			}
		})
	},
	...autoBind(fields),
});

Template.WidgetPackageChartLine.onCreated(function () {
	this.state = new ReactiveDict({
		...Object.fromEntries(fields.map(e =>[e]))
	});

	this.autorun(() => {
		const device = this.state.get('device');
		if(!device) {
			return this.state.set('variables', []);
		}
		this.state.set('variables', Thing.findOne(device).variable);
	})
});



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
  },
  'series.$.color': {
    type: String,
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

// });
