Meteor.methods({
  'widgets.add' (widget) {
    return Widget.insert(widget)
  }
});