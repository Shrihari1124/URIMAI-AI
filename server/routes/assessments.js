
const express = require('express');
const authenticateToken = require('../middleware/auth');
const EligibilityAssessment = require('../models/EligibilityAssessment');

const router = express.Router();

// POST /api/assessments
// Requires a valid JWT token.
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { userNeed, matchedProjects, answers } = req.body;

    // Validate the user's description.
    if (
      typeof userNeed !== 'string' ||
      !userNeed.trim() ||
      userNeed.length > 2000
    ) {
      return res.status(400).json({
        message: 'Please provide a valid description of your need.',
      });
    }

    // Validate matched schemes.
    if (
      !Array.isArray(matchedProjects) ||
      matchedProjects.length === 0 ||
      matchedProjects.length > 10
    ) {
      return res.status(400).json({
        message: 'Please provide at least one matched scheme.',
      });
    }

    // Validate questionnaire answers.
    if (
      !answers ||
      typeof answers !== 'object' ||
      Array.isArray(answers)
    ) {
      return res.status(400).json({
        message: 'Please provide your questionnaire answers.',
      });
    }

    // Validate and sanitize scheme information.
    const safeProjects = matchedProjects.map((project) => ({
      id: Number(project.id),
      name: String(project.name || '').trim(),
      government: String(project.government || '').trim(),
      criteriaVerified: false,
    }));

    if (
      safeProjects.some(
        (project) =>
          !Number.isInteger(project.id) ||
          !project.name ||
          project.name.length > 200
      )
    ) {
      return res.status(400).json({
        message: 'One or more scheme details are invalid.',
      });
    }

    // Save the assessment under the authenticated user's ID.
    const assessment = await EligibilityAssessment.create({
      userId: req.userId,
      userNeed: userNeed.trim(),
      matchedProjects: safeProjects,
      answers,
      result: 'Needs official verification',
    });

    return res.status(201).json({
      message: 'Assessment saved successfully.',
      assessmentId: assessment._id,
      result: assessment.result,
      createdAt: assessment.createdAt,
    });
  } catch (error) {
    console.error('Assessment save error:', error.message);

    return res.status(500).json({
      message: 'Unable to save the assessment.',
    });
  }
});

module.exports = router;
