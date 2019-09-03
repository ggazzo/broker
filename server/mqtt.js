/* globals Package Npm */
import mosca from 'mosca'
import {Meteor} from 'meteor/meteor'

import Thing from '../collections/Thing'
import Data from '../collections/Data'
const mqtt = Npm.require('mqtt')
const Mongo = Package.mongo.Mongo


var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
}

var settings = {
  logger: {
    // level: 'debug'
  },
  port: 1883,
  backend: ascoltatore
}

var server = new mosca.Server(settings)
server.on('published',  Meteor.bindEnvironment(function ({topic, payload}, client= {}) {

  if(!client.thing){return}
  const [,name] = topic.split('/');
  let data = {
    name,
    text: payload.toString(),
    value: parseFloat(payload.toString()),
    owner: client.thing._id
  }
  //  return {
  //    status: 'success',
  //    message: 'Data inserted',
  Data.insert(data)
}))
server.on('ready', () => {

  console.log('Mosca server is up and running')
  server.authenticate = authenticate
  server.authorizePublish = authorizePublish
  server.authorizeSubscribe = authorizeSubscribe
})

// Accepts the connection if the username and password are valid
var authenticate = Meteor.bindEnvironment(function(client, _id, token, callback) {
	console.log(_id, token)
  // console.log(token.toString(), _id);
  const thing = Thing.findOne({token: token.toString(), _id})
  client.thing = thing
  // console.log(thing);
  callback(null, !!thing)
})

// In this case the client authorized as alice can publish to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
var authorizePublish = Meteor.bindEnvironment(function(client, topic, payload, callback) {
  callback(null, client.thing._id == topic.split('/')[0])
})

// In this case the client authorized as alice can subscribe to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
var authorizeSubscribe = Meteor.bindEnvironment(function(client, topic, callback) {
  callback(null, client.thing._id == topic.split('/')[0])
})

//
// Mongo.Collection.prototype.mqttConnect = function(uri, topic, message, mqttOptions) {
//   var self = this
//   this.mqttDisconnect()
//   this._mqttClient = mqtt.connect(uri, mqttOptions)
//   this.find().observeChanges({
//     added: function(id, doc) {
//       if (doc && doc[message] && self._mqttClient) {
//         self._mqttClient.publish(topic(doc), typeof doc[message] === 'object' ? JSON.stringify(doc[message]) : doc[message] + '')
//       }
//     }
//   })
// }
//
// Mongo.Collection.prototype.mqttDisconnect = function() {
//   if (this._mqttClient) this._mqttClient.end()
//   this._mqttClient = null
// }
export default server
