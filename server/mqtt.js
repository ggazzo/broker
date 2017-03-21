/* globals Package Npm */
const mqtt = Npm.require('mqtt')
const Mongo = Package.mongo.Mongo

Mongo.Collection.prototype.mqttConnect = function(uri, topic, message, mqttOptions) {
  var self = this
  this.mqttDisconnect()
  this._mqttClient = mqtt.connect(uri, mqttOptions)
  this.find().observeChanges({
    added: function(id, doc) {
      if (doc && doc[message] && self._mqttClient) {
        self._mqttClient.publish(topic(doc), typeof doc[message] === 'object' ? JSON.stringify(doc[message]) : doc[message] + '')
      }
    }
  })
}

Mongo.Collection.prototype.mqttDisconnect = function() {
  if (this._mqttClient) this._mqttClient.end()
  this._mqttClient = null
}
