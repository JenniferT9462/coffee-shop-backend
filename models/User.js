const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, unique: true },
    role: { type: String, default: 'user', enum: [ 'admin', 'user' ]}
});

//Hash bcrypt
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    const plainTextPassword = this.password;
    const encryptedPassword = await bcrypt.hash(plainTextPassword, salt);
    this.password = encryptedPassword;
    next();
})

//Compare password
userSchema.methods.comparePassword = function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
}


//Create the User model
const User = mongoose.model('User', userSchema);

//Export the model
module.exports = User;