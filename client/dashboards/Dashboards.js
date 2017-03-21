import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import Dashboard from '../../collections/Dashboard'

Template.Dashboards.helpers({  
  dashboards() {
    return Dashboard.find({})
  }
})

Template.Dashboards.onCreated(function bodyOnCreated() {
  Meteor.subscribe('Dashboards')
})
