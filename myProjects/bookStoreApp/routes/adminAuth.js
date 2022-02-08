const Router = require('express').Router
const router = Router()
var cloudinary = require('../config/cloudinary')
var upload = require('../config/multer')
require('dotenv').config()
// redirecting to admin page
router.get('/admin', function (req, res) {
    res.render('adminlogin')
})
// authentication of Admin
router.post('/adminauth',(req,res)=>{
    var db = req.app.locals.db
    var flag = false;
    db.collection('admin').find({}).toArray((err,result)=>{
        for (var i = 0; i < result.length;i++){
            if (result[i].username==req.body.username && result[i].password == req.body.password){
                flag = true;
                adminid = result[i]._id;
                username = result[i].username;
                adminDetails = result[i]
            }
        }
        if (flag ==true){
            req.session.adminloggin = true;
            req.session.adminname = username;
            req.session.userid = adminid;
            req.session.adminDetails=adminDetails;
            db.collection('users').find({}).toArray((err,data)=>{
                if (err){
                    throw err
                }
                if (data.length>0){
                    req.session.usercount = parseInt(data.length)
                }
            })
            db.collection('users').find({}).toArray((err,data)=>{
                if(err)   throw err
                const userOrder = [];
                var orderLength =0;
                if (data.length>0){
                    for (var i = 0; i<data.length;i++){
                        if (data[i].orders.length){
                            orderLength=data[i].orderLength+orderLength;
                            const {_id,name,emailid,address,orders}=data[i]
                            userOrder.push({_id,name,emailid,address,orders})
                        }
                    }
                    req.session.orderQuantity = orderLength;
                    req.session.userOrder = userOrder
                }


            })
            db.collection('bookdetails').find({}).toArray((err,data)=>{
                    if (err) throw err;
                    if (data.length>0){
                        req.session.bookscount = parseInt(data.length)
                    }
                    req.session.adminDetails=adminDetails;
                    res.redirect('/dashboard')

            })
        }
        else{
            res.render('adminlogin',{
                errormsg:"Invalid Username or Password"
            })
        }
    })
})
router.get('/dashboard',(req,res)=>{
    var db = req.app.locals.db;
    if(req.session.adminloggin){
        db.collection('users').find({}).toArray((err,data)=>{
            if (err) throw err
            const userOrder = []
            var orderLength = 0;
            if(data.length>0){
                for(var i=0;i<data.length;i++){
                    if(data[i].orders.length){
                        orderLength=orderLength+data[i].orders.length;
                        const {_id,name,emailid,address,orders}=data[i]
                        userOrder.push({_id,name,emailid,address,orders})
                    }
                }
                req.session.orderQuantity = orderLength
            }
        })
        res.render('dashboard.hbs',{
            style:"dashboard.css",
            layout:"admin.hbs",
            useOrder: req.session.userOrder,
            adminname: req.session.adminname,
            userscount: req.session.userscount,
            bookscount: req.session.bookscount,
            notification: req.session.notification,
            adminDetails: req.session.adminDetails,
            orderQuantity: req.session.orderQuantity
        })
    }
    else{
        res.redirect('/admin')
    }
})
// categorywise find
router.get('/categorytype/:category',(req,res)=>{
    if (req.session.adminloggin){
        var db = req.app.locals.db;
        db.collection('bookdetails').find({"category":req.params.category}).toArray((err,data)=>{
            if (data.length>0){
                res.render('category',{
                    style:"categorytype.css",
                    layout:"admin.hbs",
                    data:data,
                    script:"category.js",
                    adminDetails:req.session.adminDetails,
                    category:req.session.category,
                    adminname:req.session.adminloggin
                })
            }
        })
    }
    res.redirect('/admin')
})
// to upload books
router.post('/addbook', upload.single('picture'), (req, res, next)=> {
    cloudinary.uploader.upload(req.file.path, (error, result)=> {
        if (req.session.adminloggin) {
            var db = req.app.locals.db
            var insertbook = {
                name: req.body.name,
                author: req.body.author,
                category: req.body.category,
                price: req.body.price,
                ISBN: req.body.ISBN,
                count: req.body.count,
                imagepath: result.secure_url
            }
            var category = insertbook.category
            req.session.category = category,
                db.collection('bookdetails').insertOne(insertbook, function (err, result) {
                    if (err) throw err;
                    req.session.category = category
                    res.redirect('/categorytype/' + category)
                })
        } else {
            res.redirect('/admin')
        }
    });
})
// to update books
router.post('/updatebook/:bookid', upload.single('picture'),  (req, res, next)=> {
    if (req.session.adminloggin) {
        var db = req.app.locals.db
        var updatebook = {
            name: req.body.name,
            author: req.body.author,
            category: req.body.category,
            quantity: req.body.quantity,
            price: req.body.price,
            ISBN: req.body.ISBN,
            count: req.body.count,
        }
        // console.log(updatebook)
        var category = updatebook.category
        req.session.category = category,
            db.collection('bookdetails').updateOne({ _id: require('mongodb').ObjectId(req.params.bookid) }, { $set: updatebook }, function (err, result) {
                if (err) throw err;
                req.session.category = category
                res.redirect('/categorytype/' + category)
            })
    } else {
        res.redirect('/admin')
    }
})
// to delete products
router.delete('/deleteproduct/:val',  (req, res)=> {
    var id = req.params.val
    // console.log(id)
    var db = req.app.locals.db;
    db.collection('bookdetails').deleteOne({ _id: require('mongodb').ObjectId(id) }, function (err, result) {
        if (err) throw err
        res.json('deleted')
    })
})
// to get bok details
router.get('/getdetails/:val',  (req, res) =>{
    if (req.session.adminloggin) {
        var id = req.params.val;
        var db = req.app.locals.db;
        db.collection("bookdetails").findOne({ _id: require('mongodb').ObjectId(req.params.val) },  (err, result)=> {
            if (err) throw err
            if (result) {
                res.render('updatebook.hbs', {
                    layout: 'admin.hbs',
                    adminDetails: req.session.adminDetails,
                    bookdetails: result
                })
            }
        })
    } else {
        res.redirect('/admin')
    }
})
// get admin details
router.get('/adminusers', (req, res) =>{
    if (req.session.adminloggin) {
        let db = req.app.locals.db;
        db.collection('admin').find({}).toArray((err, result) =>{
            if (err) throw err
            if (result.length > 0) {
                res.render('adminusers.hbs', {
                    adminusers: result,
                    layout: 'admin.hbs',
                    adminDetails: req.session.adminDetails,
                    script: 'adminusers.js',
                    style: 'adminusers.css'
                })
            }
        })
    } else {
        res.redirect('/admin')
    }
})
// to add new admin
router.post('/addadmin/:newadmin', function (req, res) {
    if (req.session.adminloggin) {
        var db = req.app.locals.db
        var data = JSON.parse(req.params.newadmin)
        db.collection('admin').insertOne(data, function (err, result) {
            if (err) throw err
            if (result) {
                res.json('successmessage')
            }
        })
    } else {
        res.redirect('/login')
    }
})
// to get orders
router.get('/orders',(req,res)=>{
    if (req.session.adminloggin){
        var db = req.app.locals.db
        db.collection('users').find({}).toArray((err,result)=>{
            if (err) throw err
            const useOrder=[]
            if (result.length>0){
                for (var i=0;i<result.length;i++){
                    if (result[i].orders.length){
                        const { _id, name, emailid, address, orders }=result[i]
                        userOrder.push({ _id, name, emailid, address, orders })

                    }
                }
                req.session.userOrder=userOrder
                res.render('orderquantity',{
                    layout: 'admin.hbs',
                    useOrders: req.session.userOrder,
                    adminname: req.session.adminname,
                    adminDetails: req.session.adminDetails
                })
            }
            else{
                res.render('feedback.hbs',{
                    layout: 'admin.hbs',
                    error: "No Orders",
                    adminDetails: req.session.adminDetails,
                    loggedin: req.session.adminloggin
                })
            }
        })
        

        
    }
    else{
        res.redirect('/admin')
    }
})
// to get queries
router.get('/query',(req,res)=>{
    if (req.session.adminloggin){
        var db = req.app.locals.db
        db.collection('contactinfo').find({}).toArray((err,result)=>{
            if (err) throw err
            if (result.length>0){
                res.render('query.hbs',{
                    layout:"admin.hbs",
                    adminDetails:req.session.adminDetails,
                    result:result
                })
            }
        })
        
    }
    else{
        res.redirect('admin')
    }
})
// to view user order cart
router.get('/:bookId/userOrderCart',(req,res)=>{
    if (req.session.adminloggin){
        var db = req.app.locals.db;
        var userOrder = req.session.userOrder;
        db.collection('users').find({_id:require('mongodb').ObjectId(req.params.bookId)},(err,result)=>{
            if (err) throw err
            if (result){
                res.render('useradmincart.hbs',{
                    layout:"admin.hbs",
                    result:result,
                    userOrder:req.session.userOrder,
                    adminDetails:req.session.adminDetails,
                    adminname:req.session.adminname
                })
            }
        })

    }
    else{
        res.redirect('/admin')
    }
})
// to update profile
router.post('updateprofile',(req,res)=>{
    if (req.session.adminloggin){
        var db =req.app.locals.db
        var updatedetails=req.body
        db.collection('admin').updateOne({_id:require('mongodb').ObjectId(adminid)},{$set:updatedetails},(err,result)=>{
            if (err) throw err
            if (result){
                req.session.adminDetails=updatedetails
                res.json({success:"updated"})

            }
        }
)}
else{
    res.redirect('/admin')
}
})
// to logout
router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/admin')
})
module.exports = router
