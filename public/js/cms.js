const body=document.querySelector("body")
const bg = document.createElement("div");
const modal = document.createElement("div");
const login_btn = document.createElement("button");
const form = document.createElement("form");
bg.classList.add(
"bg",
"w-screen",
"h-screen",
"flex",
"flex-row",
"justify-center",
"fixed",
"absolute",
"top-0",
"bg-white",
);
modal.classList.add(
"w-[300px]",
"box-border",
"mx-4",
"my-auto",
"h-48",
"bg-white",
"flex",
"flex-col",
"items-center",
"rounded-3xl",
"justify-center",
"shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
);
login_btn.classList.add(
"h-14",
"w-32",
"rounded",
"bg-gradient-to-br",
"from-indigo-600",
"to-purple-500",
"font-extrabold",
"text-white",
"border-none",
"mx-auto"
);
login_btn.textContent="Log in"
form.classList.add("flex", "flex-col", "items-center", "gap-4");
const password_input = document.createElement("input");
password_input.setAttribute("autocomplete", "new-password");
  password_input.setAttribute("autocorrect", "off");
  password_input.setAttribute("autocapitalize", "off");
  password_input.setAttribute("spellcheck", "false");
password_input.type = "password";
password_input.name = "password";
password_input.required = true;
password_input.placeholder = "password";
password_input.classList.add(
"border",
"rounded",
"border-black",
"p-2"
);

form.addEventListener("submit",(e)=>{
  e.preventDefault()
  if(password_input.value.trim() ==="pass"){
  bg.classList.add("hidden")  
  alert("logen in")
  }
  else{
    alert("password don't correct")
  }

})
form.appendChild(password_input)
form.appendChild(login_btn)
modal.appendChild(form)
bg.appendChild(modal)
body.appendChild(bg)
//  elements
const collect=document.getElementById("collect")
const add_g_c=document.getElementById("add_g_c")
const create=document.getElementById("create")
// collect  members
const collected=[]
collect.addEventListener('click', (e) => {
  if (!add_g_c.checkValidity()) {add_g_c.reportValidity();
    return;}

  e.preventDefault(); // Only prevent if valid

  const formdata = new FormData(add_g_c);
  const data = Object.fromEntries(formdata.entries());
  collected.push(data);
document.querySelectorAll('.hide').forEach(el=>{
  el.disabled=true;
  el.classList.add("invisible")
})
  document.getElementById("cheack").textContent = JSON.stringify(collected);
  add_g_c.reset();
  if(collected[0].group_club==="group"){
    document.getElementById("display_g_name").textContent = `Group Name: ${collected[0].g_c_name}`;
  }else{
    document.getElementById("display_g_name").textContent = `Club Name: ${collected[0].g_c_name}`;
  }
});
// create Group or Club
create.addEventListener("click",async(e)=>{
  e.preventDefault()
  if(collected.length <=1){
    alert(`Add at least two members current member amount is ${collected.length} `)
    return;
  }
  else if(collected[0].group_club==="group"){
    const response=await fetch('/add_group',{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(collected)
    })
    const result=await response.text()
    if(result==='exists'){
      alert("Group name already exists please enter other name")
      window.location = "/cms.html";
      return;
    }
        else if(result==="not_exist"){
      alert("New group created succesfully")
      window.location = "/cms.html";
    }
  }
  else if(collected[0].group_club==="club"){
    const response=await fetch('/add_club',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(collected)
  })
  const result=await response.text()
    if(result==='exists'){
      alert("Club name already exists please enter other name")
      window.location = "/cms.html";
    }
    else if(result==="not_exist"){
      alert("New Club created succesfully")
      window.location = "/cms.html";
    }
  }
  
})

// see Group or Club info(members)
const info_btn=document.querySelector(".info_btn")
const info_form=document.querySelector(".info_form")
const info_table_body=document.getElementById("info_table_body")
info_btn.addEventListener('click',async(e)=>{
  info_table_body.innerHTML=""
  if(!info_form.checkValidity()){
    info_form.reportValidity();
    return;
  }
  e.preventDefault()
  const fd=new FormData(info_form)
  const data=Object.fromEntries(fd.entries())
  const g_c_name=data.g_c_name
  const group_club=data.group_club
  
  const table_container=document.querySelector(".info_table_container")
 const info_table=document.querySelector(".info_table")
  const response=await fetch(`/see_g_c_info?g_c_name=${encodeURIComponent(g_c_name)}&group_club=${encodeURIComponent(group_club)}`)
  const result=await response.json()
  if(result[0].EXISTS===0){
    alert(group_club+" name dosen't exist")
    table_container.classList.add("hidden")
    return;
  }
  let no=0
  
  result.forEach(member=>{
    table_container.classList.remove("hidden")
    no += 1
    const tr=document.createElement('tr')
    const td1=document.createElement("td")
    td1.classList.add("td","sticky","left-0")
    const td2=document.createElement("td")
    td2.classList.add("td")
    const td3=document.createElement("td")
    td3.classList.add("td")
    const td4=document.createElement("td")
    td4.classList.add("td")
    const td5=document.createElement("td")
    td5.classList.add("td")
    tr.classList.add("hover:bg-gray-50")
td1.textContent=no
td2.textContent=member.name
td3.textContent=member.grade
td4.textContent=member.email
td5.textContent=member.id_no
tr.appendChild(td1)
tr.appendChild(td2)
tr.appendChild(td3)
tr.appendChild(td4)
tr.appendChild(td5)
info_table_body.appendChild(tr)
  const td=document.querySelectorAll(".td")
  td.forEach(tdata=>{
  tdata.classList.add(
  "border",
  "border-gray-300",
  "px-4",
  "py-2",
  "whitespace-nowrap",
  "bg-white"
); })
  })
  
  
  alert(JSON.stringify(result))
})
