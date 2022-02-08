const express =require('express')
const session = require('express-session');
const mongoClient =require('mongodb').MongoClient;
const bodyParser =require('body-parser');
//const cloudinary =require('./config/cloudinary')
//const uplpoad  =require('./config');


const app =express();
const url= process.env//here mongdb url)





app.use(session({
    secret:'yhis is secured login',
    resave:true,
    saveUninitialized:true
}))

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())
app.use(express.static('css'))
app.use(express.static('views'))
app.use(express.static('admin'))
app.use(express.static('scripts'))
app.use(express.static('routes'))
app.use('/images',express.static('images'))
app.set('views engine','hbs')

// Admin Router

const adminAuth = require('./routes/adminAuth')


// Router middleware

app.use('/',adminAuth)

// routes

app.get('/login',function(req,res){
    res.render('userlogin.hbs',{
        errmsg:req.session.errmsg
    })
})

app.get('/signUP', function(req,res){
    res.sendFile(__dirname + 'forms/signUp.html')
})

app.post('/auth',function(req,res){
    var flag=false;
    var username;
    db.collection('users').find({}).toArray(function (err, result){
        for(var i=0;i<result.lenght;i++){
            if(result[i].username==req.body.username && result[i].password==req.body.password){
                flag=true;
                userid=result[i]._id
                username=result[i].username
            }
        }
        if(flag==true){
            req.session.loggedIn=true
            req.session.userid=userid
            db.collection('users').findOne({_id:userid},function (err, result){
                if(err) throw error
                if(result){
                    var cart=result.cart
                    var quantity=0
                    for(var i=0; i<cart.lenght;i++){
                        quantity=quantity+parseInt(cart[i].quantity)
                    }
                    db.collection('users').findOne({_id:userid},function (err, result){
                        if (err) throw error
                        if (result){
                            const{name,username,emailid,password,phonenumber}=result
                            req.session,userdetails={name,username,emailid,password,phonenumber}
                            req.session.address=result.address
                        }
                        req.session.username=username,
                        req.session.notification=quantity,
                        res.redirect('/')
                    })

                }else{
                    req.session.notification=0
                    req.redirect('/')
                }
            })
        }else{
            res.render('userlogin',{
                errormsg:'Invalid Username or Password'
            })
        }
    })

})
 



















app.get('/updateuser',function(req,res){
    db.collection('users').updateOne({username:req.body.username},{$set:{'password':req.body.password}},function(error,result){
        if(error) throw error;
        res.redirect('login')
    })
})

app.get('/user',function(req,res){
    if(req.session.loggeedIn==true){
        res,sendFile("./home.html");
    }else{
        res.redirect("/")
    }
})

app.get('/forgotpassword',function(req,res){
    res.sendFile(__dirname+'/form/forgetpassword.html')
})

app.post('/signup',function(req,res){
    db.collection('users').insertOne({...req.body,cart:[],address:[]},function(error,result){
        if(error) throw error;
        res.redirect('/login')
    })
});

app.get('/', function(req,res){
    db.collection('bookdetails').find({}).toArray(function(error,result){
        if(result.length>0){
            res.render('home',{
                layout:'main.hbs',
                style:'home.css',
                loggedIn:res.session.loggedIn,
                username:req.session.username,
                adminloggin:req.session.adminloggin,
                userid:res.session.userid,
                userdetails:req.session.userdetails,
                data:result,
                notification: req.session.notification
            })
                    
                }else{
                    res.send("Sorry book not available")
                }
        
    
    })
})

app.get('/contact',function(req,res){
    res.render('contact.hbs',{
        layout: 'main.hbs',
        title: "Contact Us",
        username: req.session.username,
        notification: req.session.notification,
        userid: req.session.userid,
        userdetails: req.session.userdetails,
        loggedin: req.session.loggedIn,
        style: "contact.css"
    })
})

app.get('/sell',function(req,res){
    if(res.session.loggedIn){
        res.render('sell.hbs',{
            layout: 'main.hbs',
            title: "Sale of Books here",
            notification: req.session.notification,
            userid: req.session.userid,
            loggedin: req.session.loggedIn,
            userdetails: req.session.userdetails,
        })

    }else{
        res.render('sell.hbs',{
            layout:'main.hbs',
            title:"Sale of Books here",
        })
    }    
            
   
})

