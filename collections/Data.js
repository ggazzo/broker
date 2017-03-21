/* globals Meteor*/
import SimpleSchema from 'simpl-schema'
import Thing from './Thing'
let Data = new Meteor.Collection('Data')
let DataSchema = new SimpleSchema({
  value: {
    type: String,
    label: 'value'
  },
  name: {
    type: String,
    label: 'name'
  },
  owner: {
    type: String,
    label: 'Owner'
  },
  createAt: {
    type: Date,
    label: 'Create At',
    autoValue: () => new Date()
  }
})
Data.attachSchema(DataSchema)
// let old = Data.insert
// 
// Data.insert = function (doc) {
//   console.log('doc', doc);
//   old.apply(this, [doc])
//   Thing.update(doc.owner, {
//     $set: {
//       lastUpdate: new Date()
//     }
//   });
// }
if (Meteor.isServer) {
  Data.after.insert(function(userId, doc) {
    return Thing.update(doc.owner, {
      $set: {
        lastUpdate: new Date()
      }
    })
  })
}

export default Data