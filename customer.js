const BASE = "https://yourdomain.com/api";
let cart = {}, orderId = null;
window.Telegram.WebApp.expand();

async function getProducts(){
  const r = await fetch(`${BASE}/products`);
  return r.json();
}
async function createOrder(payload){
  const r = await fetch(`${BASE}/order`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify(payload)
  });
  return r.json();
}
async function uploadCheck(orderId, file){
  const fd = new FormData();
  fd.append("orderId", orderId);
  fd.append("check", file);
  const r = await fetch(`${BASE}/uploadCheck`, {method:"POST", body: fd});
  return r.json();
}

async function loadMenu(){
  const data = await getProducts();
  const box = document.getElementById("menu");
  data.forEach(p=>{
    const d = document.createElement("div");
    d.innerHTML = `<b>${p.name}</b> ${p.price} so‘m
      <button data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">+</button>`;
    box.appendChild(d);
  });
  box.addEventListener("click", e=>{
    if (e.target.tagName === "BUTTON") addToCart(e.target.dataset);
  });
}
function addToCart({id, name, price}){
  cart[id] = cart[id] || {name, qty:0, price: Number(price)};
  cart[id].qty++;
  renderCart();
}
function renderCart(){
  const list = document.getElementById("cartList");
  list.innerHTML = "";
  let total = 0;
  for (const id in cart){
    const {name, qty, price} = cart[id];
    total += qty*price;
    const li = document.createElement("li");
    li.textContent = `${name} x${qty} = ${qty*price}`;
    list.appendChild(li);
  }
  document.getElementById("total").textContent = total;
  document.getElementById("cartSec").hidden = Object.keys(cart).length===0;
}
async function checkout(){
  const user = window.Telegram.WebApp.initDataUnsafe.user;
  const payload = {
    userId: user.id,
    userName: user.username || user.first_name,
    items: Object.values(cart).map(({name, qty, price})=>({name, qty, price})),
    location: window.userLocation
  };
  const res = await createOrder(payload);
  orderId = res.orderId;
  document.getElementById("menuSec").hidden = true;
  document.getElementById("cartSec").hidden = true;
  document.getElementById("paySec").hidden = false;
}
async function pay(){
  const file = document.getElementById("checkFile").files[0];
  if (!file) return;
  await uploadCheck(orderId, file);
  document.getElementById("payStatus").textContent = "Chek yuborildi!";
  setTimeout(()=>window.Telegram.WebApp.close(), 1500);
}

document.getElementById("getLoc").onclick = ()=>{
  if (!navigator.geolocation) return alert("Geolocation yo‘q");
  navigator.geolocation.getCurrentPosition(pos=>{
    window.userLocation = {lat: pos.coords.latitude, lon: pos.coords.longitude};
    document.getElementById("locStatus").textContent = "Aniqlandi ✅";
    document.getElementById("locSec").hidden = true;
    document.getElementById("menuSec").hidden = false;
    loadMenu();
  }, err=>{
    document.getElementById("locStatus").textContent = "Ruxsat bering!";
  });
};
document.getElementById("toCheckout").onclick = checkout;
document.getElementById("uploadCheck").onclick = pay;
