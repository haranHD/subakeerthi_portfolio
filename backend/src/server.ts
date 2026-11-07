import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/database.js';

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Subakeerthii Portfolio Backend running on http://localhost:${env.PORT}`);
  console.log(`🔗 API Base: http://localhost:${env.PORT}/api/v1`);
  console.log(`🩺 Health Check: http://localhost:${env.PORT}/health`);
});

const gracefulShutdown = async () => {
  console.log('\n🛑 Gracefully shutting down server...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✅ PostgreSQL disconnected.');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
