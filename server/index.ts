import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from "server/db";
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { stderr } from "process";
import config from './config';

// Display startup environment information
console.log(`Starting Expert Recruitments in ${config.ENV.NODE_ENV} environment`);
console.log(`Server port: ${config.app.port}`);
console.log(`Environment: ${config.ENV.IS_PRODUCTION ? 'Production' : 'Development'}`);
if (config.ENV.IS_FLY_IO) console.log('Detected Fly.io hosting platform');
if (config.ENV.IS_REPLIT) console.log('Detected Replit hosting platform');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execAsync = promisify(exec);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Run database migrations before starting the server
    log("Running database migrations...");
    try {
      await migrate(db, { migrationsFolder: path.join(__dirname, '../migrations') });
      log("Database migrations completed");
    } catch (error) {
      // Log the error but continue - tables likely already exist
      log("Migration notice:", error instanceof Error ? error.message : String(error));
      log("Continuing with existing database schema...");
    }

    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (config.ENV.IS_DEVELOPMENT) {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Serve the app on configured port
    // This serves both the API and the client
    const port = config.app.port;
    server.listen({
      port,
      host: "0.0.0.0"
    }, () => {
      log(`serving on port ${port} in ${config.ENV.NODE_ENV} environment`);
    });
  } catch (error) {
    log("Error during server startup:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
})();
