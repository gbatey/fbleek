if (Meteor.isClient) {
  var options = {
    keepHistory: 1000 * 60 * 5, //5 min
    localSearch: true
  }
  var searchFields = ['title', 'username']
  PostsSearch = new SearchSource('posts', searchFields, options)
  Template.search.helpers({
    findPosts: function() {
      return PostsSearch.getData({
        transform: function(matchText, regExp) {
          return matchText.replace(regExp, "<b>$&</b>")
        },
        sort: {
          isoScore: -1
        }
      });
    },
    isLoading: function() {
      return PostsSearch.getStatus().loading;
    }
  });
  Template.search.events({
  "keyup #search": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    PostsSearch.search(text);
  }, 200)
});
}

if (Meteor.isServer) {
  SearchSource.defineSource('posts', function(searchText, options) {
    var options = {
      sort: {
        isoScore: -1
      },
      limit: 20
    };

    if (searchText) {
      var regExp = buildRegExp(searchText);
      var selector = {$or: [
      {title: regExp},
      {username: regExp}
    ]};

      return Posts.find(selector, options).fetch();
    } else {
      return Posts.find({}, options).fetch();
    }
  });

  function buildRegExp(searchText) {
    var parts = searchText.trim().split(/[ \-\:]+/);
    return new RegExp("(" + parts.join('|') + ")", "ig");
  }
}
