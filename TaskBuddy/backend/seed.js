require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Task = require('./models/Task');

const daysFromNow = (days) => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
};

const run = async () => {
  await connectDB();

  const email = 'demo@taskbuddy.com';
  const demoPassword = 'Demo@123';
  let user = await User.findOne({ email }).select('+password');

  if (!user) {
    const password = await bcrypt.hash(demoPassword, 10);
    user = await User.create({ name: 'Demo User', email, password });
    console.log('Created the demo account.');
  } else if (!(await bcrypt.compare(demoPassword, user.password))) {
    user.password = await bcrypt.hash(demoPassword, 10);
    await user.save();
    console.log('Updated the demo account password.');
  } else {
    console.log('Demo account already exists.');
  }

  const taskCount = await Task.countDocuments({ user: user._id });
  if (taskCount === 0) {
    await Task.insertMany([
      { title: 'Finish project report', description: 'Write the conclusion and add references.', dueDate: daysFromNow(2), priority: 'High', status: 'In Progress' },
      { title: 'Prepare presentation slides', description: 'Create slides covering the project architecture and demo.', dueDate: daysFromNow(5), priority: 'Medium', status: 'Pending' },
      { title: 'Review weekly priorities', description: 'Check deadlines and plan the next work session.', dueDate: daysFromNow(1), priority: 'Low', status: 'Pending' },
      { title: 'Submit lab record', description: 'Final review and submission complete.', dueDate: daysFromNow(-1), priority: 'High', status: 'Completed' },
      { title: 'Organize project notes', description: 'Organize research notes and key decisions.', dueDate: daysFromNow(7), priority: 'Low', status: 'Completed' },
    ].map((task) => ({ ...task, user: user._id })));
    console.log('Added sample tasks to the demo account.');
  } else {
    console.log('Demo account already has tasks; leaving them unchanged.');
  }

  console.log('Seed complete. Login with demo@taskbuddy.com / Demo@123');
};

run()
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
