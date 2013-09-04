Clients = new Meteor.Collection('Clients');

if (Meteor.isServer) {
  Meteor.startup(function () {
  	
  		Clients.remove({});
  		
  		Meteor.setInterval(function(){
  			    Clients.update({}, {$inc: {life: -10}}, {multi:true});
		 		Clients.remove({life: {$lt: 0}});
  		}, 100);
  		
  		
  
    	Meteor.methods({
    		updateClient: function(clientID, clientIP){
    			var count = Clients.find({clientID: clientID}).count();
    			if(count != 0)
    				Clients.update({clientID: clientID}, {$set: {life: 100}});
    			else
    				Clients.insert({clientID: clientID, IP: clientIP, life: 100});
    		},
    		
    		getClients: function(){
    			return Clients.find().fetch();
    		}
    		
    		countClients: function(){
    			return Clients.find().fetch().length;
    		}
		});
  });
}
