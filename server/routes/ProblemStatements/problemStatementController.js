const Problem = require('../../models/ProblemStatement/ProblemStatement')
const express = require("express")
const verify = require('../../middlewares/verifyAuthToken')

const router = express.Router()

//These endpoint requires user to be admin add functionality of admin user in authentication (non priority)

router.post('/add-problem', verify, async (req, res) => {
    try {
        const {
            name,
            difficulty,
            time_to_solve,
            description,
            example_input,
            example_output
        } = req.body;

        const newProblemStatement = new Problem({
            name,
            difficulty,
            time_to_solve,
            description,
            example_input,
            example_output
        });

        await newProblemStatement.save();

        res.status(201).json({ message: 'Problem statement created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the problem statement' });
    }
});

// get all problems
router.get('/problems', verify, async (req, res) => {
    try {
        const problems = await Problem.find({});

        res.status(200).json(problems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching problems' });
    }
});


//get single problem
router.get('/problems/:id', verify, async (req, res) => {
    try {
        const problemId = req.params.id;

        // Query the database to find a problem statement by its ID
        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.status(200).json(problem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the problem' });
    }
});


//Testcases
router.post('/:id/add-testcase', async (req, res) => {
    try {
        const problemId = req.params.id;
        const { input, output } = req.body;

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        console.log(output)
        problem.testcases.push({
            input,
            output
        });

        await problem.save();

        res.status(201).json({ message: 'Test case added to the problem statement' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the test case' });
    }
});

router.get('/:id/testcases', async (req, res) => {
    try {
        const problemId = req.params.id;

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        const testcases = problem.testcases;

        res.status(200).json(testcases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching test cases' });
    }
});

module.exports = router;