FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('HomeLayout')
  }
})

FlowRouter.route('/dashboards', {
  name: 'dashboards',
  action() {
    BlazeLayout.render('HomeLayout', {
      main: 'Dashboards'
    })
  }
})

FlowRouter.route('/dashboards/new', {
  name: 'newDashboard',
  action(params, queryParams) {
    BlazeLayout.render('HomeLayout', {
      main: 'NewDashboard'
    })
  }
})

FlowRouter.route('/dashboards/:id/new', {
  name: 'dashboard',
  subscriptions(params, queryParams) {
    return this.register('dashboard', Meteor.subscribe('Dashboard', params.id));
  },
  action(params, queryParams) {
    BlazeLayout.render('HomeLayout', {
      main: 'WidgetList'
    })
  }
})

FlowRouter.route('/dashboards/:id', {
  name: 'dashboard',
  subscriptions(params, queryParams) {
    return this.register('dashboard', Meteor.subscribe('Dashboard', params.id));
  },
  action(params, queryParams) {
    BlazeLayout.render('HomeLayout', {
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
  subscriptions(params, queryParams) {
    return this.register('things', Meteor.subscribe('Things'));
  },
  action() {
    BlazeLayout.render('HomeLayout', {
      main: 'Things'
    })
  }
})

FlowRouter.route('/devices/new', {
  name: 'devices',
  action() {
    BlazeLayout.render('HomeLayout', {
      main: 'NewThing'
    })
  }
})

FlowRouter.route('/device/:id', {
  name: 'device',
  subscriptions(params, queryParams) {
    return this.register('device', Meteor.subscribe('Device', params.id));
  },
  action(params, queryParams) {
    BlazeLayout.render('HomeLayout', {
      main: 'Thing'
    })
  }
})
