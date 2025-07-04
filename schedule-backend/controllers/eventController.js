import Event from '../models/event.js';

export const createEvent = async (req, res) => {
  try {
    const { title, date, time, location } = req.body;

    const event = new Event({ title, date, time, location });
    await event.save();

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error });
  }
};
