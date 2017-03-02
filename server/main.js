import {
  Meteor
} from 'meteor/meteor'
import Thing from '../collections/Thing'
ConsoleMe.enabled = true
Meteor.startup(() => {
  Data.mqttConnect("mqtt://test.mosquitto.org", (doc)=> `${doc.owner}/${doc.name}` , 'value', {});
});

// This code only runs on the server
Meteor.publish('Things', function tasksPublication() {
  return Thing.find({
    owner: this.userId
  });
});

Meteor.publish('Widget', function (id) {
  return Widget.find({
    dashboard: id
  });
});

Meteor.publish('Data', function () {
  return Data.find({},{sort: { createAt : -1 }
  })
});
Meteor.publish('Variables', function (id) {
  return Variables.find(id  ? {
    owner: [...id]
  } : {});
});


Meteor.publish('Dashboards', function tasksPublication() {
  return Dashboard.find({
    owner: this.userId
  });
});

Meteor.publish('Dashboard', function(id) {
  return Dashboard.find({
    owner: this.userId
  }, {limit: 1});
});