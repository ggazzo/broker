import Widget from '../collections/Widget'
import Data from '../collections/Data'
import Thing from '../collections/Thing'
import { Meteor } from 'meteor/meteor'
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
  },
  'data.get' ({id, key}) {
    if (!Meteor.userId || !id || !key) {
      return []
    }

    const thing = Thing.findOne({
      owner: Meteor.userId,
      _id: id
    })

    if(!thing) {
      return []
    }

    return Data.find({
      owner: thing._id,
      name: key
    }, {
      fields: {
        value: 1,
        createAt: 1
      },
      sort: {
        createAt: 1
      }
    }).fetch()
  }
})
