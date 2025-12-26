let order = [];

/* =========================
   MENU DATA (FIXED IMAGE PATHS)
========================= */
const MENU = {
  combo: [
    {
      name: "Chicken Biryani + Chilly Chicken + Egg",
      price: 200,
      img: "assets/Chicken Biryani + Chilly Chicken + Egg.png"
    },
    {
      name: "2 Chappathi + Aasari Varuval",
      price: 120,
      img: "assets/2 Chappathi + Aasari Varuval.png"
    },
    {
      name: "2 Parotta + Pepper Chicken",
      price: 120,
      img: "assets/2 Parotta + Pepper Chicken.png"
    },
    {
      name: "3 Idly + Meen Kulambu",
      price: 120,
      img: "assets/3 Idly + Meen Kulambu.png"
    },
    {
      name: "White Rice + Yelumbu Rasam + Chilly Chicken",
      price: 100,
      img: "assets/White Rice + Yelumbu Rasam + Chilly Chicken.png"
    }
  ],

  soup: [
    {
      name: "Veg Soup",
      price: 100,
      img: "assets/Veg Soup.png"
    },
    {
      name: "Non Veg Soup",
      price: 100,
      img: "assets/Non Veg Soup.png"
    }
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
    { name: "Dosa", price: 100, img: "assets/Dosa.png" },   // ✅ FIXED
    { name: "Parotta", price: 100, img: "assets/Parotta.png" }
  ]
};

/* =========================
   RENDER MENU
========================= */
function renderMenus() {
  Object.keys(MENU).forEach(category => {
    const container = document.getElementById(category);
    container.innerHTML = "";

    MENU[category].forEach(item => {
      const card = document.createElement("div");
      card.className = "menu-card";

      card.onclick = () => addToOrder(item, 1);
      card.ondblclick = e => {
        e.preventDefault();
        addToOrder(item, 1);
      };

      card.innerHTML = `
        <img src="${item.img}"
             alt="${item.name}"
             onerror="this.src='assets/placeholder.png'">
        <h4>${item.name}</h4>
        <div class="price">₹${item.price}</div>
      `;

      container.appendChild(card);
    });
  });
}

/* =========================
   ADD ITEM
========================= */
function addToOrder(item, qty) {
  const existing = order.find(i => i.name === item.name);
  if (existing) existing.qty += qty;
  else order.push({ ...item, qty });
  renderOrder();
}

/* =========================
   UPDATE QTY
========================= */
function updateQty(index, change) {
  order[index].qty += change;
  if (order[index].qty <= 0) order.splice(index, 1);
  renderOrder();
}

/* =========================
   RENDER ORDER
========================= */
function renderOrder() {
  const list = document.getElementById("orderItems");
  list.innerHTML = "";
  let total = 0;

  order.forEach((item, index) => {
    total += item.price * item.qty;
    list.innerHTML += `
      <div class="order-row">
        <span>${item.name}</span>
        <button class="qty-btn" onclick="updateQty(${index}, -1)">−</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
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
    card.style.display = card.innerText.toLowerCase().includes(text)
      ? "block"
      : "none";
  });

  if (text.trim()) {
    document.querySelectorAll(".menu-grid").forEach(g => g.classList.remove("hidden"));
  }
}

/* INIT */
renderMenus();

/* =========================
   SEND & GENERATE QR
========================= */
async function sendAndGenerateQR() {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();

  if (!name || !phone) {
    alert("Please enter customer name and phone number");
    return;
  }

  if (order.length === 0) {
    alert("Please add at least one item");
    return;
  }

  const payload = {
    customerName: name,
    phone: phone,
    items: order,
    total: Number(document.getElementById("total").innerText)
  };

  try {
    const res = await fetch("http://localhost:5000/api/bills/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!data.success) {
      alert("Failed to generate QR");
      return;
    }

    // Show QR in new window
    const w = window.open("", "_blank");
    w.document.write(`
      <html>
        <head>
          <title>AS-Kitchen QR</title>
        </head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif">
          <h2>Scan to View Bill</h2>
          <img src="${data.qr}" width="260"/>
          <p>Thank you for ordering at AS-Kitchen</p>
        </body>
      </html>
    `);

  } catch (err) {
    console.error(err);
    alert("Server not reachable");
  }
}
