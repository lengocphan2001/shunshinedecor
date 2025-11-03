import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import app from './app';
import { connectToDatabase } from './infrastructure/database';
import { seedAdmins } from './infrastructure/seed';
import { setupSocketIO } from './infrastructure/socket';

const PORT = Number(process.env.PORT || 4000);

async function bootstrap() {
  await connectToDatabase();
  await seedAdmins();
  const httpServer = createServer(app);
  
  // Setup Socket.IO
  const io = setupSocketIO(httpServer);
  console.log('Socket.IO server initialized');
  
  httpServer.listen(PORT, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on http://localhost:${PORT}`);
    console.log(`Socket.IO server listening on ws://localhost:${PORT}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', error);
  process.exit(1);
});


