const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      default: 'Untitled Resume',
    },
    template: {
      type: String,
      enum: ['classic', 'modern', 'minimal', 'creative'],
      default: 'classic',
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
      summary: { type: String, default: '' },
    },
    education: [
      {
        institution: { type: String, default: '' },
        degree: { type: String, default: '' },
        fieldOfStudy: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        gpa: { type: String, default: '' },
      },
    ],
    experience: [
      {
        company: { type: String, default: '' },
        position: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        current: { type: Boolean, default: false },
        description: { type: String, default: '' },
      },
    ],
    skills: [
      {
        name: { type: String, default: '' },
        level: {
          type: String,
          enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
          default: 'Intermediate',
        },
      },
    ],
    projects: [
      {
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        url: { type: String, default: '' },
        technologies: { type: String, default: '' },
      },
    ],
    certifications: [
      {
        name: { type: String, default: '' },
        issuer: { type: String, default: '' },
        date: { type: String, default: '' },
        url: { type: String, default: '' },
      },
    ],
    languages: [
      {
        name: { type: String, default: '' },
        proficiency: {
          type: String,
          enum: ['Basic', 'Conversational', 'Fluent', 'Native'],
          default: 'Conversational',
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
