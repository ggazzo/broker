import { FlowRouter } from 'meteor/kadira:flow-router'
import { AutoForm } from 'aldeed/autoForm'
AutoForm.hooks({
  Dashboard: {
    onSuccess: function(formType, result) {
      FlowRouter.go(`/dashboards/${result}`)
    },

      // Called when any submit operation fails
    onError: function() {

    }
  }
})
