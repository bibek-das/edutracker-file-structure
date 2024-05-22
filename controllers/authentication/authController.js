const Teacher = require("../../models/admin/teacher");
const User = require("../../models/authentication/auth");
const mongoose = require('mongoose');


exports.loginView = (req, res) => {
    try {
      const msg = req.query.message
      res.render("./authentication/login", {msg});
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
};

exports.login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({ email, password });
    const msg = "Invalid username or passwrod";
    if(!user){
        return res.redirect(`./?message=${encodeURIComponent(msg)}`);
    }
    req.session.user = user;
    if(user.role === "Admin"){
        res.redirect("./admin/home");
    }
    else{
        const teacher = await Teacher.findOne({ email: email });
        const id = teacher._id.toString()
        res.redirect(`./teachers/profile/${id}`);
    }
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};
