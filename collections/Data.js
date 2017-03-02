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
export default Data
