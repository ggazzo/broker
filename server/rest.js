import Thing from '../collections/Thing'
// import Data from '../collections/Data'
const authRequired = true
/* globals Restivus, Meteor*/
let REST = new Restivus({
  // apiPath: 'my-api/',
  // auth: {
  //   token: 'services.resume.loginTokens.hashedToken',
  //   user() {
  //     return {
  //       userId: this.request.headers['x-user-id'],
  //       token: this.request.headers['x-auth-token']
  //     }
  //   }
  // },
  // defaultHeaders: {
  //   'Content-Type': 'application/json'
  // },
  // onLoggedIn: function() {
  //   Meteor.setUserId(this.userId)
  // },
  // onLoggedOut: function() {},
  prettyJson: true,
  useDefaultAuth: true,
  version: 'v1'
})
REST.addRoute('data/:id/:key', { authRequired }, {
  get() {
    let data
    Meteor.runAsUser(this.userId, () => {
      data =  Meteor.call('data.get', {
        id: this.urlParams.id, key: this.urlParams.key, createAt: this.queryParams.createAt
      })
    })
    return data
  }
})

REST.addRoute('thing', {
  authRequired: true
}, {
  post: function() {
    try {
      Thing.insert({
        name: 'teste',
        description: 'name',
      })
      return {
        status: 'success',
        data: {
          message: 'Data inserted'
        }
      }
    } catch (e) {
      return {
        statusCode: 404,
        body: {
          status: 'fail',
          message: e.message
        }
      }
    }
  }
})
