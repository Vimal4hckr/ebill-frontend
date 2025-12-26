let order = [];

/* =========================
   MENU DATA
========================= */
const MENU = {
  combo: [
    { name: "Chicken Biryani + Chilly Chicken + Egg", price: 200, img: "assets/Chicken Biryani + Chilly Chicken + Egg.png" },
    { name: "2 Chappathi + Aasari Varuval", price: 120, img: "assets/2 Chappathi + Aasari Varuval.png" },
    { name: "2 Parotta + Pepper Chicken", price: 120, img: "assets/2 Parotta + Pepper Chicken.png" },
    { name: "3 Idly + Meen Kulambu", price: 120, img: "assets/3 Idly + Meen Kulambu.png" },
    { name: "White Rice + Yelumbu Rasam + Chilly Chicken", price: 100, img: "assets/White Rice + Yelumbu Rasam + Chilly Chicken.png" }
  ],

  soup: [
    { name: "Veg Soup", price: 100, img: "assets/Veg Soup.png" },
    { name: "Non Veg Soup", price: 100, img: "assets/Non Veg Soup.png" }
  ],

  starters: [
    { name: "Chicken 65", price: 100, img: "assets/Chicken 65.png" },
    { name: "Chicken Lollipop", price: 100, img: "assets/Chicken Lollipop.png" },
    { name: "Kadai", price: 100, img: "assets/Kadai.png" },
    { name: "Chilly Gobi", price: 100, img: "assets/Chilly Gobi.png" },
    { name: "Muttai Paniyaram", price: 100, img: "assets/Muttai Paniyaram.png" },
    { name: "Asari Varuval", price: 100, img: "assets/Asari Varuval.png" },
    { name: "Omelet", price: 100, img: "assets/Omelet.png" }
  ],

  dinner: [
    { name: "Idly", price: 100, img: "assets/Idly.png" },
    { name: "Chappathi", price: 100, img: "assets/Chappathi.png" },
    { name: "Dosa", price: 100, img: "assets/Dosa.png" },
    { name: "Parotta", price: 100, img: "assets/Parotta.png" }
  ]
};

/* =========================
   RENDER MENU
========================= */
function renderMenus() {
  Object.keys(MENU).forEach(category => {
    const container = document.getElementById(category);
    if (!container) return;

    container.innerHTML = "";

    MENU[category].forEach(item => {
      const card = document.createElement("div");
      card.className = "menu-card";

      card.onclick = () => addToOrder(item, 1);

      card.innerHTML = `
        <img src="./${item.img}" onerror="this.src='./assets/placeholder.png'">
        <h4>${item.name}</h4>
        <div class="price">₹${item.price}</div>
      `;

      container.appendChild(card);
    });
  });
}

/* =========================
   ORDER FUNCTIONS
========================= */
function addToOrder(item, qty) {
  const found = order.find(i => i.name === item.name);
  if (found) found.qty += qty;
  else order.push({ ...item, qty });
  renderOrder();
}

function updateQty(i, change) {
  order[i].qty += change;
  if (order[i].qty <= 0) order.splice(i, 1);
  renderOrder();
}

function renderOrder() {
  const list = document.getElementById("orderItems");
  if (!list) return;

  list.innerHTML = "";
  let total = 0;

  order.forEach((item, i) => {
    total += item.price * item.qty;
    list.innerHTML += `
      <div class="order-row">
        <span>${item.name}</span>
        <button onclick="updateQty(${i}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="updateQty(${i}, 1)">+</button>
        <span>₹${item.price * item.qty}</span>
      </div>
    `;
  });

  document.getElementById("total").innerText = total;
}

/* =========================
   CATEGORY SWITCH
========================= */
function showCategory(cat, btn) {
  document.querySelectorAll(".menu-grid").forEach(g => g.classList.add("hidden"));
  document.getElementById(cat).classList.remove("hidden");

  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

/* =========================
   SEARCH
========================= */
function searchDishes(text) {
  text = text.toLowerCase();
  document.querySelectorAll(".menu-card").forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(text) ? "block" : "none";
  });
}

/* =========================
   INIT (IMPORTANT)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  renderMenus();
  document.querySelector(".tabs button").click(); // 👈 SHOW COMBO BY DEFAULT
});

/* =========================
   SEND & GENERATE QR
========================= */
async function sendAndGenerateQR() {
  const name = custName.value.trim();
  const phone = custPhone.value.trim();

  if (!name || !phone || order.length === 0) {
    alert("Enter details and add items");
    return;
  }

  const payload = {
    customerName: name,
    phone,
    items: order,
    total: Number(total.innerText)
  };

  try {
    const res = await fetch(
      "https://ebill-backend.onrender.com/api/bills/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();

    const w = window.open("", "_blank");
    w.document.write(`<img src="${data.qr}" width="260"/>`);

  } catch (e) {
    alert("Backend not reachable");
  }
}
