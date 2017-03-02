import SimpleSchema from 'simpl-schema'
Widget = new Meteor.Collection('Widget')
SimpleSchema.extendOptions(['autoform'])
WidgetSchema = new SimpleSchema({
  dashboard: {
    type: String,
    label: "dashboard"
  },
  data: {
    type: Object
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