const express = require('express');
const router = express.Router();
const { getTasks, createTask, getTask, updateTask, deleteTask, deleteCompleted } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { taskValidator } = require('../utils/validators');

router.get('/', protect, getTasks);
router.post('/', protect, taskValidator, createTask);
router.delete('/completed', protect, deleteCompleted);
router.get('/:id', protect, getTask);
router.put('/:id', protect, taskValidator, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;