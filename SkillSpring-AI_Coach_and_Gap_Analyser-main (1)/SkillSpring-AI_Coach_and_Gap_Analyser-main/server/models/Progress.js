const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    date: { type: Date, required: true, default: Date.now },
    skillsAdded: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    studyMinutes: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Progress || mongoose.model('Progress', progressSchema);

