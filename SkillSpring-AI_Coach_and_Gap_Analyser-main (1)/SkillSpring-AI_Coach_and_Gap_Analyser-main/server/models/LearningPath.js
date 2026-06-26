const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { _id: false }
);

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    platform: { type: String, required: true },
    durationMinutes: { type: Number, default: 0 },
  },
  { _id: false }
);

const weekSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    weekNumber: { type: Number, required: true },
    goal: { type: String, required: true },
    estimatedHours: { type: Number, default: 6 },
    tasks: { type: [taskSchema], default: [] },
    resources: { type: [resourceSchema], default: [] },
  },
  { _id: false }
);

const learningPathSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    targetRole: { type: String, required: true },
    generatedAt: { type: Date, default: Date.now },
    gapScore: { type: Number, min: 0, max: 100, default: 0 },
    weeks: { type: [weekSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.LearningPath || mongoose.model('LearningPath', learningPathSchema);

