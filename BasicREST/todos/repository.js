"use strict";

var fs = require("fs");

var todos = [];

var filename = __dirname + "/../todos.json";
fs.readFile(filename, function(err, data) {
	if (err) {
		throw err;
	}

	todos = JSON.parse(data);
});

exports.find = function ( predicate ) {
	return todos.filter( predicate )[0];
};

exports.findAll = function ( predicate ) {
	if( !predicate ) {
		return todos;
	}
	
	return todos.filter( predicate );
};

exports.save = function ( todo ) {
	var lastId = 1;
	if (todos.length) {
		lastId = todos[todos.length - 1].id + 1;
	}

	todo.id = lastId;
	todos.push(todo);

	return todo;
};

exports.remove = function ( id ) {
	var todo = getTodoById( id );
	var index = todos.indexOf(todo);
	if (index < 0) {
		return null;
	}

	todos.splice(index, 1);
};

function getTodoById( id ) {
	if (typeof(id) === "string") {
		id = parseInt(id, 10);
	}

	var todo = todos.filter(function(todo) {
		return todo.id === id;
	});

	return todo[0];
}