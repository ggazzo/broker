import Widgets from '../../widgets'
import SimpleSchema from 'simpl-schema'
const pluginName = 'Multiple axis'
Widgets.add({
  name: pluginName,
  template: 'WidgetPackageChartLineMultipleAxis',
  group: 'chart',
  description: 'bla bla',
  image: '/chart.png',
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