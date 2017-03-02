
Template.Dashboards.helpers({  
  dashboards() {
    return Dashboard.find({});
  }
});

Template.Dashboards.onCreated(function bodyOnCreated() {
  Meteor.subscribe('Dashboards');
});