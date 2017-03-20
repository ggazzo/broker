import { Session } from 'meteor/session'
import moment from 'moment'

///
Template.Thing.helpers({  
  thing() {
    return Thing.findOne(FlowRouter.current().params.id);
  }
});


