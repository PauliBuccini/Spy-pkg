

if (Meteor.isServer) {
  Meteor.startup(function () {
  Clients = new Meteor.SmartCollection('clients');
  ClientsAll = new Meteor.SmartCollection('clientsall');
  ClientsLog = new Meteor.SmartCollection('clientslog');
  ClientsSummary = new Meteor.SmartCollection('clientssummary');

Meteor.publish("clients", function () {
  // return Clients.find({userID :{ $type: 10 }}, {fields : { clientID :0, life : 0, ip :0}});
  return Clients.find({userID :{$ne: null }}, {fields: {userID :1}});
})

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

      // ClientsSummary.insert({_id: '1', total : 0, current: 0, logs : [{logtime : (new Date()).getTime(), clients : 0}]});
      ClientsSummary.insert({_id: '1', total : 0, current: 0, currentLogged :0, totalLoggedUsers: 0});
    }
      Meteor.setInterval(function(){
                         // var totalSummary = ClientsSummary.findOne({_id: '1'});
                         // var totalUsers = ClientsAll.findOne().fetch().length;
                         // if (totalUsers.total < currentUsers)
                         //    ClientsSummary.update({_id : '1'}, {$set : {total : currentUsers}});

                      Clients.update({}, {$inc: {life: -10}}, {multi:true});
                      // Meteor.users()
                       Clients.remove({life: {$lt: 0}});
                        var currentUsers = Clients.find({}).count();
                        var activeLoggedUsers = Clients.find({userID : {$ne : null}}).count();
                        var totalLoggedUsers = Meteor.users.find({}).count();
                        var totalClients = ClientsAll.find({}).count();
                      ClientsSummary.update({_id : '1'}, {$set : {current : currentUsers, currentLogged : activeLoggedUsers, totalLoggedUsers : totalLoggedUsers, total : totalClients}});

      }, 7000);

             Meteor.setInterval(function(){
                    var activeUsers = Clients.find({}).count();
                    var currentTime = (new Date()).getTime();
                    ClientsLog.insert({logtime : currentTime, clients : activeUsers});

             }, 3600000);
             // }, 10000);

    	Meteor.methods({
    		updateClient: function(clientID, clientIP, userID){
             var count = Clients.find({clientID: clientID}).count();

                  if(count != 0)
                    Clients.update({clientID: clientID}, {$set: {life: 70 , userID : userID}});
                  else
                    Clients.insert({clientID: clientID, IP: clientIP,  userID : userID, life: 70});
                            if (!ClientsAll.findOne({clientID: clientID})) {
                              ClientsAll.insert({clientID: clientID});
                              // ClientsSummary.update({_id : '1'}, {$inc: {total: 1}});
                            }

    		}
		});
  });
  }
