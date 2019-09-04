import './style.css'
import './WidgetRange.html'
import Data from '../../../../collections/Data'


const call = (...args) => new Promise((resolve, reject) => {

	Meteor.call(...args, (err, result) => {
		if (err) {
			return reject(err);
		}
		resolve(result)
	})

})

Template.WidgetRange.events({
	'change input': async function (e){

		const instance = Template.instance();

		const value = e.target.value;

		if (instance.state.get('loading')) {
			return;
		}

		const { device, attribute } = this.data;

		instance.state.set('loading', true);


		await call('data.add', { id: device, key: attribute, value });

		instance.state.set('loading', false);
	},
});


Template.WidgetRange.helpers({
	loading() {
		return Template.instance().state.get('loading');
	},
	title() {
		return Template.instance().state.get('title');
	},
	value() {
		return parseInt(Template.instance().state.get('value'));
	},
	min() {
		return parseInt(Template.instance().state.get('min'));
	},
	max() {
		return parseInt(Template.instance().state.get('max'));
	}
});

Template.WidgetRange.onCreated(function () {
	this.state = new ReactiveDict({});
	this.state.set('value', 0);
	this.state.set('title', this.data.data.title);
	this.state.set('max', this.data.data.max);
	this.state.set('min', this.data.data.min);
});

const parseData = data => data.v.map((value, index) => [new Date(data.c[index]).getTime(), parseFloat(value)]).sort(([dataA], [dataB]) => dataA - dataB)

Template.WidgetRange.onRendered(async function () {
	const widget = this.data.data

	const instance = Template.instance();

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
Template.WidgetRange.onDestroyed(function () {
	this.observe.stop();
});
