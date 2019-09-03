import { Template } from 'meteor/templating'
import Thing from '../../collections/Thing'
import { FlowRouter } from 'meteor/kadira:flow-router'
Template.Thing.helpers({
  thing() {
    return Thing.findOne(FlowRouter.current().params.id)
  }
})


Template.Thing.events({
	'click .js-delete'(e, i) {
			const {name} = this;
			const _id = FlowRouter.current().params.id
			Meteor.call('device.remove.variable', { name, _id });
	}
})
