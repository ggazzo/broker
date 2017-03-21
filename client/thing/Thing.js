import { Template } from 'meteor/templating'
import Thing from '../../collections/Thing'
import { FlowRouter } from 'meteor/kadira:flow-router'
Template.Thing.helpers({
  thing() {
    return Thing.findOne(FlowRouter.current().params.id)
  }
})
