import Widget from '../collections/Widget'
Meteor.methods({
  'widgets.remove' (id) {
    // TODO: verify if the widget belogns to user
    if (Meteor.userId) {
      return Widget.remove(id)
    }
  },
  'widgets.add' (widget) {
    // TODO: verify if the dashboard belogns to user
    if (Meteor.userId) {
      return Widget.insert(widget)
    }
  }
});