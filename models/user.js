const { default: mongoose } = require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
// Passport-Local Mongoose is a Mongoose plugin that simplifies building 
// username and password login with Passport.

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

userSchema.plugin(passportLocalMongoose);
// This plugin by passport automatically adds username and password(with hash nd salt)
// properties to this userSchema. Also makes sure that usernames are unique.

module.exports=mongoose.model('User',userSchema);