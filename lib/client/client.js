Client = function(userIP){
  if (Meteor.userId()) {
    Meteor.call('updateClient', Meteor.userId());
  }

    var keepAlive = self.setInterval(function(){
      if (Meteor.userId())
      Meteor.call('updateClient', Meteor.userId());
    }, 30000);
}



if (Meteor.isClient) {

  Meteor.startup(function () {
  	THISCLIENT = new Client(-1);
  });
}


