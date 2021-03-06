import SimpleSchema from 'simpl-schema'
import RandToken from 'rand-token'
/* globals Meteor */
SimpleSchema.extendOptions(['autoform'])
Thing = new Meteor.Collection('Thing')
let ThingSchema = new SimpleSchema({
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
  // variable: {
  //   type: Array
  // },
  'variable.$': {
    type: Object
  },
  'variable.$.name': {
    type: String
  },
  // 'variable.$.max': {
  //   type: Number
  // },
  // 'variable.$.min': {
  //   type: Number
  // },
  'variable.$.createAt': {
    type: Date,
    label: 'Create At',
    autoValue: () => new Date(),
    autoform: {
      afFieldInput: {
        type: 'hidden'
      }
    },
  },
  'variable.$.lastUpdate': {
    type: Date,
    label: 'Create At',
    autoValue: () => new Date(),
    autoform: {
      afFieldInput: {
        type: 'hidden'
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
  token: {
    type: String,
    label: 'token acess',
    autoValue: function(args) {
			return this.isInsert ? RandToken.generate(16): this.value
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
  },
  lastUpdate: {
    type: Date,
    label: 'Last Update',
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
