

if (Meteor.isServer) {
  Meteor.startup(function () {
  Clients = new Meteor.SmartCollection('clients');
  ClientsAll = new Meteor.SmartCollection('clientsall');
  ClientsLog = new Meteor.SmartCollection('clientslog');
  ClientsSummary = new Meteor.SmartCollection('clientssummary');

  Meteor.publish("clientssummary", function () {
       if (isAdminById(this.userId)) {
        return ClientsSummary.find({_id : '1'});
    }
  });


      // Clients.remove({});
      // ClientsAll.remove({});
      // ClientsLog.remove({});
      // ClientsSummary.remove({});
    if (ClientsSummary.find().count() === 0) {

      ClientsSummary.insert({_id: '1', total : 0, current: 0, logs : [{logtime : (new Date()).getTime(), clients : 0}]});
    }
      Meteor.setInterval(function(){
                         // var totalSummary = ClientsSummary.findOne({_id: '1'});
                         // var totalUsers = ClientsAll.findOne().fetch().length;
                         // if (totalUsers.total < currentUsers)
                         //    ClientsSummary.update({_id : '1'}, {$set : {total : currentUsers}});

                      Clients.update({}, {$inc: {life: -10}}, {multi:true});
                       Clients.remove({life: {$lt: 0}});
                        var currentUsers = Clients.find({}).count();
                      ClientsSummary.update({_id : '1'}, {$set : {current : currentUsers}});

      }, 5000);

             Meteor.setInterval(function(){
                    var activeUsers = Clients.find({}).count();
                    var currentTime = (new Date()).getTime();
                    ClientsLog.insert({logtime : currentTime, clients : activeUsers});
                    ClientsSummary.update({_id: '1'},{$push :{logs: {logtime : currentTime, clients : activeUsers}}});

             }, 1800000);
             // }, 10000);

    	Meteor.methods({
    		updateClient: function(clientID, clientIP){
    			var count = Clients.find({clientID: clientID}).count();
    			if(count != 0)
    				Clients.update({clientID: clientID}, {$set: {life: 70}});
    			else
    				Clients.insert({clientID: clientID, IP: clientIP, life: 70});
                    if (!ClientsAll.findOne({clientID: clientID})) {
                      ClientsAll.insert({clientID: clientID});
                      ClientsSummary.update({_id : '1'}, {$inc: {total: 1}});
                    }
    		}
		});
  });
  }
