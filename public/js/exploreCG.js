document.addEventListener("DOMContentLoaded",()=>{
const params=new URLSearchParams(window.location.search)
const type=params.get("type")
async function loadeGC(){
  const container=document.querySelector(".container")
  
    const response=await fetch(`/explore_CG?type=${type}`)
  const results=await response.json()
  results.forEach(cg=>{
    const div=document.createElement("div");
    const btn=document.createElement("button");
    const h1=document.createElement("h1")
    btn.textContent="Get in"
  h1.textContent = cg[`${type}_names`]; // dynamically selects the key
    // style
     div.classList.add("rounded-3xl","shadow-xl","w-[300px]","min-h-[200px]", "border","border-indigo-700","flex","flex-col", "items-center","pb-4", "justify-around")
     h1.classList.add("text-4xl", "font-bold","text-black")
     btn.classList.add(`${type}_btn`, "h-12", "rounded-xl", "bg-gradient-to-br","from-indigo-600", "to-purple-500","w-32", "font-extrabold","text-white","border-none","mx-auto" )
     btn.setAttribute('data-gc',cg[`${type}_names`])
     
div.appendChild(h1)
div.appendChild(btn)
container.appendChild(div)
  })
  
document.dispatchEvent(new Event("exploreCG:ready"));
}
loadeGC()
})

