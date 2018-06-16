const mongoose = require('mongoose');
const User = require('./userSchema');

const isNotValid = data => {
    let isConserts = !!data.conserts;
    let isCountCity = !!data.countCity;
    let isYearsOnScene = !!data.yearsOnScene;
    let isAge = !!data.age;
    return !isName || !isAge;
};

module.exports.getUser = (email) => {
    console.log(1231424234);
    return User.findOne({"email": email});
}