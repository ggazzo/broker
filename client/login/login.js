 Template.login.events({

   'submit #login-form': function(e, t) {
     e.preventDefault();
     // retrieve the input field values
     var email = t.find('[name=user]').value,
       password = t.find('[name=pass]').value;

     // Trim and validate your fields here.... 

     // If validation passes, supply the appropriate fields to the
     // Meteor.loginWithPassword() function.
     Meteor.loginWithPassword(email, password, function(err) {
       console.log(err);
       // The user has been logged in.
     });
     return false;
   }
 });