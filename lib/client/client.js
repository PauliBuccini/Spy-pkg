Client = function(userIP){
	// var clientID = Math.random().toString().substr(3, 10);
  var clientID = 0;
   var retrievedObject = localStorage.getItem('clientStorage');
   if (retrievedObject) {
      clientID = JSON.parse(retrievedObject);
   } else {
      clientStorage = Random.create().id();
      localStorage.setItem('clientStorage', JSON.stringify(clientStorage));
      clientID = clientStorage;
   }

    var ip = userIP;
    Meteor.call('updateClient', clientID, ip);

    var keepAlive = self.setInterval(function(){
		Meteor.call('updateClient', clientID, ip);
		Meteor.call('countClients', function(e,r){
			Session.set('numberOfClients', r);
		});
	}, 30000);
}



if (Meteor.isClient) {
  Meteor.startup(function () {
  	THISCLIENT = new Client(-1);
  });
}