app.get('/about',function(req,res){
    res.render('about.hbs',{
        layout: 'main.hbs',
        title: "About Us",
        notification: req.session.notification,
        userid: req.session.userid,
        loggedin: req.session.loggedIn,
        userdetails: req.session.userdetails,
        username: req.session.username,
    })
})

app.get('/terms',function(req,res){
    res.render('terms.hbs',{
        layout: 'main.hbs',
        title: "Terms and Conditions",
        notification: req.session.notification,
        userid: req.session.userid,
        loggedin: req.session.loggedIn,
        userdetails: req.session.userdetails,
        username: req.session.username,
    })
})

app.get('/privacy',function(req,res){
    res.render('privacy.hbs',{
        layout: 'main.hbs',
        title: "privacy",
        notification: req.session.notification,
        userid: req.session.userid,
        loggedin: req.session.loggedIn,
        userdetails: req.session.userdetails,
        username: req.session.username,
    })
})

app.get('/cart', function (req, res) {
    res.render('cart.hbs', {
        userid: req.session.userid,
        userdetails: req.session.userdetails,
        username: req.session.username,
        loggedin: req.session.loggedIn,
        title: "Your cart",
    })
})

// End Routes Section

// To Upload data

app.get('/form', function (req, res) {
    res.sendFile(__dirname + '/forms/form.html')
});

// Curd operation for Book Upload

app.post('/details',upload.single('picture'),function(req,res,next){
    cloudinary.uploader.upload(req.file.path, function(error,result){
        var data={
            name:req.body.name,
            author:req.body.author,
            price:req.body.price,
            category:req.body.category,
            count:req.body.count,
            ISBN:req.body.ISBN,
            variation:req.body.variation,
            imagepath:result.secure_url

        }
        db.collection('bookdetails').insertOne(data, function(error,result){
            if (error) throw error
            res.send("inserted")
        })
    })
})

// End Uploading books

// Reading Section

app.get('/getbooks' ,function(req,res){
    db.collection('bookdetails').find({}).toArray( function(error,result){
        if (error) throw (error)
        if(result.lenght>0){
            res.render('book.hbs',{
                title:"example",
                style:"books.css",
                loggedIn:req.session.loggedIn,
                data:result
            })
        }else{
            res.send("Sorry Books are not Available")
        }


    })    
})

app.put('/updatebooks',function(req,res){
    db.collection('bookdetails').updateOne({_id:require('mongodb').ObjectId(req.query.id)},{$set:{"name":req.query.name}}, function(error,result){
        if (error) throw error
        res.json(result)
    })
});

app.delete('/deletebooks',function(req,res){
    db.collection('bookdetails').deleteOne({_id:require('mongodb').ObjectId(req.query.id)}, function(error,result){
        if (error) throw error
        res.json(result)
    })
});

// End Crud operations

// Started Categores Section

app.get('/category/:category' ,function(req,res){
    db.collection('bookdetails').find({"category":req.params.category}).toArray( function(error,result){
        if (error) throw (error)
        if(result.lenght>0){
            res.render('book.hbs',{
                style:"../book.css",
                data:result,
                layout: 'main.hbs',
                notification: req.session.notification,
                userid: req.session.userid,
                loggedin: req.session.loggedIn,
                userdetails: req.session.userdetails,
                username: req.session.username,
            })

        }else{
            res.send("Sorry no books are available under this category")

        }

    })
    
})

// End category Section

// Get all Books

app.get('/details',function(req,res){
    res.render('details.hbs',{
        layout:"main.hbs",
        title:"Books.js",
        script:"book.js",
        style:"detail.css"  // here some thing wrong
    })
})


// End this

// Sale book

app.post('/sell',upload.single('picture'),function(req,res){
    if (req.session.loggedIn == true) {
        cloudinary.uploader.upload(req.file.path, function(error,result){
            var data={
                email:req.body.email,
                name:req.body.name,
                author:req.body.author,
                price:req.body.price,
                category:req.body.category,
                count:req.body.count,
                ISBN:req.body.ISBN,
                variation:req.body.variation,
                imagepath:result.secure_url

            }
            db.collection('sell').insertOne(data, function(error,result){
                if (error) throw error
                res.render("feedback.hbs",{
                    layout:'main.hbs',
                    loggedIn:req.session.loggedIn,
                    error:"Thanks for selling And Give some feedback",
                })
     
            })
        });
    
    }else{
        res.redirect('/login')

    }
    
});

