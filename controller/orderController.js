const Order = require('../model/orderModel');
const Product = require('../model/productModel');


exports.deleteAllOrders = (req, res)=> Order.deleteMany({}, (err, result)=> (err) ? console.log(err) : res.send(`All Orders Deleted `))

exports.createOrder = (req,res)=>{
	let userId = req.decodedUser.id
	let userName = req.decodedUser.userName
	let productId = req.params.prodId	
	Product.findOne({_id: productId}, function(err, result){
		if(err){
			console.log(err)
		}else if(result.isActive == false){
			res.send(`Unfortunately ${result.name} is not availble right now`)
		}else{
			Order.findOne({userName: userName}, (err,foundOrder)=>{
				if(err){
					console.log(err)
				}else if(foundOrder){
					let foundProductInfo = foundOrder.productInfo.find(o => o.productId === productId)	
						if(foundProductInfo){
							foundProductInfo.productQty += 1
							foundOrder.totalAmount += foundProductInfo.productPrice
							foundOrder.save((err,save)=> (err) ? console.log(err) : res.send(save))
						}else{
							let newProductInfo ={
								productId: productId,
								productName: result.name,
								productPrice: result.price
							}
							foundOrder.productInfo.push(newProductInfo)
							foundOrder.totalAmount += result.price
							foundOrder.save((err,save)=> (err) ? console.log(err) : res.send(save))
						}	
				}else{
					let newOrder = new Order({
						totalAmount: result.price,
						userName: userName,
						userId: userId,
						productInfo: [{
							productId: productId,
							productName: result.name,
							productPrice: result.price
						}]
					})
					newOrder.save((err,save)=>(err) ? console.log(err) : res.send(save))
				}
			})
		}
	})
		

}

exports.getOrder = (req, res)=>{
	let id = req.decodedUser.id

	Order.find({userId: id}, 
		(err,foundOrders)=>{
			if(err) {
				console.log(err) 
			} else {
				if(foundOrders.length > 0) {
					res.send(foundOrders) 
				} else { res.send(`You don't have any order`) }
			}
		})
}

exports.getAllOrder = (req,res)=>{
	Order.find({}, (err,foundOrders)=>{
		if(err) {
			console.log(err) 
		} else {
			if(foundOrders.length == 0) {
				res.send("No Order as of now") 
			} else { res.send(`This are the Lists of All Orders \n ${foundOrders}`) }
			
		}
	})	
	}



// (err) ? console.log(err) : (foundOrders == undefined) ? res.send(`This are the Lists of All Orders \n ${foundOrders}`) : res.send("No Order as of now"))}