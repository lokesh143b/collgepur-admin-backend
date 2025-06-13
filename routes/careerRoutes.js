const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
} = require("../controllers/careerController");
const adminAuth = require("../middleware/adminAuth");

// creating a new job
router.post("/create-job", adminAuth, createJob);

// update job
router.put("/update-job/:id", adminAuth, updateJob);

// delete job
router.delete("/delete-job/:id", adminAuth, deleteJob);

// public
// get all the jobs
router.get("/get-jobs", getJobs);

module.exports = router;
