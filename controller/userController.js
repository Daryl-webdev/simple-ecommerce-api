const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const { createAccessToken } = require('../auth');

exports.getAllUsers = (req,res)=>{
	User.find({}, (err, result)=>{
		res.send(result)
	})
}

exports.deleteAll = (req,res)=>{
	User.deleteMany({}, (err,result)=> res.send("All user successfully deleted"))
}

exports.toNonAdmin = (req,res)=>{
	let id = req.params.id
	User.findByIdAndUpdate(id, {$set: {isAdmin: false}}, {new: true}, (err, updatedProfile)=>(err) ?console.log(err) : res.send("Update Success!: \n" + updatedProfile))
}

exports.registerUser = (req,res)=>{
	let { email, password, isAdmin, firstName, lastName, suffix, userName } = req.body
	if( email && password && firstName && lastName && userName){
	let hashedPassword = bcrypt.hashSync(password, 10)
		User.findOne({email: email}, (err, foundUser)=>{
			if(foundUser){
				res.send(`Email already exist`)
			}else{
				User.findOne({userName: userName}, (err,foundUserName)=>{
					if(foundUserName){
						res.send(`Username already exist`)
					}else{
						let newUser = User({
							firstName: firstName,
							lastName: lastName,
							userName: userName,
							email: email,
							password: hashedPassword,
						});
						if(isAdmin){ newUser.isAdmin = isAdmin }
						if(suffix){ newUser.suffix = suffix}				
						newUser.save((err, newUserRegistered)=>
							(err) ? console.log(err) : res.send("User is successfully registered"))
					}
				})
			}
		})
	}else{
		res.send(`All fields are required —'firstName' —'lasttName' —'userName' —'email' —'password'`)
	}
}

exports.login = (req,res)=>{
  let { email, password, userName } = req.body
  let {body} = req
	if((email && password) || (body.userName && password) ){
		User.findOne( {$or: [{email: email}, {userName: userName}]}, (err, foundUser)=>{
			if(err){
				console.log(err)
			}else{
				if(foundUser){
					let passwordComfirmed = bcrypt.compareSync(password, foundUser.password);

						if(passwordComfirmed){
							res.send(`Congrats! You Successfully Logged in \n Your authUser is: \n\n ${createAccessToken(foundUser)}`)

						}else{
							res.send("Opps wrong password")
						}
					}else{
						res.send("Invalid Credential check your email/username")
					}
				}
		})
	}else { res.send(`All fields required '—email/userName' '—password' `)}
}

exports.toAdmin = (req,res)=>{
	if(req.params.id == 'email'){
		if(req.body.email){
			User.findOne({email: req.body.email}, (err, foundUser)=> {
				if(foundUser){
					if(foundUser.isAdmin){
						res.send(`${foundUser.firstName} is Already an Admin no need for Update`)
					}else{ res.send(`Update Success! ${foundUser.firstName} is now an Admin: \n ${foundUser}`) }
				}else{ res.send("Cant find your Email please try again tot tot tot") }
			})
				
		}else { res.send("ERROR! Please input email") }	
	}else if(req.params.id == 'username'){
		if(req.body.userName){
			User.findOne({userName: req.body.userName}, (err, foundUser)=> {
				if(foundUser){
					if(foundUser.isAdmin){
						res.send(`${foundUser.firstName} is Already an Admin no need for Update`)
					}else{ res.send(`Update Success! ${foundUser.firstName} is now an Admin: \n ${foundUser}`) }
				}else{ res.send("Cant find your Username please try again tot tot tot") }
			})
				
		}else { res.send("ERROR! Please input userName") }	
	}else{
		let id = req.params.id
		User.findByIdAndUpdate(id, {$set: {isAdmin: true}}, {new: true}, (err, updatedProfile)=>(err) ?console.log(err) : res.send("Update Success!: \n" + updatedProfile))
	}
}

