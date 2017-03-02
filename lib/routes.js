FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('HomeLayout')
  }
})

FlowRouter.route('/dashboards', {
  name: 'dashboards',
  action() {
    BlazeLayout.render('MainLayout', {
      main: 'Dashboards'
    })
  }
})

FlowRouter.route('/dashboards/:id', {
  name: 'dashboard',
  subscriptions(params, queryParams) {
    return this.register('dashboard', Meteor.subscribe('Dashboard', params.id));
  },
  action(params, queryParams) {
    BlazeLayout.render('MainLayout', {
      main: 'Dashboard'
    })
  }
})

FlowRouter.route('/events', {
  name: 'events',
  action() {
    BlazeLayout.render('HomeLayout')
  }
})
FlowRouter.route('/devices', {
  name: 'devices',
  action() {
    BlazeLayout.render('MainLayout', {
      main: 'Thing'
    })
  }
})