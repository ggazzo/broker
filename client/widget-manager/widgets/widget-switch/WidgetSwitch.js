import './style.css'
import './WidgetSwitch.html'
import Data from '../../../../collections/Data'


const call = (...args) => new Promise((resolve, reject) => {

	Meteor.call(...args, (err, result) => {
		if (err) {
			return reject(err);
		}
		resolve(result)
	})

})

Template.WidgetSwitch.events({
	'click .switch__container': async function (){
		const instance = Template.instance();

		if (instance.state.get('loading')) {
			return;
		}

		const { device, attribute } = this.data;

		instance.state.set('loading', true);

		const value = parseInt(instance.state.get('value'));

		await call('data.add', { id: device, key: attribute, value: !value ? 1 : 0 });

		instance.state.set('loading', false);
	},
});


Template.WidgetSwitch.helpers({
	loading() {
		return Template.instance().state.get('loading');
	},
	title() {
		return Template.instance().state.get('title');
	},
 	checked() {
		return !!parseInt(Template.instance().state.get('value'));
	}
});

Template.WidgetSwitch.onCreated(function () {
	this.state = new ReactiveDict({});
	this.state.set('value', 0);
	this.state.set('title', this.data.data.title);
});

const parseData = data => data.v.map((value, index) => [new Date(data.c[index]).getTime(), parseFloat(value)]).sort(([dataA], [dataB]) => dataA - dataB)

Template.WidgetSwitch.onRendered(async function () {
	const widget = this.data.data

	const instance = Template.instance()

	this.state.set('loading', true);

	this.subscribe('DataFromDashboard', {
		keys: widget.device,
		variables: widget.attribute
	})

	const cursor = Data.find({
		owner: widget.device,
		name: widget.attribute
	}, {
			sort: {
				"createAt": 1
			}
		});

	this.observe = cursor.observe({
		added: (data) => {
			this.state.set('value', data.value);
		}
	})

	this.state.set('loading', false);

});
Template.WidgetSwitch.onDestroyed(function () {
	this.observe.stop();
});
