// server.js

require('dotenv').config();

const app = require('./app');
const connectDB = require('./db/connect');
const User = require('./models/user');
const PORT = process.env.PORT || 5000;


connectDB().then(() => {
    createAdminUser();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  });


const createAdminUser = async () => {
    try {
      const existingAdmin = await User.findOne({ username: 'admin' });
  
      if (!existingAdmin) {
        const adminUser = new User({
          username: 'admin',
          password: 'admin',
          name: 'Administrator',
          class: 'N/A',
          role: 'admin',
        });

        await adminUser.save();
        console.log('Admin user created');
      } else {
        console.log('Admin user already exists');
      }
    } catch (error) {
      console.error('Error creating admin user:', error.message);
    }
};