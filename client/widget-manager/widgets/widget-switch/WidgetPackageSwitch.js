import Widgets from '../../widgets'
const pluginName = 'Switch'
import SimpleSchema from 'simpl-schema'


const fields = ['title', 'device', 'attribute'];

const toEvent = event => ({
	[`change #${event}`]: (e, i) => {
		i.state.set(event, e.target.value);
	}
})

const autoBind = (events, fn = toEvent) => Object.assign(...events.flatMap(fn));
const validate = doc => Object.values(doc).every(e => e);

Template.WidgetPackageSwitch.helpers({
	selectedDevice() {
		return Template.instance().state.get('device');
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
});

Template.WidgetPackageSwitch.events({
	'click .js-add'(e, i) {
		i.state.set('band', [...i.state.get('band'), newBand()]);
	},
	'submit form'(e, i) {
		e.preventDefault();
		const { band, ...doc } = i.state.all();

		if (!validate(doc)) {
			return;
		}


		const { title, device, attribute } = doc;

		Meteor.call('widgets.add', {
			'name': 'WidgetSwitch',
			'dashboard': FlowRouter.current().params.id,
			data: {
				title,
				device,
				attribute
			}
		})
	},
	...autoBind(fields),
});

Template.WidgetPackageSwitch.onCreated(function () {
	this.state = new ReactiveDict();

	this.autorun(() => {
		const device = this.state.get('device');
		if (!device) {
			return this.state.set('variables', []);
		}
		this.state.set('variables', Thing.findOne(device).variable);
	})
});







const WidgetPackageSwitchSchema = new SimpleSchema({
  'title': {
    type: String
  },
  'device': {
    type: String,
  },
  'attribute': {
    type: String,
  },
})

Widgets.add({
  name: pluginName,
  template: 'WidgetPackageSwitch',
  group: 'chart',
  description: 'bla bla',
  image: '/chart.png',
  schema: WidgetPackageSwitchSchema
})
