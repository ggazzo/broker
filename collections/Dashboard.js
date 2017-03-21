import SimpleSchema from 'simpl-schema'
import { Meteor } from 'meteor/meteor'

const Dashboard = new Meteor.Collection('Dashboard')
SimpleSchema.extendOptions(['autoform'])
const DashboardSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name'
  },
  description: {
    type: String,
    label: 'Description',
    autoform: {
      afFieldInput: {
        type: 'textarea'
      }
    }
  },
  owner: {
    type: String,
    label: 'Owner',
    autoValue: function() {
      return this.userId
    },
    autoform: {
      afFieldInput: {
        type: 'hidden'
      }
    }
  },
  createAt: {
    type: Date,
    label: 'Create At',
    autoValue: () => new Date(),
    autoform: {
      afFieldInput: {
        type: 'hidden'
      }
    }
  }
})

Dashboard.attachSchema(DashboardSchema)
export default Dashboard
