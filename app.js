const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/restaurentDB", {useNewUrlParser:true, useUnifiedTopology:true});

const itemSchema = {name: String,price: Number};
const restaurentSchema = {
  name : String,
  phone: String,
  address: String,
  description: String,
  menu : [itemSchema]
}
const Restaurent = mongoose.model("Restaurent", restaurentSchema);

const orderSchema ={name:String,phone:String,address:String,restaurent:String,
                    dateTime:String,items:[String]};
const Order =mongoose.model("Order",orderSchema);

app.get("/", function(req,res){
  Restaurent.find({},function(err, docs){
    if(!err){
      res.render("home", {restaurents: docs})
    }
  })
});

app.get("/restaurent/:name",function(req,res){
  const name = req.params.name;
  Restaurent.findOne({name:name},function(err,doc){
    if(!err){
        res.render("restaurent",{restaurent:doc})
    }
  })
});

app.post("/orders", function(req,res){
  let tempOrderItems = req.body.selected.split("\r\n")
  let tempOrder = new Order({
    name :req.body.name,
    phone:req.body.mobile,
    address:req.body.address,
    restaurent:req.body.restName,
    dateTime: new Date().toLocaleString(),
    items:tempOrderItems
  })
  if(tempOrder.save()){
    res.render("confirmation")
  }
});

app.get("/a-orders",function(req,res){
  Order.find({}, function(err, docs){
    if(!err){
      res.render("orders", {orders:docs})
    }
  })
});

app.get("/a-restaurents", function(req,res){
  Restaurent.find({},function(err, docs){
    if(!err){
      res.render("adminRestaurents", {restaurents: docs})
    }
  })
})

app.get("/c-restaurent", function(req,res){
  res.render("createRestaurent")
})

app.post("/c-restaurent", function(req, res){
  console.log(req.body);
})

app.listen(3000, function(){
  console.log("Server running on Port 3000.")
});
