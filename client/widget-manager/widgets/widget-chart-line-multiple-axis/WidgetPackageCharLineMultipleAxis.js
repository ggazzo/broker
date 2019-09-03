





import Widgets from '../../widgets'
import SimpleSchema from 'simpl-schema'


const fields = ['title'];

const toEvent = event => ({[`change #${event}`]: (e, i) => {
	i.state.set(event, e.target.value);
}})

const toEventClass = event => ({[`change .js-${event}`]: function (e, i) {
	const devices = i.state.get('selectedDevices');
	devices[this.index][event] =  e.target.value;
	i.state.set('selectedDevices', devices)
}})

const autoBind = (events, fn = toEvent) => Object.assign(...events.flatMap(fn));
const validate = doc => Object.values(doc).every(e => e);
const newDevice = () => {
	return Object.fromEntries(['color', 'yAxis', 'device', 'attribute'].map(e => [e]))
}

Template.WidgetPackageChartLineMultipleAxis.helpers({
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
	variables(index) {
		return Thing.findOne(Template.instance().state.get('selectedDevices')[index].device).variable
	},
	selectedDevice(index) {
		return Template.instance().state.get('selectedDevices')[index].device;
	},
	selectedDevices() {
		return Template.instance().state.get('selectedDevices');
	}
});

Template.WidgetPackageChartLineMultipleAxis.events({
	'click .js-add'(e, i) {
		i.state.set('selectedDevices', [...i.state.get('selectedDevices'), newDevice()]);
	},
	'click .js-done'(e, i) {
		const devices = i.state.get('selectedDevices');
		const device = devices[this.index];
		if (!validate(device)){
			return;
		}
		device.done = true;
		devices.push(newDevice());
		i.state.set('selectedDevices', devices);
	},
	'submit form'(e, i) {
		e.preventDefault();
		const { selectedDevices, ...doc } = i.state.all();

		if (!validate(doc)) {
			return;
		}


		const { device, color, attribute } = doc;

		Meteor.call('widgets.add', {
			'name': 'WidgetChartLineMultipleAxis',
			'dashboard': FlowRouter.current().params.id,
			'data': {
				'title': doc.title,
				'subtitle': doc.subtitle,
				'yAxis': doc.yAxis,
				'series': selectedDevices.filter(e => Object.keys(e).length).map(({
					device,
					color,
					attribute,
					yAxis
				}) => ({
						device,
						color,
						attribute,
						yAxis
				}))
			}
		})
	},
	...autoBind(['color', 'yAxis', 'device', 'attribute'], toEventClass),
	...autoBind(fields),
});

Template.WidgetPackageChartLineMultipleAxis.onCreated(function () {
	this.state = new ReactiveDict();
	this.state.set('selectedDevices', [newDevice()]);
});















const pluginName = 'Multiple axis'
Widgets.add({
  name: pluginName,
  template: 'WidgetPackageChartLineMultipleAxis',
  group: 'chart',
  description: 'bla bla',
  image: '/chart.png',
  schema: new SimpleSchema({
    variables: {
      type: Array,
      minCount: 1
    },
    'variables.$': Object,
    'variables.$.device': String,
    'variables.$.name': String
  })
})
