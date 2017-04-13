import {
  Random
} from 'meteor/random'
import {
  Meteor
} from 'meteor/meteor'
import Thing from '../collections/Thing'
import Data from '../collections/Data'
import Dashboard from '../collections/Dashboard'
import Widget from '../collections/Widget'
// This code only runs on the server
Meteor.publish('Things', function tasksPublication() {
  return Thing.find({
    owner: this.userId
  })
})

Meteor.publish('Widget', function(id) {
  let dashboard = Dashboard.findOne({
    owner: this.userId,
    _id: id,
  })
  return dashboard ? Widget.find({
    dashboard: dashboard._id
  }) : this.ready()
})

Meteor.publish('DataFromDashboard', function({keys, variables}) {
  if (!Meteor.userId || !keys || !variables) {
    return []
  }

  let things = Thing.find({
    owner: Meteor.userId
  }).map(({_id}) => _id)
  if(!things){
    return
  }

  return Data.find({
    owner: {
      $in: things
    },
    name: {
      $in : variables
    },
    createAt:{
      "$gte": new Date()
    }
  }, {
    fields: {
      value: 1,
      createAt:1,
      owner: 1,
      name: 1
    },
    sort: {
      createAt: 1
    }
  })
})

Meteor.publish('Variables', function() {

  let variables = Data.distinct('name')
  let self = this
  variables.forEach((v) => {
    self.added('Variables', Random.id(), {
      name: v
    })
  })
  //
  // return Variables.find(id ? {
  //   owner: [...id]
  // } : {});
})


Meteor.publish('Dashboards', function() {
  return Dashboard.find({
    owner: this.userId
  })
})

Meteor.publish('Dashboard', function(id) {
  return Dashboard.find({
    owner: this.userId,
    _id: id,
  }, {
    limit: 1
  })
})

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
//     $unwind: '$invites'
//   }, {
//     $group: {
//       _id: {
//         email: '$invites.email'
//       }
//     }
//   }, {
//     $project: {
//       email: '$_id.email'
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
