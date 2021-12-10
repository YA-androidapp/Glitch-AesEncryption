const path = require("path");
const util = require("./util");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // set this to true for detailed logging:
  logger: false
});

fastify.register(require('fastify-cors'), { 
  // put your options here
})

// Setup our static files
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/" // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("fastify-formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars")
  }
});

// Our main GET home page route, pulls from src/pages/index.hbs
fastify.get("/", function(request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = {
    iv: "",
    encrypted: ""
  };
  // request.query.paramName <-- a querystring example
  reply.view("/src/pages/index.hbs", params);
});

// A POST route to handle form submissions
fastify.post("/dec", function(request, reply) {
  let decrypted = util.decrypt(
    request.body.password,
    request.body.salt,
    Buffer.from(request.body.iv, 'base64'),
    Buffer.from(request.body.encrypted, 'base64')
  );
  let params = {
    decrypted: decrypted.toString('utf-8')
  };
  // request.body.paramName <-- a form post example
  // reply.view("/src/pages/index.hbs", params);
  return params;
});

fastify.post("/enc", function(request, reply) {
  let { iv, encrypted } = util.encrypt(
    request.body.password,
    request.body.salt,
    request.body.plaintext
  );
  let params = {
    iv: iv.toString('base64'),
    encrypted: encrypted.toString('base64')
  };
  // request.body.paramName <-- a form post example
  // reply.view("/src/pages/index.hbs", params);
  return params;
});

// Run the server and report out to the logs
fastify.listen(process.env.PORT, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
