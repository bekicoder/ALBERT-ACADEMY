const express=require("express")
const app=express();
const path=require("path");
//const form=require("formidable");
const bcrypt=require("bcryptjs")
const {Pool}=require("pg");
const http=require("http")
const {Server}=require("socket.io")
const server=http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*", // allow all devices on the network
  },
});

const db=new Pool({
  host:"localhost",
  user:"bekam",
  database:"albert_academy",
  password:"pass",
  port:5432
});

db.connect((err)=>{
  if(err) console.error("db connection error: "+err)
});

app.use(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join(__dirname,"views")));


app.use(express.json());
app.use(express.urlencoded({extended:true}))
//serve index.html

// Import the converter

app.post('/add_news',(req,res)=>{
  
  const {news,head}=req.body
  
  db.query("INSERT INTO news(news,heading) values (?,?)",[news,head],(err,results)=>{
    if(err) {
      console.error("error inserting news:"+err)
      return;
    }
    else{
      console.log("news inserted succesfully")
    res.send('<script>alert("Submitted successfully"); window.location.href="/cms.html";</script>');
    }
      
  })
})
//show news
app.get("/show_news",(req,res)=>{
  db.query('select * from news',(err,results)=>{
  if(err){console.error(err); return;}
  res.json(results)
  })
  
})
// create group
app.post('/add_group',(req,res)=>{
  const { g_c_name } = req.body[0];
  const {g_c_pass}=req.body[0]
const safeGroupName = g_c_name.trim().toLowerCase(); 
const newsafeGroupName=safeGroupName.replace(/ /g,"_")
const hased_g_pass=bcrypt.hashSync(g_c_pass,10)
// cheack group name exists
db.query(`SELECT EXISTS (SELECT 1 FROM groups WHERE group_names = ?) AS name_exists`,[newsafeGroupName],(err,results)=>{
    if(err){
      console.error(err)
      return;}
     const result=Number(results[0].name_exists) 
    if(result===1){
      res.send('exists')
      return;
    } else if(result===0){
      res.send("not_exist")
    }
    
   const tablename = `${newsafeGroupName}_group_members`;
// insert group name into groups
  db.query('INSERT INTO groups(group_names,group_password) values (?,?)',[newsafeGroupName,hased_g_pass])
  db.query(`create table ${tablename}(id int auto_increment primary key,
  name varchar(255),
  grade varchar(255),
  email varchar(255),
  id_no varchar(255)
   )`,(err,results)=>{
     if(err) {
       console.error(err)
       return;
     }
     
    // insert group members
   req.body.forEach(member=>{
 const {name,grade,email,id}=member
 db.query(`INSERT INTO ${tablename}(name,grade,email,id_no) values (?,?,?,?)`,[name,grade,email,id],(err,results)=>{
   if(err){
     console.error('Error adding member: '+err)
   }
 })
   })
     
   })
  })


})
// add club
app.post('/add_club',(req,res)=>{
  const {g_c_name}=req.body[0];
  const {g_c_pass}=req.body[0]
  const safeClubName=g_c_name.trim().toLowerCase()
  const hased_c_pass=bcrypt.hashSync(g_c_pass,10)
  db.query(`SELECT EXISTS (SELECT 1 FROM clubs WHERE club_names = ?) AS name_exists`,[safeClubName],(err,results)=>{
     if(err){
      console.error(err)
      return;}
     const result=Number(results[0].name_exists) 
        if(result===1){
      res.send('exists')
      return;
    } else if(result===0){
      res.send("not_exist")
    }
  const tablename = `${safeClubName}_club_members`;
  const chatTableName=`${safeClubName}_chats`
  //insert group name into clubs
  db.query('INSERT INTO clubs(club_names,club_password) values (?,?)',[safeClubName,hased_c_pass])
  db.query(`create table ${tablename}(id int auto_increment primary key,
  club_name varchar(100),
  name varchar(255),
  grade varchar(255),
  email varchar(255),
  id_no varchar(255))`,(err,results)=>{
     if(err){
       console.error(err)
       return;
     }
     // insert members
       req.body.forEach(member=>{
    const {name,grade,email,id}=member;
    db.query(`INSERT INTO ${tablename}(name,grade,email,id_no) values (?,?,?,?)`,[name,grade,email,id],(err,results)=>{
      if(err) console.error('Error adding member: '+err)
    })
  }) 
   })
 // create message table 
   db.query(`create table ${chatTableName}(id int auto_increment primary key,
  id_no varchar(255),
  message TEXT
   )`,(err,results)=>{
     if(err){
       console.error(err)
       return;
     }
     })
})
})

