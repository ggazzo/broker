
Template.WidgetGroup.events({
  'click .widget-package__container'() {
    this.select(this.group)
  }
})


Template.WidgetGroup.helpers({

	selected() {
		return this.selected && this.group.name === this.selected.name && 'selected';
	},
  dashboard() {
    // return 'oi'
    return Dashboard.findOne(FlowRouter.current().params.id)
  },
  list() {
    let group = Widgets.get(this.group.name)
    return group.list
  }
})
