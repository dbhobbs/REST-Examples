"use strict";

var fs = require("fs");
var restify = require("restify");

var todos = [];

var filename = __dirname + "/users.json";
fs.readFile(filename, function(err, data) {
	if (err) {
		throw err;
	}

	todos = JSON.parse(data);
});

exports.getAll = function ( req, res, next ) {
	next();
};

exports.getByName = function ( req, res, next ) {
	next();
};

exports.remove = function ( req, res, next ) {
	next();
};
