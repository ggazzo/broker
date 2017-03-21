import { Session } from 'meteor/session'
import moment from 'moment'

///
Template.Things.helpers({  
  things() {
    return Thing.find({});
  }
});

Template.Things.onCreated(function bodyOnCreated() {
  Meteor.subscribe('Things');
});

Template.registerHelper('timeAgo', function (context) {
    Session.get("time");
    if (context) {
        return moment(context).fromNow();
    }
});

Meteor.setInterval(function() {
    Session.set("time", new Date().getTime());
}, 5000);
