if (Meteor.isServer) {
  var imageStore = new FS.Store.S3("images", {
    "accessKeyId" : "AKIAIAS32MUYA7BEUW2Q",
    "secretAccessKey" : "lBtB73n6cRE7wNKwPAtEr76Y16Yn75T7cSKTONBP",
    "bucket" : "fbleek"
  });

  Images = new FS.Collection("Images", {
    stores: [imageStore],
    filter: {
      allow: {
        contentTypes: ['image/*']
      }
    }
  });
}

// On the client just create a generic FS Store as don't have
// access (or want access) to S3 settings on client
if (Meteor.isClient) {
  var imageStore = new FS.Store.S3("images");
  Images = new FS.Collection("Images", {
    stores: [imageStore],
    filter: {
      allow: {
        contentTypes: ['image/*']
      },
      onInvalid: function(message) {
        toastr.error(message);
      }
    }
  });
}

// Allow rules
Images.allow({
  insert: function() { return true; },
  update: function() { return true; },
  download: function() { return true; },
  remove: function() { return true; }
});
