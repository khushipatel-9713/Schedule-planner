import User from '../models/User.js';

// 👉 Get Profile by ID
export const getProfile = async (req, res) => {
  try {
     const userId = req.user._id; 
   
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// 👉 Update Profile
export const updateProfile = async (req, res) => {
  try {
   const userId = req.user._id; 
    const updatedData = req.body;

    if (updatedData.password) {
      // Optional: Hash password before saving
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(updatedData.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
