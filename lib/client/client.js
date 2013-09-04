Client = function(userIP){
	var clientID = Math.random().toString().substr(3, 10);
	var ip = userIP;
	
	var keepAlive = self.setInterval(function(){
		Meteor.call('updateClient', clientID, ip);
		Meteor.call('countClients', function(e,r){
			Session.set('numberOfClients', r);
		});
	}, 150);
}


  
if (Meteor.isClient) {
  Meteor.startup(function () {
  	THISCLIENT = new Client(-1);
  });
}