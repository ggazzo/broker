import SimpleSchema from 'simpl-schema'
Data = new Meteor.Collection('Data')
DataSchema = new SimpleSchema({
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
    label: "Owner"
  },
  createAt: {
    type: Date,
    label: "Create At",
    autoValue: () => new Date()
  }
})
Data.attachSchema(DataSchema)
let old = Data.insert

Data.insert = function (doc) {
  console.log("doc", doc);
  old.apply(this, [doc])
  Thing.update(doc.owner, {
    $set: {
      lastUpdate: new Date()
    }
  });
}
// Data.after.insert(function (userId, doc) {
//   console.log(doc.owner, this);
//   return doc
// });

export default Data