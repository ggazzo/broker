import SimpleSchema from 'simpl-schema'
import RandToken from 'rand-token'
SimpleSchema.extendOptions(['autoform'])
Thing = new Meteor.Collection('Thing')
ThingSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name'
  },
  description: {
    type: String,
    label: 'Description',
    autoform: {
      afFieldInput: {
        type: "textarea"
      }
    }
  },
  owner: {
    type: String,
    label: "Owner",
    autoValue: function() {
      return this.userId
    },
    autoform: {
      afFieldInput: {
        type: 'hidden'
      }
    }
  },
  token: {
    type: String,
    label: "token acess",
    autoValue: function() {
      return RandToken.generate(16);
    },
    autoform: {
      afFieldInput: {
        type: 'hidden'
      }
    }
  },
  createAt: {
    type: Date,
    label: "Create At",
    autoValue: () => new Date(),
    autoform: {
      afFieldInput: {
        type: 'hidden'
      }
    }
  }
})

Thing.attachSchema(ThingSchema)

export default Thing