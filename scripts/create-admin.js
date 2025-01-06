const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Update connection string without deprecated options
mongoose.connect('mongodb://admin-db:27017/admin-db')
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const AdminSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Admin = mongoose.model('Admin', AdminSchema);

async function createAdmin() {
    try {
        const existingAdmin = await Admin.findOne({ email: 'admin@admin.com' });
        if (existingAdmin) {
            console.log('Admin already exists');
            mongoose.connection.close();
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new Admin({
            email: 'admin@admin.com',
            password: hashedPassword,
            role: 'admin'
        });
        await admin.save();
        console.log('Admin created successfully');
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

mongoose.connection.on('error', err => {
    console.error('MongoDB error:', err);
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    createAdmin();
}); 