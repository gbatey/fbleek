Router.route('/register')
Router.route('/login');
Router.route('/', function() {
  if (Meteor.userId()) {
    this.render("home");
  } else {
    Router.go("login")
  }
},{name: "home"});
Router.route('/user');
Router.route('/post');
Router.route('/search');
Router.route('/newPost');
Router.configure({
  layoutTemplate: 'main'
});


Posts = new Meteor.Collection('posts')


if (Meteor.isClient) {
  Template.newPost.helpers({
    'photo': function() {
      return Session.get('photo')
    }
  })
  Template.navigation.events({
    'click .capture': function() {
      MeteorCamera.getPicture({
        width: 480,
        height: 480,
        quality: 80
      }, function(error, data) {
        Session.set('photo', data);
        Router.go("newPost")
      });
    }
  });

  Template.newPost.events({    
    'submit form': function(event) {      
      event.preventDefault(); 
      var newFile = new FS.File(Session.get('photo'))
      Images.insert(newFile, function (e, fileObj){
        if (e) {
          toastr.error(e.reason)
        } else {
          // file was saved to Amazon S3
          var title = $('[name=title]').val();      
          Posts.insert({          
            title: title,
            photo: fileObj._id,
            createdAt: new Date()     
          }, function (e, result) {
            if (e) {
              toastr.error(e.reason);
            } else {
              Router.go("home")
            }
          });  
        }
      })
    }
  });
  Template.register.events({    
    'submit form': function(event) {        
      event.preventDefault();        
      var username = $('[name=username]').val();        
      var password = $('[name=password]').val();        
      Accounts.createUser({            
        username: username,
        password: password     
      }, function(e) {
        if (e) {
          toastr.error(e.reason);
        } else {
          Router.go('home');
        }
      })    
    }
  });
  Template.login.events({
    'submit form': function(event) {
      event.preventDefault();
      var username = $('[name=username]').val();
      var password = $('[name=password]').val();
      Meteor.loginWithPassword(username, password, function(e) {
        if (e) {
          toastr.error(e.reason);
        } else {
          Router.go('home');
        }
      });
    }
  });
  Template.user.events({
    'click .logout': function(event) {
      event.preventDefault();
      Meteor.logout();
      Router.go('login');
    }
  });
  Template.home.helpers({
    posts: function (){
      return Posts.find({}, {sort: {createdAt: -1}});
    },
    image: function (id){
      return Images.findOne({_id:id})
    }
  })
}
