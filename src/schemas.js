const messageBodyJsonSchema = {
  type: "object",
  required: ["channel", "message"],
  properties: {
    channel: { type: "string" },
    message: { type: "string" },
  },
};

const schema = {
  body: messageBodyJsonSchema,
};

exports.schema = schema;
