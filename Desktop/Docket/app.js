// jshint esversion:6
const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const mongoose = require("mongoose");


app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item",itemsSchema);
const item1 = new Item({
  name: "Welcome to Docket!"
});

const item2 = new Item({
  name: "Hit the + button to add a new Item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an Item."
});


const defaultItems= [item1, item2, item3];


app.get("/",function(req,res)
{

  var today = new Date();

var options = {
  weekday: "long",
  day: "numeric",
  month: "long"
};
  var day = today.toLocaleDateString("en-US",options);


Item.find({},function(err,foundItems)
{
  if(foundItems.length === 0)
  {
    Item.insertMany(defaultItems,function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Successfully saved default items");
    }
    });
  res.redirect("/");
}
  else{
    res.render("list",{listTitle: day, news: foundItems});
  }
});


});





app.post("/",function(req,res){

  const itemName = req.body.newItem;

const item = new Item({
  name: itemName
});

item.save();
res.redirect("/");
});


app.post("/delete",function(req,res){
  const checked = (req.body.checkbox);

  Item.findByIdAndRemove(checked,function(err){
  if(!err)
  {
    console.log("Successfully deleted");
    res.redirect("/");
  }
})
});



app.get("/work",function(req,res){
  res.render("list",{listTitle: "Work List",news: workItems});
});


app.get("/about",function(req,res){
  res.render("about");
});






app.listen(3000,function()
{
  console.log("server up");
});
