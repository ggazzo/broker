Package.describe({
  name: 'gazzo:widgets-manager',
  version: '0.0.1',
  summary: 'Widgets manager',
  git: ''
})
Npm.depends({
  'simpl-schema': '0.2.2' // Where x.x.x is the version, e.g. 0.3.2
});
Package.onUse(function(api) {
  api.use([
    'ecmascript',
    'meteor-base',
    'aldeed:autoform@6.0.0',
    'aldeed:collection2-core@2.0.0',
    'blaze-html-templates',
    'reactive-dict'
  ])

  api.addFiles('./client/widgets.js', 'client')
  api.addFiles('./client/WidgetGroup.html', 'client')
  api.addFiles('./client/widget-package.css', 'client')
  api.addFiles('./client/WidgetGroup.js', 'client')
  api.addFiles('./client/WidgetList.html', 'client')
  api.addFiles('./client/WidgetList.js', 'client')
  api.addFiles('./client/widgets.js', 'client')
  api.addFiles('./client/widgets/widget-chart-line/WidgetCharLine.js', 'client')
  api.addFiles('./client/widgets/widget-chart-line/WidgetCharLine.html', 'client')

  api.addAssets('./img/chart.png', 'client')
  api.addAssets('./img/metric.png', 'client')
  api.addAssets('./img/table.png', 'client')
  api.export('Widgets');
})