import SimpleSchema from 'simpl-schema'
const pluginName = "List"
Widgets.add({
  name: pluginName,
  template: 'WidgetPackageChartLine',
  group: 'chart',
  description: 'bla bla',
  image: '/packages/gazzo_widgets-manager/img/chart.png',
  schema: new SimpleSchema({
    variables: {
      type: Array,
      minCount: 1
    },
    'variables.$': Object,
    'variables.$.device': String,
    'variables.$.name': String
  })
})
// debugger
Template.WidgetPackageChartLine.helpers({  
  things() {
    return Meteor.Thing.find({});
  }
});

// Template.WidgetPackageChartLine.onCreated(function bodyOnCreated() {
//   Meteor.subscribe('Things');
// });