const params=new URLSearchParams(window.location.search)
const name=params.get("g_c_name")
const type=params.get("type")
const id=params.get("id")
const input=document.querySelector('.message')
const send_btn=document.querySelector('.send_btn')
const chat_wrapper=document.querySelector('.chat_wrapper')
const chatContainer=document.getElementById("chatContainer") 
window.addEventListener('resize', () => {
  chatContainer.scrollTop = chatContainer.scrollHeight;
});
// loadMessags
async function loadMessags(){
  const response=await fetch(`/loadMessags?name=${name}`)
  
  const result=await response.json()
  result.forEach(msg=>{
  const li=document.createElement("li")  
  li.classList.add("chat","shadow-[0_0_7px]","shadow-gray-300","my-1")
  li.textContent=msg.message
  chatContainer.appendChild(li)  
  })
}
loadMessags()
window.visualViewport.addEventListener('resize',()=>{
  chat_wrapper.scrollTop = chat_wrapper.scrollHeight;
  const viewportHeight = window.visualViewport.height;
  chat_wrapper.classList.remove("h-full")
  chat_wrapper.style.height=viewportHeight+"px"
  
  
});

input.addEventListener("input",()=>{

if(input.value !== ""){
  send_btn.classList.remove("bg-black")
  send_btn.classList.add("bg-purple-700")
}else{
 send_btn.classList.add("bg-black")
  send_btn.classList.remove("bg-purple-700")
}
})
// chat message logic
const socket=io("http://localhost:3000",{
  query:{
    room:name,
    id:id,
    type:type
  }
})

 send_btn.addEventListener("click",()=>{
   input.focus()
if(input.value.trim()==="")return;
  socket.emit("chat message",input.value)
  input.value=""
})

socket.on('chat message',(msg)=>{
  
  const li=document.createElement("li")  
li.classList.add("chat","bg-purple-300","my-1","shadow-[0_0_7px]","shadow-gray-300")
  li.textContent=msg
  chatContainer.appendChild(li)
  chatContainer.scrollTop = chatContainer.scrollHeight;
  })



