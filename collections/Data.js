/* globals Meteor*/
import SimpleSchema from 'simpl-schema'
import Thing from './Thing'
import {Mongo} from 'meteor/mongo'
// let Data = new Meteor.Collection('Data')

class data extends Mongo.Collection {
  constructor(...args){
    super(...args)
    this._hooks = []
  }
  insert(params, callback) {
    const p  = this._hooks['before'].reduce((result, hook) => hook(result), params)
    return super.insert(p, (err, result) => {
      // console.log(result);
      this._hooks['after'].forEach(hook => hook(p))
      callback && callback(err, result)
    })
  }
  addHook(step, hook){
    this._hooks[step] = (this._hooks[step]||[]).concat(hook)
  }
}

let Data = new data('Data')
/* check variable, create if doesnt exist.*/
Data.addHook('before', (params) => {
  const thing = Thing.findOne({
    '_id' : params.owner,
    'variable.name':params.name
  },{fields:{_id: 0,'variable.$':1}})
  const [variable] = (thing && thing.variable) || []

  if(! variable) {
    Thing.update({_id: params.owner}, {$push:{variable: {name: params.name}}}, {bypassCollection2: true})
  } else if (variable.fn) {
    const vm = require('vm')
    const code = `
    (function(x){
      return ${variable.fn}
    })
    `
    try {
      params.value = vm.runInNewContext(code)(params.value)
    } catch(e){
      console.error(e)
    }
  }
  return params
})

/* update lastUpdate Thing*/
Data.addHook('after', ({owner, name}) => {
  return Thing.update({
    '_id' : owner,
    'variable.name': name
  }, {$set:{lastUpdate: new Date(),'variable.0.lastUpdate': new Date()}}, {bypassCollection2: true})
})







let DataSchema = new SimpleSchema({
  value: {
    type: Number,
    label: 'value'
  },
  text: {
    type: String,
    label: 'value',
  },
  name: {
    type: String,
    label: 'name'
  },
  owner: {
    type: String,
    label: 'Owner',
    // optional: true
  },
  createAt: {
    type: Date,
    label: 'Create At',
    autoValue: () => new Date()
  }
})
Data.attachSchema(DataSchema)
export default Data
