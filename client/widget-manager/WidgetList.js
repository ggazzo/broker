Template.WidgetList.helpers({
  template() {
    const instance = Template.instance();
    return instance.state.get('selectedWidget').template
  },
  selectedGroup() {
    const instance = Template.instance();
    return instance.state.get('selectedGroup')
  },
  selectedWidget() {
    const instance = Template.instance();
    return instance.state.get('selectedWidget')
  },
  widgetGroupArgs(group) {
    const instance = Template.instance();
    return {
      group,
      select(group) {
        instance.state.set('selectedGroup', group);
      }
    };
  },
  widgetItemArgs(group) {
    const instance = Template.instance();
    return {
      group,
      select(group) {
        instance.state.set('selectedWidget', group);
      }
    };
  },
  widgetArgs(widget) {
    const instance = Template.instance();
    return {
      widget,
      select(group) {
        instance.state.set('selectedWidget', group);
      }
    };
  }
});
Template.WidgetList.onCreated(function() {
  this.state = new ReactiveDict();
});