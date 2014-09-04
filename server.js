var Hapi = require('hapi');
var Joi = require('joi');
var server = new Hapi.Server(3000);

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
    reply({
      first: names[0],
      last: names[1],
      mood: request.query.mood,
      age: request.query.age
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
