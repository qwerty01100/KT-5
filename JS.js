const bankColors = {
  "Сбербанк":    "#21a038",
  "Тинькофф":   "#ffdd2d",
  "ВТБ":         "#002882",
  "Альфа-Банк":  "#ef3124",
  "Газпромбанк": "#003087",
  "Райффайзен":  "#ffed00",
  "Другой":      "#888888"
};

const bankCardBg = {
  "Сбербанк":    "#0d3826",
  "Тинькофф":   "#1a120a",
  "ВТБ":         "#001542",
  "Альфа-Банк":  "#1a0505",
  "Газпромбанк": "#001030",
  "Райффайзен":  "#1a1800",
  "Другой":      "#1a1a2e",
  "":            "#1a1a2e"
};

const form = document.forms.cardForm;
const cardPreview   = document.getElementById("cardPreview");
const bankDot       = document.getElementById("bankDot");
const bankNameEl    = document.getElementById("bankName");
const paymentLogoEl = document.getElementById("paymentLogo");
const cardNumberEl  = document.getElementById("cardNumber");
const cardHolderEl  = document.getElementById("cardHolder");
const cardExpiryEl  = document.getElementById("cardExpiry");
const cardsTableBody = document.getElementById("cardsTableBody");

function formatCardNumber(value) {
  let digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function maskCardNumber(value) {
  let digits = value.replace(/\D/g, "");
  if (digits.length < 4) return value || "—";
  return "•••• •••• •••• " + digits.slice(-4);
}

function getPaymentLogoHTML(system) {
  if (!system) {
    return '<span class="placeholder-text">Система</span>';
  }
  if (system === "Visa") {
    return '<span style="font-size:18px; font-weight:700; color:#f7b600; font-style:italic;">VISA</span>';
  }
  if (system === "Mastercard") {
    return `
      <span style="display:inline-flex; align-items:center;">
        <span style="display:inline-block; width:22px; height:22px; border-radius:50%;
                     background:#eb001b; opacity:0.9; margin-right:-8px;"></span>
        <span style="display:inline-block; width:22px; height:22px; border-radius:50%;
                     background:#f79e1b; opacity:0.9;"></span>
      </span>`;
  }
  if (system === "Мир") {
    return '<span style="font-size:14px; font-weight:700; color:#00c176; letter-spacing:0.06em;">МИР</span>';
  }
  if (system === "UnionPay") {
    return '<span style="font-size:12px; font-weight:700; color:rgba(255,255,255,0.85);">UnionPay</span>';
  }
  return `<span style="color:rgba(255,255,255,0.8)">${system}</span>`;
}

function getPayBadgeClass(system) {
  const map = {
    "Visa":       "visa",
    "Mastercard": "mastercard",
    "Мир":        "mir",
    "UnionPay":   "unionpay"
  };
  return map[system] || "";
}

function updateCardPreview() {
  
  const bank    = form.elements.bank.value;
  const payment = form.elements.payment.value;
  const number  = form.elements.number.value;
  const holder  = form.elements.holder.value;
  const month   = form.elements.month.value;
  const year    = form.elements.year.value;

  cardPreview.style.background = bankCardBg[bank] || "#1a1a2e";

  if (bank) {
    bankDot.style.background = bankColors[bank] || "#aaa";
    bankNameEl.textContent = bank;
    bankNameEl.classList.remove("placeholder-text");
  } else {
    bankDot.style.background = "rgba(255,255,255,0.25)";
    bankNameEl.textContent = "Банк";
    bankNameEl.classList.add("placeholder-text");
  }

  paymentLogoEl.innerHTML = getPaymentLogoHTML(payment);

  if (number) {
    cardNumberEl.innerHTML = formatCardNumber(number);
    cardNumberEl.style.color = "rgba(255,255,255,0.9)";
  } else {
    cardNumberEl.innerHTML = '<span class="placeholder-text">0000 0000 0000 0000</span>';
  }

  if (holder.trim()) {
    cardHolderEl.textContent = holder.toUpperCase();
    cardHolderEl.style.color = "rgba(255,255,255,0.85)";
  } else {
    cardHolderEl.innerHTML = '<span class="placeholder-text">ИМЯ ФАМИЛИЯ</span>';
  }

  if (month && year) {
    cardExpiryEl.textContent = month + " / " + year;
    cardExpiryEl.style.color = "rgba(255,255,255,0.85)";
  } else {
    cardExpiryEl.innerHTML = '<span class="placeholder-text">ММ / ГГГГ</span>';
  }
}

for (let i = 0; i < form.elements.length; i++) {
  let el = form.elements[i];
  el.addEventListener("input",  updateCardPreview);
  el.addEventListener("change", updateCardPreview);
}
const numberInput = document.getElementById("number");
numberInput.addEventListener("input", function() {
  this.value = formatCardNumber(this.value);
});

form.addEventListener("submit", function(e) {
  e.preventDefault();
  const body = {};
  for (let i = 0; i < form.elements.length; i++) {
    let el = form.elements[i];
    if (el.name) {
      body[el.name] = el.value;
    }
  }

  console.log("Данные формы:", body);
  const emptyFields = [];
  if (!body.bank)    emptyFields.push("название банка");
  if (!body.payment) emptyFields.push("платёжная система");
  if (!body.number)  emptyFields.push("номер карты");
  if (!body.holder)  emptyFields.push("имя держателя");
  if (!body.month)   emptyFields.push("месяц");
  if (!body.year)    emptyFields.push("год");

  if (emptyFields.length > 0) {
    alert("Пожалуйста, заполните: " + emptyFields.join(", "));
    return;
  }

  const emptyRow = cardsTableBody.querySelector(".empty-row");
  if (emptyRow) {
    emptyRow.remove();
  }

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${body.bank}</td>
    <td>
      <span class="pay-badge ${getPayBadgeClass(body.payment)}">
        ${body.payment}
      </span>
    </td>
    <td class="number-masked">${maskCardNumber(body.number)}</td>
    <td>${body.holder.toUpperCase()}</td>
    <td>${body.month} / ${body.year}</td>
  `;
  cardsTableBody.appendChild(tr);

  form.reset();
  updateCardPreview();
});