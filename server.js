var Hapi = require('hapi');
var Joi = require('joi');
var server = new Hapi.Server(3000, "localhost", {
  views: {
    engines: {
      jade: require("jade")
    },
    path: "./views"
  }
});

server.method("getColor", function(name, next) {
  var colors = ["red", "blue", "indigo", "violet", "green"];
  var color = colors[Math.floor(Math.random() * colors.length)];
  next(null, color);
});

server.route({
  path: "/",
  method: "GET",
  handler: function(request, reply) {
    reply("Hello, world!");
  }
});

var helloConfig = {
  handler: function(request, reply) {
    var names = request.params.name.split("/");
    server.methods.getColor(request.params.name, function(err, color) {
      reply.view("hello", {
        first: names[0],
        last: names[1],
        mood: request.query.mood,
        age: request.query.age,
        color: color
      });
    });
  },
  validate: {
    params: {
      name: Joi.string().min(8).max(100)
    },
    query: {
      mood: Joi.string().valid(["neutral", "happy", "sad"]).default("neutral"),
      age: Joi.number().integer().min(13).max(100)

    }
  }
};

server.route({
  path: "/hello/{name*2}",
  method: "GET",
  config: helloConfig
});

server.start(function () {
  console.log('Server running at:', server.info.url)
})
