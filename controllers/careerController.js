const Career = require("../models/Career");

// creating a new job
const createJob = async (req, res) => {
  try {
    const { title, description, expiresAt } = req.body;
    const job = new Career({ title, description, expiresAt });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all the jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Career.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update the job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, expiresAt } = req.body;

    const updated = await Career.findByIdAndUpdate(
      id,
      { title, description, expiresAt },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete the job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Career.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createJob, getJobs, updateJob, deleteJob };
