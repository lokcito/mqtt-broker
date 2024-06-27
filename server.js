const path = require("path");
const schemas = require("./src/schemas");
const mqtt = require("mqtt");

var options = {
  host: process.env["MQTT_HOST"],
  port: 8883,
  protocol: "mqtts",
  username: process.env["MQTT_USER"],
  password: process.env["MQTT_PWD"],
};

// initialize the MQTT client
const mqttClient = mqtt.connect(options);

const fastify = require("fastify")({
  logger: false,
});

fastify.register(require("@fastify/formbody"));

fastify.get("/", function (request, reply) {
  return "Service running.";
});

fastify.post(
  "/publish",
  {
    schema: schemas.schema,
  },
  function (request, reply) {
    if (!mqttClient.connected) {
      reply.status(503).send({ error: "MQTT client is not connected" });
      return;
    }

    mqttClient.publish(request.body.channel, request.body.message, (err) => {
      if (!err) {
        reply.status(200).send({ status: "Message published" });
      } else {
        reply.status(500).send({ error: "Failed to publish message" });
      }
    });
  }
);

// Handle connection events
mqttClient.on("connect", () => {
  console.log("MQTT client connected");
});
// Maneja errores de conexión
mqttClient.on("error", (err) => {
  console.error("Error de conexión:", err);
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
