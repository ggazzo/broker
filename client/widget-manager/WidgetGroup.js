
Template.WidgetGroup.events({
  'click .widget-package__container'() {
    this.select(this.group)
  }
});


Template.WidgetGroup.helpers({  
  dashboard() {
    // return 'oi'
    return Dashboard.findOne(FlowRouter.current().params.id);
  },
  list() {
    let group = Widgets.get(this.group.name)
    return group.list
  }
});