
const express = require('express');
const authenticateToken = require('../middleware/auth');
const EligibilityAssessment = require('../models/EligibilityAssessment');
const User = require('../models/User');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { userNeed, matchedProjects, answers } = req.body;

    if (
      typeof userNeed !== 'string' ||
      !userNeed.trim() ||
      userNeed.length > 2000
    ) {
      return res.status(400).json({
        message: 'Please provide a valid description of your need.',
      });
    }

    if (
      !Array.isArray(matchedProjects) ||
      matchedProjects.length === 0 ||
      matchedProjects.length > 10
    ) {
      return res.status(400).json({
        message: 'Please provide at least one matched scheme.',
      });
    }

    if (
      !answers ||
      typeof answers !== 'object' ||
      Array.isArray(answers)
    ) {
      return res.status(400).json({
        message: 'Please provide your questionnaire answers.',
      });
    }

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

    const user = await User.findById(req.userId).select('name');

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    const assessment = await EligibilityAssessment.create({
      userId: user._id,
      userName: user.name,
      userNeed: userNeed.trim(),
      matchedProjects: safeProjects,
      answers,
      result: 'Needs official verification',
    });

    return res.status(201).json({
      message: 'Assessment saved successfully.',
      assessmentId: assessment._id,
      userName: assessment.userName,
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
