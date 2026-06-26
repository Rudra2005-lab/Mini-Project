const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'technical',
        'communication',
        'leadership',
        'problem-solving',
        'domain',
        'soft-skills',
      ],
      default: 'technical',
    },
    proficiency: { type: Number, min: 0, max: 100, default: 0 },
    source: { type: String, enum: ['manual', 'resume', 'github'], default: 'manual' },
    verified: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Skill || mongoose.model('Skill', skillSchema);

