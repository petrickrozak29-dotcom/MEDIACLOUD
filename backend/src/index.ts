import express from 'express';
import cors from 'cors';
import tourismRouter from './routes/tourism';
import culinaryRouter from './routes/culinary';
import cultureRouter from './routes/culture';
import eventRouter from './routes/event';
import articlesRouter from './routes/articles';
import aiRouter from './routes/ai';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/tourism', tourismRouter);
app.use('/api/culinary', culinaryRouter);
app.use('/api/culture', cultureRouter);
app.use('/api/events', eventRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/ai', aiRouter);
app.use('/api/users', usersRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'MAGELANGVERSE-ID backend' }));

// Helpful root endpoint to avoid "Cannot GET /" and provide available routes
app.get('/', (_req, res) => {
  res.json({
    message: 'MAGELANGVERSE-ID backend running',
    endpoints: [
      '/api/health',
      '/api/tourism',
      '/api/culinary',
      '/api/culture',
      '/api/events',
      '/api/articles',
      '/api/ai',
      '/api/users'
    ]
  });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
