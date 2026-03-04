import "dotenv/config";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";

const app = Fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
// Declare a route
app.get("/", async function handler(request, reply) {
  return { hello: "world" };
});

app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/schema",
  schema: {
    description: "Rota Hellow World",
    tags: ["Hello World"],
    response: {
      200: z.object({
        message: z.string(),
      }),
    },
  },
  handler: (req, res) => {
    return {
      message: "Hellow World",
    };
  },
});

// Run the server!
try {
  await app.listen({ port: Number(process.env.PORT) || 3000 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
