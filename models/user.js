const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 254,
    },
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose, {
    usernameLowerCase: true,
    usernameField: 'username',
    limitAttempts: true,
    maxAttempts: 10,
    unlockInterval: 15 * 60 * 1000,
});

module.exports = mongoose.model('User', userSchema);
