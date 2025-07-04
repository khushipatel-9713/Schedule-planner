import SmartSchedule from '../models/SmartSchedule.js';

export const generateSmartSchedule = async (req, res) => {
  try {
    const schedules = [
      {
        user: req.user._id,
        title: 'Suggested Task',
        description: 'Finish React Project',
        timeSlot: '9 AM - 11 AM',
        type: 'suggestion',
      },
      {
        user: req.user._id,
        title: 'AI Productivity Tip',
        description: 'Java Interview Preparation',
        timeSlot: '4 PM - 6 PM',
        type: 'tip',
      },
    ];

    const created = await SmartSchedule.insertMany(schedules);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate schedule' });
  }
};

export const getSmartSchedules = async (req, res) => {
  try {
    const schedules = await SmartSchedule.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch schedule' });
  }
};

export const updateScheduleStatus = async (req, res) => {
  try {
    const schedule = await SmartSchedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

    if (schedule.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    schedule.status = req.body.status || schedule.status;
    await schedule.save();
    res.json({ message: 'Status updated', schedule });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
};
