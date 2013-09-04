Spy
===

#####A simple smart package for watching and counting clients. 


Usage
=====

Spy provides reactive information about clients visiting your meteor app. The following should be all you'll need to get started.



1. Navigate to your local app directory in shell.

2. Install Spy:   (requires meteorite)
	```
	mrt add Spy
	```

3. Count your clients:
	```
	Session.get('numberOfClients');
	```
	
4. Spy on your clients!
	```
	Meteor.call('getClients', function(err, arr){
		// 'arr' will be an array of client objects (with lots of neat data!)
	});
	```