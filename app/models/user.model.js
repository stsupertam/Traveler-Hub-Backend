const bcrypt = require('bcrypt-promise')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema
const SALT_WORK_FACTOR = 10

let UserSchema = new Schema({
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
    profileImage: { 
        type: Schema.ObjectId, 
        ref: 'Image' 
    },
    facebookID: Number,
    usertype: String,
    firstname: String,
    lastname: String,
    company: String,
    birthdate: Date,
    gender: String,
    country: String,
    province: String,
    created: {
        type: Date,
        default: Date.now
    }
}) 

UserSchema.pre('save', function(next) {
    let user = this
    if (!user.isModified('password')) return next()
    bcrypt.genSalt(SALT_WORK_FACTOR)
        .then((salt) => {
            return bcrypt.hash(user.password, salt)
        })
        .then((hash) => {
            user.password = hash
            next()
        })
        .catch((err) => {
            return next(err)
        })
})

UserSchema.pre('findOneAndUpdate', function (next) {
    let user = this
    user.setOptions({
      new: true,
      runValidators: true
    })
    if (user.getUpdate().password) { 
        bcrypt.genSalt(SALT_WORK_FACTOR)
            .then((salt) => {
                return bcrypt.hash(user.getUpdate().password, salt)
            })
            .then((hash) => {
                user.getUpdate().password = hash
                next()
            })
    }
    next()
})

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password)
        .then((isMatch) => callback(null, isMatch))
        .catch((err) => {
            return callback(err)
        })
}

UserSchema.plugin(uniqueValidator)
mongoose.model('User', UserSchema)