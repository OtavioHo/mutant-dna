import { buildApp } from "./app.js";

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "0.0.0.0";

const start = async () => {
  const app = await buildApp();
  try {
    await app.listen({ port, host });
    app.log.info(`Server listening at http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export default start;
