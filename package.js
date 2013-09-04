Package.describe({
    summary: "A simple smart package for watching and counting clients."
});

Package.on_use(function (api) {
    api.use('client', 'server');
    api.add_files('lib/client/client.js', 'client');
    api.add_files('lib/client/startup.html', 'client');
    api.add_files('lib/server/manager.js', 'server');
});

