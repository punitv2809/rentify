const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs'); // Install bcryptjs: npm install bcryptjs

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: false,
    },
    role: {
        type: String,
        enum: ['seller', 'buyer'],
        required: true,
    },
});

// Hash password before saving user
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); // Skip hashing if password is not modified
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.statics.alreadyExists = async function (email) {
    const user = await this.findOne({ email });
    return !!user;
};

module.exports = mongoose.model('User', UserSchema);
