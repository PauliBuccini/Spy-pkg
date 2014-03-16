if (Meteor.isServer) {
  Meteor.startup(function () {
  Clients = new Meteor.Collection('clients');
  ClientsLog = new Meteor.Collection('clientslog');


Meteor.publish("clients", function () {

  return Clients.find({userID :{$ne: null }}, {fields: {userID :1}});
})

  Meteor.publish("clientssummary", function () {
       if (isAdminById(this.userId) || isModeratorById(this.userId) ) {
        return ClientsSummary.find({_id : '1'});
    }
  });

    Meteor.publish("clientsall", function () {
       if (isAdminById(this.userId) || isModeratorById(this.userId)) {
        return ClientsAll.find();
    }
  });


      // Clients.remove({});
      // ClientsAll.remove({});
      // ClientsLog.remove({});
      // ClientsSummary.remove({});
      // XXX Need re-do to socket watch
    if (ClientsSummary.find().count() === 0) {

      ClientsSummary.insert({_id: '1', total : 0, current: 0, currentLogged :0, totalLoggedUsers: 0, recordClients: 0});
    }
      Meteor.setInterval(function(){

                      Clients.update({}, {$inc: {life: -10}}, {multi:true});
                      Clients.remove({life: {$lt: 0}});
                       var clientsSummary = ClientsSummary.findOne({}) || 0;
                        var recordClients = clientsSummary.recordClients;
                        var currentUsers = Clients.find({}).count();
                        var activeLoggedUsers = Clients.find({userID : {$ne : null}}).count();
                        var totalLoggedUsers = Meteor.users.find({}).count();
                        if (recordClients < currentUsers) {
                          recordClients = currentUsers;
                        }
                      ClientsSummary.update({_id : '1'}, {$set : {current : currentUsers, currentLogged : activeLoggedUsers, totalLoggedUsers : totalLoggedUsers, recordClients : recordClients}});

      }, 10000);

    	Meteor.methods({
    		updateClient: function(clientID, clientIP, userID){
             var count = Clients.find({clientID: clientID}).count();
             var isClientIDnew = ClientsAll.findOne({clientID: clientID}) ? false : true;

                  if(count != 0)
                    Clients.update({clientID: clientID}, {$set: {life: 70 , userID : userID}});
                  else
                    Clients.insert({clientID: clientID, IP: clientIP,  userID : userID, life: 70});
                    if (userID) {
                        if (!ClientsAll.findOne({userID: userID})) {
                          if (isClientIDnew) {
                          ClientsAll.insert({clientID: clientID, userID: userID});
                           ClientsSummary.update({_id : '1'}, {$inc: {total: 1}});
                         } else {
                          ClientsAll.update({clientID: clientID}, {$set: {userID: userID}});
                           // ClientsSummary.update({_id : '1'}, {$inc: {total: 1}});
                         }
                        }

                      ClientsAll.update({userID: userID}, {$set: {lastseen : (new Date()).getTime()}});
                    } else {
                      if (isClientIDnew) {
                        ClientsAll.insert({clientID: clientID});
                         ClientsSummary.update({_id : '1'}, {$inc: {total: 1}});
                      }

                    ClientsAll.update({clientID: clientID}, {$set: {lastseen : (new Date()).getTime()}});
                  }
    		}
		});
  });
  }
