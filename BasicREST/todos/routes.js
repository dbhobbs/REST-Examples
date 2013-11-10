'use strict';

// deps
var controller = require('./controller');

// register some routes with the server
exports.register = function ( server ) {
	server.get('/todos', controller.getAll);

	server.get('/todos/:id', controller.getById);

	server.post('/todos', controller.create);

	server.put('/todos/:id', controller.update);

	server.patch('/todos/:id', controller.partialUpdate);

	server.del('/todos/:id', controller.remove);
};