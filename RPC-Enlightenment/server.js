'use strict';

var fs = require('fs');
var restify = require('restify');

var todos = [];

var filename = __dirname + '/todos.json';
fs.readFile(filename, function (err, data) {
	if (err) {
		throw err;
	}

	todos = JSON.parse(data);
});

var server = restify.createServer();

server.use(restify.queryParser({ mapParams: false }));
server.use(restify.bodyParser({ mapParams: false }));

// routes for todo collection
server.get('/getTodos', function (req, res) {
	res.send(todos);
});

server.get('/getPagedTodos', function (req, res) {
	var limit = req.query.take || todos.length;
	var page = req.query.page || 1;
	var offset = (page - 1) * limit;

	res.send(todos.slice(offset, offset + limit));
});

server.get('/getTodosByCategory/:category', function (req, res) {
	var filtered = todos.filter(function (todo) {
		return todo.category === req.params.category;
	});

	res.send(filtered);
});

server.get('/getTodosByAuthor/:author', function (req, res) {
	var filtered = todos.filter(function (todo) {
		return todo.author === req.params.author;
	});

	res.send(filtered);
});

server.post('/deleteAllTodos', function (req, res) {
	todos = [];

	res.send('OK');
});

server.post('/deleteAllTodosByCategory/:category', function (req, res) {
	var filtered = todos.filter(function (todo) {
		return todo.category !== req.params.category;
	});

	todos = filtered;

	res.send('OK');
});

server.post('/deleteAllTodosByAuthor/:author', function (req, res) {
	var filtered = todos.filter(function (todo) {
		return todo.author !== req.params.author;
	});

	todos = filtered;

	res.send('OK');
});


// routes for todo
server.get('/getTodoById/:id', function (req, res) {
	var todo = todos.filter(function (todo) {
		return todo.id == req.params.id;
	});

	res.send(todo[0]);
});

server.get('/getTodoBySlug/:slug', function (req, res) {
	var todo = todos.filter(function (todo) {
		return todo.text.replace(/\s/g, '-') === req.params.slug;
	});

	res.send(todo[0]);
});

server.post('/createTodo', function (req, res) {
	var lastId = 0;

	if(todos && todos.length > 0) {
		lastId = todos[todos.length-1].id;
	}

	lastId++;

	var todo = req.body;
	todo.id = lastId;

	todos.push(todo);

	res.send('OK');
});

server.post('/updateTodo', function (req, res) {
	var todo = todos.filter(function (todo) {
		return todo.id == req.body.id;
	});

	var pos = todos.indexOf(todo[0]);
	todos[pos] = req.body;

	res.send('OK');
});

server.post('/deleteTodoById/:id', function (req, res) {
	var todo = todos.filter(function (todo) {
		return todo.id == req.params.id;
	});

	var pos = todos.indexOf(todo[0]);

	if(pos > -1) {
		todos.splice(pos, 1);
	}

	res.send('OK');
});

server.post('/setTodoCategory/:id', function (req, res) {
	var todo = todos.filter(function (todo) {
		return todo.id == req.params.id;
	});

	todo[0].category = req.body;

	res.send('OK');
});

server.post('/removeTodoCategory/:id', function (req, res) {
	var todo = todos.filter(function (todo) {
		return todo.id == req.params.id;
	});

	todo[0].category = '';

	res.send('OK');
});

server.listen(8080);