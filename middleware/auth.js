const User = require("../models/authentication/auth");

const isAuth = (req, res, next) =>{
    if(req.session.user === undefined){
        res.redirect(`/?message=${encodeURIComponent("You need to login first")}`);
    }
    else{
        return next();
    }
}

const isAdmin = (req, res, next) =>{
    if (req.session.user && req.session.user.role === 'Admin'){
        return next();
    }else{
        res.send(`<h1>access denied!<h1>`);
    }

}

const isTeacher = (req, res, next) =>{
    if (req.session.user && req.session.user.role === 'Teacher'){
        return next();
    }else{
        res.send(`<h1>access denied!</h1>`);
    }

}

module.exports = {
    isAuth,
    isAdmin,
    isTeacher,
}