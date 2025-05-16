// controllers/hoots.js

const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const School = require("../models/school.js");
const Job = require("../models/job.js");
const router = express.Router();

// add routes here

router.post('/', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        req.body.coordinates = 'Need to add';
        console.log(req.body);
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
    const school = await School.findById(req.params.schoolId).populate([
      'author',
      'pastJobs',
      'currentJobs',
      
    ]);
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
});

router.post('/:schoolId/jobs', verifyToken, async (req, res) => {
  try {
    const school = await School.findById(req.params.schoolId);
  
    req.body.author = req.user._id;
    req.body.coordinates = school.coordinates;
    
    
    const job = await Job.create(req.body);

    school.currentJobs.push(job._id);
    await school.save();

    //Check that it is present in both database models correctly
    res.status(201).json({
      job: job,
      addedToSchool: school.currentJobs[school.currentJobs.length - 1]});
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put("/:schoolId/jobs/:jobId", verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.schoolId);

    // ensures the current user is the author of the job
    if (job.author.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this job" });
    }

    job.text = req.body.text;
    await job.save();
    res.status(200).json({ message: "Job updated successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


router.delete("/:schoolId/jobs/:jobId", verifyToken, async (req, res) => {
  try {
    const school = await School.findById(req.params.schoolId);
    const job = await Job.findById(req.params.jobId);

    // ensures the current user is the author of the job
    if (job.author.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this job" });
    }
    await Job.findByIdAndDelete(req.params.jobId);
    school.currentJobs.remove({ _id: req.params.jobId });
    await school.save();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
