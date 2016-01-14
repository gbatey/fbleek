Router.route('/register')
Router.route('/login');
Router.route('/', function() {
  if (Meteor.userId()) {
    this.render("home");
  } else {
    Router.go("login")
  }
}, {
  name: "home"
});
Router.route('/user');
Router.route('/post/:_id', {
  name: 'post',
  data: function() {
    var currentPost = this.params._id;
    return Posts.findOne({
      _id: currentPost
    })
  }
});
Router.route('/search');
Router.route('/newPost');
Router.configure({
  layoutTemplate: 'main'
});


Posts = new Meteor.Collection('posts')
Comments = new Meteor.Collection('comments')

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
      Images.insert(newFile, function(e, fileObj) {
        if (e) {
          toastr.error(e.reason)
        } else {
          // file was saved to Amazon S3
          var title = $('[name=title]').val();      
          Posts.insert({          
            title: title,
            photo: fileObj._id,
            createdAt: new Date(),
            username: Meteor.user().username     
          }, function(e, result) {
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
    posts: function() {
      return Posts.find({}, {
        sort: {
          createdAt: -1
        }
      });
    }
  });
  Template.picture.helpers({
    findImage: function(id) {
      return Images.findOne({
        _id: id
      })
    },
  numberComments: function(){
    var currentPostId = this._id;
    return Comments.find({postId: currentPostId}).count();
  }
  })
  Template.picture.events({
    'click .selectPost': function(event, template) {
      console.log(this._id);
      var currentPost = this._id; // needed to assign this._id to a var before passing into Router.go
      console.log(this);
      Router.go('post', {
          _id: currentPost
        }) // now working!
    }
  })
  Template.post.helpers({
    image: function(id) {
      return Images.findOne({
        _id: id
      })
    },
    comments: function() {
      var currentPostId = this._id
      return Comments.find({
        postId: currentPostId
      }, {
        sort: {
          createdAt: 1
        }
      })
    }
  })

  function scrollToBottom() {
    console.log("scrolltop is " + $('body').scrollTop());
    $('body').scrollTop($('body').prop("scrollHeight"));
  }
  Template.post.rendered = function() {
    scrollToBottom();
  };
  Template.post.events({
    "submit .comment-form": function(event) {
      event.preventDefault();
      var text = event.target.text.value;
      var currentPostId = this._id;
      Comments.insert({
        text: text,
        createdAt: new Date(),
        username: Meteor.user().username,
        postId: currentPostId
      });
      event.target.text.value = "";
      scrollToBottom();
    }
  })
}
