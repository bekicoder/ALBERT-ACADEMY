const swiper=new Swiper('.swiper',{
  loop:true,
  slidesPerView:1,
  spaceBetween:20,
  autoplay:{
    delay:3000,
    disableOnInteraction:false,
  },
  pagination:{
    el:'.swiper-pagination',
    clickable:true
  },
  breakpoints: {
    640: { slidesPerView: 3 }
  }
})
const slider=new Swiper('.news_swiper',{
  loop:true,
  slidesPerView:1,
  spaceBetween:20,
  autoplay:{
    delay:3000,
    disableOnInteraction:false,
  },
  pagination:{
    el:'.swiper-paginati',
    clickable:true
  },
  breakpoints: {
    640: { slidesPerView: 3 }
  }
})

//get in btn logic
const club_btn = document.querySelectorAll(".club_btn");
const group_btn = document.querySelectorAll(".group_btn");
const body = document.querySelector("body");

club_btn.forEach(btn => {
btn.addEventListener("click", e => {
const bg = document.createElement("div");
body.style.backgroundColor = "";
const modal = document.createElement("div");
const login_btn = document.createElement("button");
const visit_btn = document.createElement("button");
bg.classList.add(
"bg",
"w-screen",
"h-screen",
"w-screen",
"flex",
"flex-row",
"justify-center",
"fixed",
"absolute",
"top-0",
"bg-black/80"
);
modal.classList.add(
"w-[300px]",
"box-border",
"mx-4",
"my-auto",
"h-48",
"bg-white",
"flex",
"flex-row",
"items-center",
"rounded-3xl"
);
visit_btn.classList.add(
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
visit_btn.textContent = "Visit";
login_btn.textContent = "Log in";
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
modal.appendChild(visit_btn);
modal.appendChild(login_btn);
bg.appendChild(modal);
body.appendChild(bg);
bg.addEventListener("click", e => {
if (e.target.classList.contains("bg")) {
bg.classList.add("hidden");
}
// vist button click
});

visit_btn.addEventListener("click", e => {
const club = btn.dataset.gc;
e.target.textContent = club;
window.location.href = `/chats.html?g_c_name=${club}`;
});
login_btn.addEventListener("click", () => {
const id_input = document.createElement("input");
const password_input = document.createElement("input");
const form = document.createElement("form");
const logInBtn = document.createElement("button");
id_input.type = "text";
id_input.name = "id";
id_input.required = true;
id_input.placeholder = "Student Id";
id_input.classList.add("border", "rounded", "border-black", "p-2");
password_input.type = "text";
password_input.name = "password";
password_input.required = true;
password_input.placeholder = "Club password";
password_input.classList.add(
"border",
"rounded",
"border-black",
"p-2"
);
form.classList.add("flex", "flex-col", "items-center", "gap-4");
logInBtn.type = "button";
logInBtn.classList.add(
"h-12",
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
logInBtn.textContent = "Log in";
modal.classList.remove("items-center", "flex-row");
modal.classList.add("justify-center", "flex-col");
visit_btn.classList.add("hidden");
modal.innerHTML = "";
form.appendChild(id_input);
form.appendChild(password_input);
form.appendChild(logInBtn);
modal.appendChild(form);
// log in btn logic

logInBtn.addEventListener("click", async e => {
if (!form.checkValidity()) {
form.reportValidity();
return;
}


const fd = new FormData(form);
const data = Object.fromEntries(fd.entries());
const club = btn.dataset.gc;
const response = await fetch(
`/authenticate_member?type=club&name=${club}&id=${data.id}&password=${data.password}`
);
const result = await response.json();
if (result.exists === 0) {
modal.innerHTML = `<h1 class="text-xl font-small text-center"> Invalid Id number please cheack the enterd id number</h1>`;
} else if (result.exists === 1 && result.password==="correct") {
modal.innerHTML = `<h1 class="text-xl font-small text-center">Logged in succefully</h1>`;
window.location.href=`/chats.html?g_c_name=${club}&type=club&id=${data.id}`;
} else if(result.exists === 1 && result.password==="incorect"){
  modal.innerHTML = `<h1 class="text-xl font-small text-center">Incorect password</h1>`;
}else{
  modal.innerHTML = `<h1 class="text-xl font-small text-center">Error loging in</h1>`;
}

});
});
});
});
// group_btn
group_btn.forEach(btn => {
btn.addEventListener("click", e => {
const bg = document.createElement("div");
body.style.backgroundColor = "";
const modal = document.createElement("div");
const login_btn = document.createElement("button");
const visit_btn = document.createElement("button");
bg.classList.add(
"bg",
"w-screen",
"h-screen",
"w-screen",
"flex",
"flex-row",
"justify-center",
"fixed",
"absolute",
"top-0",
"bg-black/80"
);
modal.classList.add(
"w-[300px]",
"box-border",
"mx-4",
"my-auto",
"h-48",
"bg-white",
"flex",
"flex-row",
"items-center",
"rounded-3xl"
);
visit_btn.classList.add(
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
visit_btn.textContent = "Visit";
login_btn.textContent = "Log in";
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
modal.appendChild(visit_btn);
modal.appendChild(login_btn);
bg.appendChild(modal);
body.appendChild(bg);
bg.addEventListener("click", e => {
if (e.target.classList.contains("bg")) {
bg.classList.add("hidden");
}
// vist button click
});
visit_btn.addEventListener("click", e => {
const group = btn.dataset.gc;
e.target.textContent = group;
window.location.href = `/chats.html?g_c_name=${group}`;
});
login_btn.addEventListener("click", () => {
const id_input = document.createElement("input");
const password_input = document.createElement("input");
const form = document.createElement("form");
const logInBtn = document.createElement("button");
id_input.type = "text";
id_input.name = "id";
id_input.required = true;
id_input.placeholder = "Student Id";
id_input.classList.add("border", "rounded", "border-black", "p-2");
password_input.type = "text";
password_input.name = "password";
password_input.required = true;
password_input.placeholder = "group password";
password_input.classList.add(
"border",
"rounded",
"border-black",
"p-2"
);
form.classList.add("flex", "flex-col", "items-center", "gap-4");
logInBtn.type = "button";
logInBtn.classList.add(
"h-12",
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
logInBtn.textContent = "Log in";
modal.classList.remove("items-center", "flex-row");
modal.classList.add("justify-center", "flex-col");
visit_btn.classList.add("hidden");
modal.innerHTML = "";
form.appendChild(id_input);
form.appendChild(password_input);
form.appendChild(logInBtn);
modal.appendChild(form);
// log in btn logic

logInBtn.addEventListener("click", async e => {
if (!form.checkValidity()) {
form.reportValidity();
return;
}


const fd = new FormData(form);
const data = Object.fromEntries(fd.entries());
const Group = btn.dataset.gc;
const response = await fetch(
`/authenticate_member?type=group&name=${group}&id=${data.id}&password=${data.password}`
);
const result = await response.json();
if (result.exists === 0) {
modal.innerHTML = `<h1 class="text-xl font-small text-center"> Invalid Id number please cheack the enterd id number</h1>`;
} else if (result.exists === 1 && result.password==="correct") {
modal.innerHTML = `<h1 class="text-xl font-small text-center">Logged in succefully</h1>`;
window.location.href=`/chats.html?g_c_name=${group}&type=group&id=${data.id}`;
} else if(result.exists === 1 && result.password==="incorect"){
  modal.innerHTML = `<h1 class="text-xl font-small text-center">Incorect password</h1>`;
}else{
  modal.innerHTML = `<h1 class="text-xl font-small text-center">Error loging in</h1>`;
}

});
});
});
});

//humbergur logic
    document.getElementById("humbergur").onclick = ()=> {
      document.getElementById("close").classList.toggle("hidden")
      document.getElementById("open").classList.toggle("hidden")
      document.querySelector(".navbar").classList.toggle("invisible")
    }
    document.querySelectorAll(".navlink").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector(".navbar").classList.add("invisible");
    document.getElementById("close").classList.add("hidden");
    document.getElementById("open").classList.remove("hidden");
  });
});