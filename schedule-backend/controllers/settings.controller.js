import Settings from "../models/settingsModel.js";

export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne({ user: req.user._id });
    if (!settings) return res.json({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

export const saveSettings = async (req, res) => {
  try {
    const data = { ...req.body, user: req.user._id };
    const updated = await Settings.findOneAndUpdate(
      { user: req.user._id },
      data,
      { new: true, upsert: true }
    );
    res.json({ message: "Settings saved", settings: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to save settings" });
  }
};