// End sell book

// Search Section Start
app.get('/search/:name' ,function(req,res){
    db.collection('bookdetails').find({"name":req.params.name}).toArray( function(error,result){
       
        if(result.lenght>0){
            res.render('search/searchdata.hbs',{
                style:"../book.css",
                data:result,
                layout: 'main.hbs',
                notification: req.session.notification,
                loggedin: req.session.loggedIn,
                username: req.session.username,
            })

        }else{
            res.render("search/searcherror.hbs",{
                layout:'main.hbs',
                style:"../book.css",
                username: req.session.username,
                loggedin: req.session.loggedIn,
                error: "Oops it not available!!",
            })

        }

    })
    
})

// Search bar Section End


// Details Section Start

app.get('/details/:id', function(req,res){
    db.collection('bookdetails').find({"_id":require('mongodb').ObjectId(req.params.id)}).toArray(function(error,result){
        if(result.length>0){
            res.render('details/bookdetails.hbs',{
                layout:'main.hbs',
                style:'../book.css',
                title:'details',
                loggedIn:res.session.loggedIn,
                username:req.session.username,
                userid:res.session.userid,
                userdetails:req.session.userdetails,
                data:result,
                notification: req.session.notification,
            })

        }
    })
    
});    

// Details sectio end

// Details Part Start

app.put('/deleteproduct/:deleteid', function (req, res) {
    var deleteid = req.params.deleteid
    
    db.collection('users').updateOne({ _id: require('mongodb').ObjectId(userid) }, { $pull: { "cart": { _id: require('mongodb').ObjectId(deleteid) } } }, function (error, result) {
        if (error) throw error;
        res.json('deleted')
    })

});

// Details Part End

// Add book
app.post('/addbook/:cartid', function (req, res, next) {
    if (req.session.loggedIn == true) {
        var id = req.params.cartid
        var currentuser = req.session.username
        db.collection('bookdetails').findOne({ _id: require('mongodb').ObjectId(id) }, function (error, result) {
            if (result) {
                var bookresult = result
                db.collection('users').findOne({ $and: [{ _id: { $eq: userid } }, { cart: { $elemMatch: { _id: bookresult._id } } }] }, function (error, result) {
                    if (result) {
                        // console.log(bookresult._id)
                        // console.log(result)
                        res.send("Already in Cart")
                    } else {
                        bookresult.quantity = 1
                        // console.log(bookresult)
                        db.collection('users').updateOne({ _id: userid }, { $push: { cart: bookresult } }, function (error, result) {
                            if (error) throw error
                            res.send('inserted')
                        })
                    }
                })
            } else {
                res.send("Invalid")
            }
        })
    } else {
        res.send('Do login')
    }
})

 
// user cart

app.get('/cart/usercart', function (req, res, next) {
    if (req.session.loggedIn == true) {
        var total = 0, quantity = 0;
        db.collection("users").findOne({ _id: userid }, function (err, result) {
            if (err) throw error
            if (result) {
                var cart=result.cart
                if(cart.lenght>0){
                    for(var i=0; i<cart.lenght;i++){
                        quantity=quantity+parseInt(cart[i].quantity)
                        total += parseInt(cart[i].price)*parseInt(cart[i].quantity)
                    }
                    req.session.total = total
                    req.session.notification=quantity
                    res.render('cart.hbs',{
                        data:cart,
                        total: req.session.total,
                        layout: 'main.hbs',
                        username: req.session.username,
                        loggedin: req.session.loggedIn,
                        notification: req.session.notification,
                        userid: req.session.userid,
                        userdetails: req.session.userdetails,
                    })


                }else{
                    req.render('feedback.hbs',{
                        layout: 'main.hbs',
                        error: "Cart is Empty",
                        userid: req.session.userid,
                        userdetails: req.session.userdetails,
                        username: req.session.username,
                        notification: req.session.notification,
                        loggedin: req.session.loggedIn

                    })
                }
            }
        })

    }else{
        res.redirect('/login')
    }    

})
// end cart 

