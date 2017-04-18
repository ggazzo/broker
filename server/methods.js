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

  'grid.save' (params) {
    // TODO: verify if the dashboard belogns to user
    if (Meteor.userId) {

      // Widget.findOne()
      params.forEach(({_id, ...args}) => {
        Widget.update({_id}, {$set:{grid:args}}, {bypassCollection2: true}, function () {
        })
      })
      return params
    }
  },
  'data.get.old' ({id, key}) {
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
  },
  'data.add' ({id, key, value}) {
    if (!Meteor.userId || !id || !key || value == undefined) {
      return []
    }

    const thing = Thing.findOne({
      owner: Meteor.userId,
      _id: id
    })
    if(!thing) {
      return []
    }
    let data = {
      name: key,
      text: value.toString(),
      value: parseFloat(value),
      owner: id
    }
    return Data.insert(data)
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

    return Data.aggregate([
      {$match:{name:key, owner:thing._id}},
      {
      $group:{
        _id:{
          year: { $year: '$createAt' },
          month: { $month: '$createAt' },
          day: { $dayOfMonth: '$createAt' },
          hour: { $hour: '$createAt' },
          "interval": {
                "$subtract": [
                    { "$minute": "$createAt" },
                    { "$mod": [{ "$minute": "$createAt"}, 5] }
                ]
            }
          // minutes: { $minute: '$createAt' },
          //            s: { $second: "$createAt" }
        },
        value:{$avg:'$value'},
        createAt: {$first : '$createAt'}
      }
    },{

      $group:{
        _id:'x',
        v:{$push:'$value'},
        c:{$push:'$createAt'},
      }

    }])[0]

  }
})
