const { faker } = require('@faker-js/faker');
const mysql=require("mysql2");
const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"))
let port=8080;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:'saibaba-123'
});
let getRandomUser = ()=> {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
]
};

//home route
app.get("/",(req,res)=>{
  let q=`SELECT count(*) from user`;
  try{
    connection.query(q,(err,result)=>{
      if (err) throw err;
      let count=result[0]["count(*)"]
      res.render("home.ejs",{count});
    });
  }catch (err){
    console.log(err);
    res.send("Some error in DB");
  }
});
//show route
app.get("/user",(req,res)=>{
  let q=`select * from user`;
  try{
    connection.query(q,(err,users)=>{
      if (err) throw err;
      res.render("showusers.ejs",{users});
    });
  }catch (err){
    console.log(err);
    res.send("some thing happend");
  }

})

app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`select * from user where id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if (err) throw err;
      let user=result[0];
      res.render("edit.ejs",{user});
    });
  }catch (err){
    console.log(err);
    res.send("some thing happend");
  }
});
//update (DB) ROute
app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let {password:formPass,username:newUsername}=req.body;
  let q=`select * from user where id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if (err) throw err;
      let user=result[0];
      if (formPass!=user.password){
        res.send("WRONG PASSWORD");
      }
      else{
        let q2=`Update user set username='${newUsername}' where id='${id}'`;
        connection.query(q2,(err,result)=>{
          if (err) throw err;
          res.redirect("/user");
        })
      }
    });
  }catch (err){
    console.log(err);
    res.send("some thing happend");
  }
});
app.listen(port,()=>{
  console.log("server is Working");
});


