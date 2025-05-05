// controllers/hoots.js

const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const School = require("../models/school.js");
const router = express.Router();

// add routes here

router.post('/', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const school = await School.create(req.body);
        school._doc.author = req.user;
        res.status(201).json(school);
      } catch (err) {
        res.status(500).json({ err: err.message });
      }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const schools = await School.find({})
          .populate("author")
          .sort({ name: "desc" });
        res.status(200).json(schools);
      } catch (err) {
        res.status(500).json({ err: err.message });
      }
});

router.get('/:schoolId', verifyToken, async (req, res) => {
  try {
    const school = await School.findById(req.params.schoolId).populate('author');
    res.status(200).json(school);
  } catch (err) {
    res.status(500).json({err: err.message});
  }
});

router.put('/:schoolId', verifyToken, async (req, res) => {
  try {
    const school = await School.findById(req.params.schoolId);

    if (!school.author.equals(req.user._id)) {
      return res.status(403).send('Only authors can edit a Schools Info');
    }

    const updatedSchool = await School.findByIdAndUpdate(
      req.params.schoolId,
      req.body,
    );

    updatedSchool._doc.author = req.user;


    res.status(200).json(updatedSchool);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete('/:schoolId', verifyToken, async (req, res) => {
  try {
    const school = await School.findById(req.params.schoolId);

    if (!school.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const deletedSchool = await School.findByIdAndDelete(req.params.schoolId);
    res.status(200).json(deletedSchool);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
})

module.exports = router;
