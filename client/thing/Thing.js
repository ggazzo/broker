
Template.Thing.helpers({  
  things() {
    return Thing.find({});
  }
});

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('Things');
});