import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './interfaces/http/middlewares/errorHandler';
import authRouter from './interfaces/http/routes/auth.routes';
import userRouter from './interfaces/http/routes/user.routes';
import projectRouter from './interfaces/http/routes/project.routes';
import chatRouter from './interfaces/http/routes/chat.routes';
import uploadRouter from './interfaces/http/routes/upload.routes';
import quickReportRouter from './interfaces/http/routes/quickReport.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/chats', chatRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/quick-reports', quickReportRouter);

app.use(errorHandler);

export default app;


