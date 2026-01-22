const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { protect } = require('../middlewares/auth.middleware');

// All routes are protected
router.use(protect);

// GET /api/tasks - get all tasks
router.get('/', taskController.getAllTasks);

// POST /api/tasks - create task
router.post('/',protect,taskController.createTask);

// GET /api/tasks/:id - get one task
router.get('/:id', taskController.getTask);

// PUT /api/tasks/:id - update task
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id - delete task
router.delete('/:id', taskController.deleteTask);

// PATCH /api/tasks/:id/complete - mark task as complete
router.patch('/:id/complete', taskController.markComplete);

module.exports = router;