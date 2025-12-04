const BASE = "https://yourdomain.com/api";

async function addProduct(){
  const name = document.getElementById("pName").value;
  const price = document.getElementById("pPrice").value;
  await fetch(`${BASE}/admin/product`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({name, price})
  });
  alert("Qo‘shildi");
}
async function loadChecks(){
  const r = await fetch(`${BASE}/admin/pendingChecks`);
  const list = await r.json();
  const box = document.getElementById("checks");
  list.forEach(c=>{
    const div=document.createElement("div");
    div.innerHTML=`<p>Order #${c.orderId}
      <img src="https://yourdomain.com/${c.checkUrl}" width="200">
      <button onclick="approve('${c.orderId}')">Tasdiqlash</button></p>`;
    box.appendChild(div);
  });
}
async function approve(orderId){
  await fetch(`${BASE}/admin/approve`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({orderId})
  });
  location.reload();
}
loadChecks();
