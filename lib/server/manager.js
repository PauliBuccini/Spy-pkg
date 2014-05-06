if (Meteor.isServer) {
  Meteor.startup(function () {
  Clients = new Meteor.Collection('clients');

  Meteor.publish("clientssummary", function () {
       if (isAdminById(this.userId) || isModeratorById(this.userId) ) {
        return ClientsSummary.find({_id : 'summaryId1234'});
    }
  });

    if (ClientsSummary.find().count() === 0) {

      ClientsSummary.insert({_id: 'summaryId1234', activeLoggedUsers :0, totalLoggedUsers: 0, recordClients: 0, signedupUsers: 0, totalSpeakersLogged: 0, totalRegistered: 0, activeLastHour : 0, totalArrived: 0, totalInvited: 0, totalUninvited: 0});
    }
      Meteor.setInterval(function(){

        Clients.update({life: {$gt: 0}}, {$inc: {life: -10}}, {multi:true});

         var clientsSummary = ClientsSummary.findOne({}) || 0;
          var recordClients = clientsSummary.recordClients;
          var signedupUsers = Meteor.users.find({list: {$in: ['attendee']}, welcome: true}, {fields: {_id:1}}).count();
          var totalArrived = Meteor.users.find({arrived: true}, {fields: {_id:1}}).count();
          var totalSpeakersLogged = Meteor.users.find({list: {$in: ['speaker']}, welcome: true}, {fields: {_id:1}}).count();
          var activeLoggedUsers = Clients.find({life: {$gt: 0}}, {fields: {id: 1}}).count();
          var totalRegistered = Meteor.users.find({list: {$in: ['attendee']}}, {fields: {_id:1}}).count();
          var totalLoggedUsers = Meteor.users.find({type: {$ne: 666}, welcome: true}, {fields: {_id:1}}).count();
          var lTime = moment().subtract('m', 60).toDate();
          var activeLastHour = Clients.find({lastseen : {$gt : lTime}}).count()

          var totalUninvited = Meteor.users.find({type: {$ne: 666}, emailSent: false}, {fields: {_id: 1}}).count()
          var totalInvited = Meteor.users.find({type: {$ne: 666}, emailSent: true}, {fields: {_id: 1}}).count()
          if (recordClients < activeLoggedUsers) {
            recordClients = activeLoggedUsers;
          }
        ClientsSummary.update({_id : 'summaryId1234'}, {$set : {
          activeLoggedUsers: activeLoggedUsers,
          totalLoggedUsers: totalLoggedUsers,
          recordClients: recordClients,
          signedupUsers: signedupUsers,
          totalSpeakersLogged: totalSpeakersLogged,
          totalRegistered: totalRegistered,
          activeLastHour: activeLastHour,
          totalArrived: totalArrived,
          totalInvited: totalInvited,
          totalUninvited: totalUninvited
        }});

      }, 10000);

    	Meteor.methods({
    		updateClient: function(clientID){
          if (clientID) {
            var count = Clients.findOne({clientID: clientID});
              if(count && count.clientID) {
                Clients.update({clientID: clientID}, {$set: {life: 70, lastseen : (new Date())}});
              } else {
                Clients.insert({clientID: clientID, life: 70, lastseen : (new Date())});
                ClientsSummary.update({_id : 'summaryId1234'}, {$inc: {total: 1}});

              }
          }
    		}
  		});
  });

  }
