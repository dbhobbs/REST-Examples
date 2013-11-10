"use strict";

var controller = require("./controller.js");

exports.register = function ( server ) {
	server.get("/users", controller.getAll);

	server.get("/users/:name", controller.getByName);

	server.post("/users", controller.create);

	server.del("/users/:name", controller.remove);
};