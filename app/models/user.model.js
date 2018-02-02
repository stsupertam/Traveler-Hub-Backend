const bcrypt = require('bcrypt-promise');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: {
        type: String, 
        unique: true, 
        required: [true, 'Username field is required']
    },
    email: {
        type: String, 
        unique: true, 
        required: [true, 'Email field is required'],
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password field is required']
    },
    usertype: {
        type: String,
        required: [true, 'Usertype field is required']
    },
    created: {
        type: Date,
        default: Date.now
    }
}, { strict: true });

UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR)
        .then((salt) => {
            return bcrypt.hash(user.password, salt);
        }).then((hash) => {
            user.password = hash;
            next();
        }).catch((err) => {
            return next(err);
        });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password)
        .then((isMatch) => cb(null, isMatch))
        .catch((err) => {
            return cb(err);
        })
};

UserSchema.virtual('customers', {
    ref: 'Customer',
    localField: 'username',
    foreignField: 'username',
});

UserSchema.virtual('employees', {
    ref: 'Employee',
    localField: 'username',
    foreignField: 'username',
});

UserSchema.plugin(uniqueValidator);
mongoose.model('User', UserSchema)