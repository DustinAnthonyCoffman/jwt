const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
});

//fire a mongoose hook after something is saved to the db
userSchema.post('save', function(doc, next) {
    console.log('new user was created and saved', doc)
    //we must call next() at the end of any middleware including mongoose
    next()
});

//fire a function before we save to db using mongoose pre hook
userSchema.pre('save', async function(next) {
    //we have access to the user's password before its saved using 'this', allowing us to hash it
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

// create a static method on our model to check password and login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        //compare hashed passwords and user's entered password using bcrypt
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}

const User = mongoose.model('user', userSchema)

module.exports = User;