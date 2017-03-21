import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import Dashboard from '../../collections/Dashboard'
import Widget from '../../collections/Widget'
import Widgets from '../widget-manager/widgets'
Template.Dashboard.helpers({
  dashboard() {
    return Dashboard.findOne(FlowRouter.current().params.id)
  },
  widgets() {
    return Widget.find({dashboard:FlowRouter.current().params.id})
  },
  groups() {
    let group = Widgets.getGroups()
    return Object.keys(group).map((g) => group[g])
  }
})
Template.Dashboard.onRendered(function functionName() {

})


Template.Dashboard.onCreated(function bodyOnCreated() {
  Meteor.subscribe('Data')
  Meteor.subscribe('Variables')
  Meteor.subscribe('Widget', FlowRouter.current().params.id)
})
