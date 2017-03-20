import { Random } from 'meteor/random'
import {
  Meteor
} from 'meteor/meteor'
import Thing from '../collections/Thing'
ConsoleMe.enabled = true
Meteor.startup(() => {
  Data.mqttConnect("mqtt://test.mosquitto.org", (doc) => `${doc.owner}/${doc.name}`, 'value', {});
});

// This code only runs on the server
Meteor.publish('Things', function tasksPublication() {
  return Thing.find({
    owner: this.userId
  });
});

Meteor.publish('Widget', function(id) {
  let dashboard = Dashboard.findOne({
    owner: this.userId,
    _id: id,
  });
  return dashboard ? Widget.find({
    dashboard: dashboard._id
  }) : this.ready();
});

Meteor.publish('Data', function() {
  let things = Thing.find({
    owner: this.userId
  }).map(function(t) {
    return t._id
  });

  return Data.find({
    owner: {
      $in: things
    }
  }, {
    sort: {
      createAt: -1
    }
  })
});

Meteor.publish('Variables', function(id) {

  // 
  let things = Thing.find({
    owner: this.userId
  }).map(function(t) {
    return t._id
  });

  // let variables = Data.find({
  //   owner: {
  //     $in: things
  //   }
  // }, {
  //   sort: {
  //     createAt: 1
  //   }
  // }).distinct('name')
  // 
  let variables = Data.distinct('name')
  let self = this
  variables.forEach((v) => {
    self.added('Variables', Random.id(), {
      name: v
    });
  })
  // 
  // return Variables.find(id ? {
  //   owner: [...id]
  // } : {});
});


Meteor.publish('Dashboards', function() {
  return Dashboard.find({
    owner: this.userId
  });
});

Meteor.publish('Dashboard', function(id) {
  return Dashboard.find({
    owner: this.userId,
    _id: id,
  }, {
    limit: 1
  });
});

// Meteor.publish('previousInviteContacts', function() {
//   self = this;
//   contacts = Events.aggregate([{
//     $match: {
//       creatorId: this.userId
//     }
//   }, {
//     $project: {
//       invites: 1
//     }
//   }, {
//     $unwind: "$invites"
//   }, {
//     $group: {
//       _id: {
//         email: "$invites.email"
//       }
//     }
//   }, {
//     $project: {
//       email: "$_id.email"
//     }
//   }])
//   _(contacts).each(function(contact) {
//     if (contact.email) {
//       if (!Contacts.findOne({
//           userId: self.userId,
//           email: contact.email
//         })) {
//         self.added('contacts', Random.id(), {
//           email: contact.email,
//           userId: self.userId,
//           name: ''
//         });
//       }
//     }
//   });
// });