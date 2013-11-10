"use strict";

var restify = require("restify");

var todos = require("./repository.js");

exports.getAll = function(req, res, next) {
	res.send(todos.findAll());
	next();
};

exports.getById = function(req, res, next) {
	getTodoById( req.params.id, function ( err, todo ) {
		if ( err ) {
			next( err );
		} else {
			res.send( todo );
			next();
		}
	});
};

exports.create = function(req, res, next) {
	var todo = todos.save( req.body );

	res.header("Location", "http://localhost:8080/todos/" + todo.id);
	res.send(201, todo);

	next();
};

exports.update = function(req, res, next) {
	getTodoById( req.params.id, function ( err, todo ) {
		if ( err ) {
			next( err );
		} else {
			var id = todo.id;
			var newTodo = req.body;

			for ( var prop in todo ) {
				if( todo.hasOwnProperty( prop ) ) {
					todo[ prop ] = newTodo[ prop ];
				}
			}

			todo.id = id; // don't let the client modify the id

			res.send(todo);
			next();
		}
	});
};

exports.partialUpdate = function(req, res, next) {
	getTodoById(req.params.id, function(err, todo) {
		if (err) {
			next(err);
		} else {
			var id = todo.id;
			var newTodo = req.body;

			for ( var prop in newTodo ) {
				if( todo.hasOwnProperty( prop ) ) {
					todo[ prop ] = newTodo[ prop ];
				}
			}

			todo.id = id; // don't let the client modify the id

			res.send(todo);
			next();
		}
	});
};

exports.remove = function( req, res, next ) {
	todos.remove( req.params.id );

	res.send(204);

	next();
};

function getTodoById(id, next) {
	if ( typeof(id) === "string" ) {
		id = parseInt( id, 10 );
	}

	var todo = todos.find( function ( todo ) {
		return todo.id === id;
	});

	if ( todo ) {
		next( null, todo );
	} else {
		next( new restify.ResourceNotFoundError( id.toString() ), null );
	}
}