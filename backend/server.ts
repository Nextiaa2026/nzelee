import { createApiApp } from "./create-app";

const PORT = Number(process.env.API_PORT ?? 4000);

const app = createApiApp();

app.listen(PORT);

console.log(`Elysia API running on http://localhost:${PORT} (base: /api/v1)`);
