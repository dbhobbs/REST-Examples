'use strict';

var fs = require('fs');
var restify = require('restify');

var todos = [];

var filename = __dirname + '/todos.json';
fs.readFile(filename, function(err, data) {
	if (err) {
		throw err;
	}

	todos = JSON.parse(data);
});

function getTodoById(id, next) {
	if (typeof(id) === 'string') {
		id = parseInt(id, 10);
	}

	var todo = todos.filter(function(todo) {
		return todo.id === id;
	});

	if (todo && todo.length) {
		next(null, todo[0]);
	} else {
		next(new restify.ResourceNotFoundError(id.toString()), null);
	}
}

var server = restify.createServer();

server.use(restify.queryParser({
	mapParams: false
}));
server.use(restify.bodyParser({
	mapParams: false
}));

server.get('/todo', function(req, res, next) {
	res.send(todos);
	next();
});

server.get('/todo/:id', function(req, res, next) {
	getTodoById(req.params.id, function(err, todo) {
		if (err) {
			next(err);
		} else {
			res.send(todo);
			next();
		}
	});
});

server.post('/todo', function(req, res, next) {
	var lastId = 1;
	if (todos.length) {
		lastId = todos[todos.length - 1].id + 1;
	}

	var todo = req.body;
	todo.id = lastId;
	todos.push(todo);

	res.header('Location', '/todo/' + todo.id);
	res.send(201, todo);
	next();
});

server.put('/todo/:id', function(req, res, next) {
	getTodoById(req.params.id, function(err, todo) {
		if (err) {
			next(err);
		} else {
			var index = todos.indexOf(todo);
			if (index < 0) {
				return next(new restify.ResourceNotFoundError(todo.id.toString()));
			}

			var id = todo.id;
			todo = req.body;
			todo.id = id; // don't let the client modify the id
			todos[index] = todo;

			res.send(todo);
			next();
		}
	});
});

server.patch('/todo/:id', function(req, res, next) {
	getTodoById(req.params.id, function(err, todo) {
		if (err) {
			next(err);
		} else {
			var index = todos.indexOf(todo);
			if (index < 0) {
				return next(new restify.ResourceNotFoundError(todo.id.toString()));
			}

			// TODO modify todo from req.body

			res.send(todo);
			next();
		}
	});
});

server.del('/todo/:id', function(req, res, next) {
	getTodoById(req.params.id, function(err, todo) {
		// TODO no error on 404
		if (err) {
			next(err);
		} else {
			var index = todos.indexOf(todo);
			if (index < 0) {
				return next(new restify.ResourceNotFoundError(todo.id.toString()));
			}

			todos.splice(index, 1);

			res.send(todo);
			next();
		}
	});
});

server.listen(8001, function() {
	console.log('Server running at localhost:8001');
});
