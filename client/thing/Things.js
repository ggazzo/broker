import { Session } from 'meteor/session'
import { Meteor } from 'meteor/meteor'
import moment from 'moment'
import { Template } from 'meteor/templating'
import Thing from '../../collections/Thing'

///
Template.Things.helpers({
  things() {
    return Thing.find({})
  }
})

Template.Things.onCreated(function bodyOnCreated() {
  Meteor.subscribe('Things')
})

Template.registerHelper('timeAgo', function (context) {
  Session.get('time')
  if (context) {
    return moment(context).fromNow()
  }
})

Meteor.setInterval(function() {
  Session.set('time', new Date().getTime())
}, 5000)
