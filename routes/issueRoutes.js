import express from 'express';
import Issue from '../models/issueSchema.js';

const router = express.Router();

// Create an issue
router.post('/', async (req, res) => {
    try {
        const newIssue = new Issue(req.body);
        const savedIssue = await newIssue.save();
        res.status(201).json(savedIssue);
    } catch (err) {
        res.status(400).json({ error: 'Error creating issue', message: err.message });
    }
});

// Get all issues
router.get('/', async (req, res) => {
    try {
        const issues = await Issue.find();
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching issues', message: err.message });
    }
});

// Get issue by ID
router.get('/:id', async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ error: 'Issue not found' });
        res.json(issue);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching issue', message: err.message });
    }
});

// Update issue
router.put('/:id', async (req, res) => {
    try {
        const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedIssue) return res.status(404).json({ error: 'Issue not found' });
        res.json(updatedIssue);
    } catch (err) {
        res.status(400).json({ error: 'Error updating issue', message: err.message });
    }
});

// Delete issue
router.delete('/:id', async (req, res) => {
    try {
        const deletedIssue = await Issue.findByIdAndDelete(req.params.id);
        if (!deletedIssue) return res.status(404).json({ error: 'Issue not found' });
        res.json(deletedIssue);
    } catch (err) {
        res.status(500).json({ error: 'Error deleting issue', message: err.message });
    }
});

export default router;
