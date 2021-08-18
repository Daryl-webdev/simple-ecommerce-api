const Product = require('../model/productModel');

exports.getAllProduct =  (req,res)=> Product.find({}, (err, result) => (err)? console.log(err): res.send(result))

exports.deleteAllProd = (req,res)=> Product.deleteMany({}, (err,result) => (err)? console.log(err): res.send("All Products Deleted"))

exports.retrieveActiveProducts = (req,res)=>{Product.find({isActive: true}, (err, activeProducts)=> (err)? console.log(err): res.send(activeProducts))}


exports.getProduct = (req,res)=>{
	let id = req.params.productId
	Product.findOne({_id: id}, (err,foundProduct)=>{
		if(foundProduct){
			if(foundProduct.isActive){
				res.send(foundProduct)
			}else{
				if(req.accessToken === undefined){
					res.send("This Product is not available")
				}else{ 
					if(req.decodedUser.isAdmin){
						res.send(foundProduct)
					}else{ res.send("This Product is not available")}
				}
			}
		}else{ res.send(`Cant find the product please check your Product ID`) }
	})
}

exports.createProduct = (req,res)=>{
	let { name, description, price } = req.body
	if(name && description && price){
		let newProduct = new Product({
			name: name,
			description: description,
			price: price
		})
		newProduct.save((err,save) => (err) ? console.log(err) : res.send(`New Product Added! ${save}`))	
	}else{ res.send(`All Fields Required 'desciption' 'name' 'price'`) }	
}

exports.updateProduct = (req,res)=>{
	let id = req.params.prodId;
	let { name, description, price, isActive } = req.body
	console.log(isActive)
	if(name || description || price || isActive != null){
		let updates = {
			name: name,
			price: price,
			description: description,
			isActive: isActive
		}
		let option = {new: true}
		Product.findOne({_id: id}, (err, foundProduct) => {
			if(foundProduct){
				if(!name){updates.name = foundProduct.name}
				if(!price){updates.price = foundProduct.price}
				if(!description){updates.description = foundProduct.description}
				if(isActive == null){updates.isActive = foundProduct.isActive}
				Product.findByIdAndUpdate(id, {$set: updates}, option, 
					(err, result) =>{
						if(err)	{
							console.log(err) 
						}else {
							 res.send(
							 `Succesful Update! \n This is now your Product's info: \n ${result} \n
							 	 Reference/Updated From: \n ${foundProduct}`)
						}
					}) 
		}else { res.send(`No product for this Id please check your input id`) }
		})
	}else { res.send(`Please choose what to update '―description' '―name' '―price' -'isActive'`) }
}

exports.archiveProduct = (req,res)=>{
	let id = req.params.prodId;
	Product.findOne({_id:id}, (err, foundProduct)=>{
		if(err){
			console.log(err)
		}else{
			if(foundProduct.isActive){
				Product.findByIdAndUpdate(id, {$set: {isActive: false}}, {new: true}, (err, result)=>{
					res.send(`Product Deleted Succesfully \n ${result}`)
				})
			}else{ res.send("Product is Already Deleted") }
		}
	})
	
}