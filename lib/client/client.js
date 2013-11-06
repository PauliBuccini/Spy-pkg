Client = function(userIP){
	// var clientID = Math.random().toString().substr(3, 10);
  var clientID = 0;
   var retrievedObject = localStorage.getItem('clientStorage');
   if (retrievedObject) {
      clientID = JSON.parse(retrievedObject);
   } else {
      clientStorage = Random.id();
      localStorage.setItem('clientStorage', JSON.stringify(clientStorage));
      clientID = clientStorage;
   }
 Session.set('ClientId', clientID);

    Meteor.call('updateClient', clientID, userIP, Meteor.userId());

    var keepAlive = self.setInterval(function(){
		Meteor.call('updateClient', clientID, userIP, Meteor.userId());
	}, 30000);
}



if (Meteor.isClient) {

  // ClientsSummary = new Meteor.SmartCollection("clientssummary")
  // Meteor.subscribe("clientssummary");


  // Handlebars.registerHelper("isUserOnline", function (userId) {
  //     return Clients.findOne({'userID' : userId}) ? true : false;
  //   });

  Meteor.startup(function () {
  	THISCLIENT = new Client(-1);
  });
}


