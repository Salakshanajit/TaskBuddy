const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Every task route requires a valid JWT.
router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.patch('/:id/status', updateTaskStatus);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
