const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/restaurentDB", {useNewUrlParser:true, useUnifiedTopology:true});

const itemSchema = {name: String,price: String};
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

app.get("/contactus", function(req,res){
  res.render("contact")
})

app.get("/aboutus", function(req,res){
  res.render("about")
})

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
  let tempitemArray = [];
  for(let i=0;i<req.body.itemname.length;i++){
    let item = {
      name: req.body.itemname[i],
      price: req.body.itemprice[i]
    }
    if(req.body.itemname[i] != ''){
      tempitemArray.push(item);
    }
  }

  let tempRestaurent = new Restaurent({
    name:req.body.name,
    phone:req.body.mobile,
    address:req.body.address,
    description:req.body.description,
    menu:tempitemArray
  })
  tempRestaurent.save(function(err, msg){
    if(!err){
      res.redirect("/a-restaurents");
    }else{
      console.log(err);
    }
  })
})

app.get("/u-restaurent",function(req,res){
  let objId = req.query.updateItem;
  Restaurent.findOne({"_id":objId},function(err, doc){
    if(!err){
      res.render("updateRestaurent", {restaurent:doc})
    }
  })
});

app.post("/u-restaurent", function(req,res){
  let tempitemArray = [];
  for(let i=0;i<req.body.itemname.length;i++){
    let item = {
      name: req.body.itemname[i],
      price: req.body.itemprice[i]
    }
    if(req.body.itemname[i] != ''){
      tempitemArray.push(item);
    }
  }

  Restaurent.updateOne(
    {_id: req.body._id},
    { name:req.body.name,
      phone:req.body.mobile,
      address:req.body.address,
      description:req.body.description,
      menu:tempitemArray},
      {upsert: false },
      function(err){
        if(!err){res.redirect("/a-restaurents")}
        else{console.log(err)}
      }
    )
})

app.post("/d-restaurent",function(req,res){
  let objId = req.body.deleteItem;
  console.log(objId);
  Restaurent.deleteOne({"_id":objId},function(err, doc){
    if(!err){
      res.redirect("/a-restaurents")
    }
  })
});

app.listen(3000, function(){
  console.log("Server running on Port 3000.")
});
