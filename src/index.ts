import "dotenv/config";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
  createJsonSchemaTransform,
} from "fastify-type-provider-zod";
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import z from "zod";
const port = Number(process.env.PORT);

const app = Fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
// Declare a route
app.get("/", async function handler(request, reply) {
  return { hello: "world" };
});

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Gerenciamento de Treinos API",
      description: "API para o app Gerenciamento de Treinos",
      version: "1.0.0",
    },
    servers: [
      {
        description: "Localhost",
        url: `http://localhost:${port}`,
      },
    ],
  },
  transform: jsonSchemaTransform,
});

await app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
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
  await app.listen({ port: port || 3000 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
