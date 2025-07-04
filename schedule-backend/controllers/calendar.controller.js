import CalendarEvent from "../models/CalendarEvent.js";

// GET all events for a user
export const getEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find({ userId: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create event
export const createEvent = async (req, res) => {
  try {
    const { title, start, end, allDay, tag } = req.body;

    const event = new CalendarEvent({
      title, start, end, allDay, tag,
      userId: req.user.id
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT update event
export const updateEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE event
export const deleteEvent = async (req, res) => {
  try {
    const deleted = await CalendarEvent.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!deleted) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
