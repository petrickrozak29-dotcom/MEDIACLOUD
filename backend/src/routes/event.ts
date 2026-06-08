import { Router } from 'express';
import { eventData } from '../services/mockData';

const router = Router();

router.get('/', (_req, res) => {
  res.json(eventData);
});

router.post('/', (req, res) => {
  const { title, date, location, description, image } = req.body;

  if (!title || !date || !location || !description) {
    return res.status(400).json({ error: 'Semua field event harus diisi.' });
  }

  const newEvent = {
    id: eventData.length + 1,
    title,
    date,
    location,
    description,
    image: image || '/images/event-placeholder.jpg'
  };

  eventData.push(newEvent);
  res.status(201).json(newEvent);
});

export default router;
