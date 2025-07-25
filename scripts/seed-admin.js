// scripts/seed-admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// User model (simplified version for seeding)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['MEMBER', 'ADMIN', 'SUPER_ADMIN'], 
    default: 'MEMBER' 
  },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'INACTIVE', 'PENDING_APPROVAL'], 
    default: 'PENDING_APPROVAL' 
  },
  dateJoined: { type: Date, default: Date.now },
  membershipType: { 
    type: String, 
    enum: ['LIFE', 'ANNUAL', 'HONORARY'] 
  },
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@greenmates.org' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Admin@123', 12);

    // Create admin user
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@greenmates.org',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      membershipType: 'HONORARY',
      phone: '+91 97496 60361',
      address: 'Tarakeswar, Hooghly, West Bengal',
      bio: 'System administrator for Tarakeswar Green Mates portal.',
      skills: ['Administration', 'Management', 'IT Support'],
      interests: ['Environmental Conservation', 'Wildlife Protection', 'Community Welfare']
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@greenmates.org');
    console.log('🔑 Password: Admin@123');
    console.log('👤 Role: SUPER_ADMIN');
    console.log('⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

seedAdmin();
