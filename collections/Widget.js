import SimpleSchema from 'simpl-schema'
Widget = new Meteor.Collection('Widget')
SimpleSchema.extendOptions(['autoform'])
WidgetSchema = new SimpleSchema({
  dashboard: {
    type: String,
    label: "dashboard"
  },
  name: {
    type: String,
    label: "name"
  },
  data: {
    type: Object,
    label: "data",
    blackbox: true

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

Widget.attachSchema(WidgetSchema)
export default Widget