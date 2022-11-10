const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const _  = require("lodash");

// console.log(app);

//var todos = ["Buy food" ,"Cook food" , "Eat food"];


app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static("public"))


mongoose.connect("mongodb://localhost:27017/todolistDb" , {useNewUrlParser:true});
const itemsSchema = {
  name : String
}

const Item = mongoose.model("Item" , itemsSchema);
const item1 = new Item({
  name: "welcome to todo list"
});

const item2 = new Item({
  name :"This is item2"
});

const item3 = new Item({
  name: "This is item3"
});

const defaultArr = [item1 ,item2 , item3];

const listSchema = {
  name : String,
  items : [itemsSchema]
}

const List = mongoose.model("List" , listSchema);

app.get("/", function(req, res) {
  Item.find({} , function(err , foundItem){

    if(foundItem.length === 0){
      Item.insertMany(defaultArr , function(err){
          if(err){
            console.log(err);
          }else {
            console.log("Successfully added the data in DB");
            res.redirect("/");
          }
      });

    }else {
      res.render("list", {listTitle: "today",  newToDo: foundItem  })

    }

  })
})

app.get("/:cutomListName" , function(req, res){
  const customListName = _.capitalize(req.params.cutomListName);

  List.findOne({name:customListName} , function(err , findResult){
    if(!err){
      if(!findResult){
        //new list............
          const list = new List({
            name : customListName,
            items : defaultArr
          });
          list.save();
          res.redirect("/" + customListName);

      } else {
        //already exist just have to display

        res.render("list" ,{listTitle: findResult.name,  newToDo: findResult.items  } );
      }
    }
});

});



  app.post("/" , function(req , res){

    const todo = req.body.todo;
    const list  = req.body.list;

    const item  =  new Item ({
      name : todo
    })

    if(list === "Today"){

          item.save();
          res.redirect("/");
    }else {
      List.findOne({name:list} , function(err , findList){
        findList.items.push(item);
        findList.save();
        res.redirect("/" + list);
      })
    }

  })


app.post("/delete" , function(req , res){
  const checkedId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){

      Item.findByIdAndRemove(checkedId , function(err){
        if(!err){
          console.log("Successfully deleted item form the DB");
            res.redirect("/");
        }
      });
  } else {
    List.findOneAndUpdate({name :listName} ,{$pull:{items:{_id:checkedId}}} , function(err , foundList){
      if(!err){
        res.redirect("/" + listName);
      }
    });
  }



});
app.get("/about" , (req , res) =>{
  res.render("about");
})



app.listen(3000, function() {
  console.log("The server is running on port 3000");
})









  //
  // var today = new Date();
  //
  // var options = {
  //   weekday: "long",
  //   day : "numeric",
  //   month: "long"
  // };
  //
  // var day = today.toLocaleDateString("en-US" ,options);

  // res.render("list", {listTitle: "today",  newToDo: todos  })



















  //
  //
  // var today = new Date();
  // var currentDay = today.getDay();
  // var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Friday", "Saturday"];
  //
  // var day = "";
  //
  //
  // switch (currentDay) {
  //   case 0:
  //     day = "Sunday"
  //     break;
  //
  //   case 1:
  //     day = "Monday"
  //     break;
  //
  //   case 2:
  //     day = "Tuesday"
  //     break;
  //
  //   case 3:
  //     day = "Wednesday"
  //     break;
  //
  //   case 4:
  //     day = "Thirsday"
  //     break;
  //
  //   case 5:
  //     day = "Friday"
  //     break;
  //
  //   case 6:
  //     day = "Saturday"
  //     break;
  //   default:
  //     console.log("Error you current day is not between Sunday to Saturday");
  //
  // }
  //
