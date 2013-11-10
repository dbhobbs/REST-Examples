"use strict";

// deps
var restify = require("restify");

// nouns
var todos = require("./todos/routes.js");
//var users = require("./users/routes.js");

var server = restify.createServer();

// restify middleware
server.use(restify.queryParser({
	mapParams: false
}));
server.use(restify.bodyParser({
	mapParams: false
}));

// routes registration
todos.register(server);
//users.register(server);

server.get("/", function ( req, res ) {
	res.send({
		"users": "http://localhost:8080/users{/name}",
		"todos": "http://localhost:8080/todos{/id}"
	});
});

// ready steady go
server.listen(8080, function() {
	console.log("Server running at localhost:8080");
});

