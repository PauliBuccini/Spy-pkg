Package.describe({
    summary: "A simple smart package for watching and counting clients."
});

Package.on_use(function (api) {
    api.use(['random', 'mrt:moment@2.8.1'], ['client', 'server']);
    api.add_files('lib/client/client.js', 'client');
    api.add_files('lib/server/manager.js', 'server');
    if (api.export)
  		api.export('Client');
});

