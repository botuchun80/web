const BASE = "https://yourdomain.com/api";
window.Telegram.WebApp.expand();

async function load(){
  const r = await fetch(`${BASE}/courier/orders`);
  const list = await r.json();
  const box = document.getElementById("orders");
  list.forEach(o=>{
    const d = document.createElement("div");
    d.innerHTML = `<p><b>#${o.id}</b> ${o.lat}, ${o.lon} – ${o.total} so‘m
      <button onclick="pick(${o.id})">Olib ketdim</button></p>`;
    box.appendChild(d);
  });
}
async function pick(id){
  await fetch(`${BASE}/courier/status`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({orderId:id, status:"PICKED"})
  });
  location.reload();
}
load();
