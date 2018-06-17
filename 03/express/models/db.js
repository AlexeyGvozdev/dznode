const mongoose = require('mongoose');
const User = require('./userSchema');
const Product = require('./productSchema')

const isNotValid = (data) => {
    let isConserts = !!data.conserts && data.concerts > 0;
    let isCountCity = !!data.cities && data.cities > 0;
    let isYearsOnScene = !!data.years && data.years > 0;
    let isAge = !!data.age && data.age > 0;
    return !isConserts && !isAge;
};

module.exports.getUser = (email) => {
    console.log(1231424234);
    return User.findOne({"email": email});
}

module.exports.insertUpload = (data) => {
    const product = new Product({
        path: data.path,
        name: data.name,
        price: data.price,
        idUser: data.idUser
    })
    return product.save();
}

module.exports.setSkills = (email, skills) => {
    if(isNotValid(skills)) {
        return new Promise((res, rej) => {
            res(false)
        })
    }
    return User.update(
        { email: email }, 
        {$set: 
            {
                age: skills.age,
                concerts: skills.concerts,
                countCity: skills.cities,
                yearsOnScene: skills.years
            }
        }
    )
}