
import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactiveDict } from 'meteor/reactive-dict'

import Thing from '../../collections/Thing'

import './NewThing.html'


Template.NewThing.onCreated(function() {
	this.state = new ReactiveDict({
	});
});


Template.NewThing.helpers({
	loading() {
		return Template.instance().state.get('loading');
	}
});

Template.NewThing.events({
	'submit form'(e, i) {
		e.preventDefault();
		const [name, description] = [e.target.querySelector('#deviceName').value, e.target.querySelector('#deviceDescription').value];
		console.log(name, description);

		i.state.set('loading', true);
		Meteor.call('device.add', { name, description }, () => {
			i.state.set('loading', false);
		});
	}
})
