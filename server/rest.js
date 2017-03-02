 REST = new Restivus({
   // apiPath: 'my-api/',
  //  auth: {
  //    token: 'auth.apiKey',
  //    user: function() {
  //      return {
  //        userId: this.request.headers['user-id'],
  //        token: this.request.headers['login-token']
  //      };
  //    }
  //  },
   defaultHeaders: {
     'Content-Type': 'application/json'
   },
   onLoggedIn: function() {
     Meteor.setUserId(this.userId)
     console.log(this.user.username + ' (' + this.userId + ') logged in');
   },
   onLoggedOut: function() {
     console.log(this.user.username + ' (' + this.userId + ') logged out');
   },
   prettyJson: true,
   useDefaultAuth: true,
   // version: 'v1'
 });
 REST.addRoute('data', {
   post: function() {
     try {
       let {
         token, value, name
       } = this.bodyParams

       let thing = Thing.findOne({
         token: token
       })

       if (thing == undefined) {
         throw new Meteor.Error('invalid_token', 'exception in route data');
       }
     
       return {
         status: 'success',
         message: 'Data inserted',
         data: Data.insert({
           name,
           value,
           owner: thing._id
         })
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
 });

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
 });