//update table
app.post('/update_g_c', (req, res) => {
  const updates = [];
  const values = [];

  // Sanitize input: lowercase and remove non-alphanumeric chars
  const tablename = req.body.g_c_name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
  const prev_id = req.body.prev_id;
  const group_club = req.body.group_club.trim().toLowerCase();

  const G_C_name = `${tablename}_${group_club}_members`;
  const s = `${group_club}s`;

  let g_c_type = "";
  if (group_club === "group") {
    g_c_type = "group_names";
  } else if (group_club === "club") {
    g_c_type = "club_names";
  } else {
    res.send(`
      <script>
        alert("Invalid group or club type");
        window.location.href = "/";
      </script>
    `);
    return;
  }

  // Check if group/club exists
  db.query(
    `SELECT EXISTS (SELECT 1 FROM ${s} WHERE ${g_c_type} = ?) AS name_exists`,
    [tablename],
    (err, results) => {
      if (err) {
        console.error(err);
        res.send("Database error");
        return;
      }

      const exists = Number(results[0].name_exists);
      if (exists === 0) {
        res.send(`
          <script>
            alert("${group_club} name doesn't exist");
            window.location.href = "/";
          </script>
        `);
        return;
      }

      // Check if member exists
      db.query(
        `SELECT EXISTS (SELECT 1 FROM ${G_C_name} WHERE id_no = ?) AS member_exist`,
        [prev_id],
        (err, results) => {
          if (err) {
            console.error(err);
            res.send("Database error");
            return;
          }

          const memberExists = Number(results[0].member_exist);
          if (memberExists === 0) {
            res.send(`
              <script>
                alert("Member doesn't exist. Please check the entered previous ID.");
                window.location.href = "/";
              </script>
            `);
            return;
          }

          // Build updates
          if (req.body.name) updates.push("name = ?"), values.push(req.body.name);
          if (req.body.grade) updates.push("grade = ?"), values.push(req.body.grade);
          if (req.body.email) updates.push("email = ?"), values.push(req.body.email);
          if (req.body.new_id) updates.push("id_no = ?"), values.push(req.body.new_id);

          if (updates.length === 0) {
            res.send(`
              <script>
                alert("No fields to update");
                window.location.href = "/";
              </script>
            `);
            return;
          }

          // Add prev_id for WHERE clause
          values.push(prev_id);

          // Execute update
          db.query(
            `UPDATE ${G_C_name} SET ${updates.join(", ")} WHERE id_no = ?`,
            values,
            (err, result) => {
              if (err) {
                console.error(err);
                res.send("Error updating member");
                return;
              }

              res.send(`
                <script>
                  alert("Member updated successfully");
                  window.location.href = "/";
                </script>
              `);
            }
          );
        }
      );
    }
  );
});

// see group or club info
app.get('/see_g_c_info',(req,res)=>{
 const group_club=req.query.group_club
 const g_c_name=req.query.g_c_name.trim().toLowerCase()
 const name=req.query.g_c_name.trim().toLowerCase()+"_"+group_club+"_members"
 const tablename=req.query.group_club+"s"
 const columnName=group_club+"_names"
 db.query(`SELECT EXISTS(select 1 from ${tablename} WHERE ${columnName} = ?) AS name_exists`,[g_c_name],(err,results)=>{
   const cheack=Number(results[0].name_exists)
   if(cheack===0){
     res.json([{EXISTS:0,}]);
  return;
   }
   db.query(`select * from ${name}`,(err,results)=>{
     res.json(results)
   })
 })
})

// autontcate Member
app.get("/authenticate_member",(req,res)=>{
  
  let tablename=""
  const id = req.query.id
  const password=req.query.password
  const type_name_col=req.query.type+"_names"
  let pass_col_name=req.query.type+"_password"
  const type=req.query.type+'s'
  if (req.query.type==="club"){
     tablename=`${req.query.name}_club_members`;
  }else if(req.query.type==="group"){
     tablename=`${req.query.name}_group_members`;
  }
  db.query(`SELECT EXISTS(select 1 from ${tablename} WHERE id_no = ?) AS name_exists`,[id],(err,results)=>{
    if(err){
   console.error(err); return;}
    const exist=Number(results[0].name_exists)
    if(exist===0){
      res.json({exists:0})
    }else if(exist===1){
      db.query(`select * from ${type} WHERE ${type_name_col}=?`,[req.query.name],async(err,results)=>{
if(err){
  console.error(err); 
        return;}
        const isMatch= await bcrypt.compare(req.query.password,results[0][pass_col_name])
        if(isMatch===true){
          res.json({exists:1,password:"correct"})
        }
        else if(isMatch===false){
        res.json({exists:1,password:"incorect"})  
        }
      })
      
    }
  })
})

// send cod confirm
app.get("/cod_sender",(req,res)=>{
  let tablename=""
  const id = req.query.id
  if (req.query.type==="club"){
     tablename=`${req.query.name}_club_members`
  }else if(req.query.type==="group"){
     tablename=`${req.query.name}_group_members`
  }
  db.query(`select * from ${tablename} WHERE id_no = ?`,[id],async(err,results)=>{
    if(err){ console.error; return;}
    // Generate 6-digit confirmation code
 res.json({message:"sent",text:results[0].email})

  })
})


// real time chat app
io.on("connection",(socket)=>{
  console.log("New user connected successfully")
const {room,id,type}=socket.handshake.query
const tablename=`${room}_chats`
if(room){
  socket.join(room)
}
socket.on("chat message",(msg)=>{
  io.to(room).emit("chat message",msg) 
  db.query(`INSERT INTO ${tablename}(id_no,message) values (?,?)`,[id,msg],(err,results)=>{
    if(err){console.error(err); return;}
    
  })
 });
socket.on("disconnect",()=>{
  console.log("user disconnected")
}) 
})

// loadeMessages
app.get("/loadMessags",(req,res)=>{
  const tablename=`${req.query.name}_chats`
  db.query(`SELECT * from ${tablename}`,(err,results)=>{
    if(err){console.error(err); return;}
    res.json(results)
  })
})

app.get('/explore_CG',(req,res)=>{
const tablename=req.query.type
  db.query(`select * from ${tablename}s`,(err,results)=>{
  if(err){console.error(err);
  return;}
  console.log("served")
  res.json(results)
  })
  
})


server.listen(8000, () => {
  console.log("Server running at http://localhost:3000");
});
