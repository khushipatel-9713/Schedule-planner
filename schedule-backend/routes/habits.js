import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const dataPath = path.resolve("data/habits.json");

function readHabits() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, "[]");
  }
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
}

function saveHabits(habits) {
  fs.writeFileSync(dataPath, JSON.stringify(habits, null, 2));
}

// GET /api/habits - Get all habits
router.get("/", (req, res) => {
  const habits = readHabits();
  res.json(habits);
});

// POST /api/habits - Create new habit
router.post("/", (req, res) => {
  const habits = readHabits();
  const { title, streak, fusion } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newHabit = {
    id: Date.now().toString(),
    title,
    streak: Number(streak) || 0,
    fusion: fusion === true,
  };

  habits.push(newHabit);
  saveHabits(habits);

  res.status(201).json(newHabit);
});

// PUT /api/habits/:id - Update habit by id
router.put("/:id", (req, res) => {
  const habits = readHabits();
  const habitId = req.params.id;
  const { title, streak, fusion } = req.body;

  const habitIndex = habits.findIndex((h) => h.id === habitId);
  if (habitIndex === -1) {
    return res.status(404).json({ error: "Habit not found" });
  }

  habits[habitIndex] = {
    ...habits[habitIndex],
    title: title || habits[habitIndex].title,
    streak: streak !== undefined ? Number(streak) : habits[habitIndex].streak,
    fusion: fusion !== undefined ? fusion : habits[habitIndex].fusion,
  };

  saveHabits(habits);
  res.json(habits[habitIndex]);
});

// DELETE /api/habits/:id - Delete habit by id
router.delete("/:id", (req, res) => {
  const habits = readHabits();
  const habitId = req.params.id;

  const newHabits = habits.filter((h) => h.id !== habitId);
  if (newHabits.length === habits.length) {
    return res.status(404).json({ error: "Habit not found" });
  }

  saveHabits(newHabits);
  res.status(204).send();
});

export default router;