app.put("/book/:quantity/:id", function (req, res) {
    db.collection('users').updateOne({ $and: [{ cart: { $elemMatch: { _id: require('mongodb').ObjectId(req.params.id) } } }, { _id: require('mongodb').ObjectId(userid) }] }, { $set: { "cart.$.quantity": req.params.quantity } }, function (error, result) {
        if (error) throw error;
        res.json('Updated')
    })
});

// update profile section

app.post('/updateprofile/:data', function (req, res) {
    var updatedetails = JSON.parse(req.params.data)
    var updatedetails = {
        name: updatedetails.name,
        emailid: updatedetails.emailid,
        password: updatedetails.password,
        confirmpassword: updatedetails.password,
        phonenumber: updatedetails.phonenumber
    }
   
    db.collection('users').updateOne({ _id: require('mongodb').ObjectId(userid) }, { $set: updatedetails }, function (err, result) {
        if (err) throw err;
        req.session.userdetails = updatedetails;
        res.json('updated')
    })
})

// // update profile end

// useroders 

app.get('/delivery', function (req, res) {
    if (req.session.loggedIn) {
        res.render('delivery', {
            userid: req.session.userid,
            userdetails: req.session.userdetails,
            username: req.session.username,
            address: req.session.address,
            loggedin: req.session.loggedIn,
            notification: req.session.notification,
            layout: 'main.hbs',
        })
    } else {
        res.redirect('/login')
    }
})


// user order end

app.get('/userorders', function (req, res) {
    if (req.session.loggedIn) {
        db.collection('users').findOne({ _id: userid }, function (err, result) {
            if (err) throw err
            if (result.orders.length > 0) {
                var ordersData = result.orders
                var price = result.orders.price
                var orderData=result.address.orderData
                const total = (ordersData) => {
                    return ordersData.reduce((total, item) => total + parseInt(item.price), 0)
                }
                var Total = total(ordersData)
                req.session.Total = Total
                req.session.orderData=orderData
               
                res.render('userorders', {
                    ordersData: ordersData,
                    orderTotal: req.session.Total,
                    layout: 'main.hbs',
                    orderData:req.session.orderData,
                    userdetails: req.session.userdetails,
                    username: req.session.username,
                    notification: req.session.notification,
                    loggedin: req.session.loggedIn,
                })
            }else{
                res.render('feedback.hbs', {
                    layout: 'main.hbs',
                    error: "No Orders",
                    userid: req.session.userid,
                    userdetails: req.session.userdetails,
                    username: req.session.username,
                    notification: req.session.notification,
                    loggedin: req.session.loggedIn
                })
            }
        })
    }else{
        res.redirect('/login')
    }
})

// user order end

app.put('/deleteorderproduct/:deleteid', function (req, res) {
    var deleteid = req.params.deleteid
   
    db.collection('users').updateOne({ _id: require('mongodb').ObjectId(userid) }, { $pull: { "orders": { _id: require('mongodb').ObjectId(deleteid) } } }, function (error, result) {
        if (error) throw error;
        res.json('canceled')
    })

});

app.post('/buyproduct/:data', function (req, res) {
    if (req.session.loggedIn) {
        var data = JSON.parse(req.params.data)
        const { name, mobilenumber, pincode, landmark, town, state, orderData } = data
        var address = { name, mobilenumber, pincode, landmark, town, state, orderData }
        db.collection("users").findOne({ _id: userid }, function (err, result) {
            if (err) throw error
            if (result) {
                var cart = result.cart
                var myOrders = result.orders
                db.collection('users').updateOne({ _id: userid }, { $set: { orders: [...myOrders, ...cart], address: address } }, function (error, result) {
                    if (error) throw error
                    if (result) {
                        db.collection('users').updateOne({ _id: userid }, { $pull: { cart: { $exists: true } } }, function (error, result) {
                            if (error) throw error
                            req.session.notification = 0
                            res.json({
                                success: "Ordered successfully"
                            })
                        })
                    }
                })
            }
        })
    } else {
        res.redirect('/login')
    }
})

app.post('/contactdata/:data', function (req, res) {
    var data = JSON.parse(req.params.data)
    db.collection('contactinfo').insertOne(data, function (err, result) {
        if (err) throw err
        if (result) {
            res.json({
                success: "Thanks for feedback+"
            })
        }
    })
})
app.get("/:name/logout", function (req, res) {
    req.session.destroy();
    res.redirect("/");
});






app.listen(4000,()=>console.log("server is runnung"));