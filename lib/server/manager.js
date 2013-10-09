

if (Meteor.isServer) {
  Meteor.startup(function () {
  Clients = new Meteor.Collection('clients');
  ClientsAll = new Meteor.Collection('clientsall');
  ClientsLog = new Meteor.Collection('clientslog');
  ClientsSummary = new Meteor.Collection('clientssummary');

      // Clients.remove({});
      // ClientsAll.remove({});
      // ClientsLog.remove({});
      // ClientsSummary.remove({});
    if (ClientsSummary.find().count() === 0) {

      ClientsSummary.insert({_id: '1', total : 0});
    }
  		Meteor.setInterval(function(){
                        var currentUsers = Clients.find({}).count();
                         var totalUsers = ClientsSummary.findOne({_id: '1'});
                         if (totalUsers.total < currentUsers)
                            ClientsSummary.update({_id : '1'}, {$set : {total : currentUsers}});

                      Clients.update({}, {$inc: {life: -10}}, {multi:true});
                       Clients.remove({life: {$lt: 0}});

  		}, 5000);

             Meteor.setInterval(function(){
                    var activeUsers = Clients.find({}).count();
                    var currentTime = (new Date()).getTime();
                    ClientsLog.insert({logtime : currentTime, clients : activeUsers});

             }, 1800000);
             // }, 60000);

    	Meteor.methods({
    		updateClient: function(clientID, clientIP){
    			var count = Clients.find({clientID: clientID}).count();
    			if(count != 0)
    				Clients.update({clientID: clientID}, {$set: {life: 70}});
    			else
    				Clients.insert({clientID: clientID, IP: clientIP, life: 70});
                    if (!ClientsAll.findOne({clientID: clientID}))
                      ClientsAll.insert({clientID: clientID});
    		},
    		getClients: function(){
    			return Clients.find().fetch();
    		},
    		countClients: function(){
    			return Clients.find().fetch().length;
    		}
		});
  });
  }
