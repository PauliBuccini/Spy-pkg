Package.describe({
    summary: "A simple smart package for watching and counting clients."
});

Package.on_use(function (api) {
    api.use('client', 'server');
    api.add_files('lib/client.js', 'client');
    api.add_files('lib/startup.js', 'client');
    api.add_files('lib/manager.js', 'server');
    
    if (typeof api.export !== 'undefined') {
   		api.export(['Client'], ['client']);
    }
});

