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
    document.write('<head><script type="application/javascript">function getip(json){THISCLIENT = new Client(json.ip);}</script><script type="application/javascript" src="http://jsonip.appspot.com/?callback=getip"></script></head>');
  });
}