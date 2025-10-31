
const amountEl = document.getElementById("amount");
const selectEl = document.getElementById("coinSelect");
const resultEl = document.getElementById("convResult");

function updateConv(){
  const amt = parseFloat(amountEl.value || "0");
  const opt = selectEl.selectedOptions[0];
  if(!opt || !opt.dataset.price || !amt){
    resultEl.textContent = "Pilih koin & masukkan jumlah";
    return;
  }
  const price = parseFloat(opt.dataset.price);
  const usd = amt * price;
  resultEl.textContent = `${amt} ${opt.textContent.split(' ')[0]} ≈ $${usd.toLocaleString(undefined,{maximumFractionDigits:2})}`;
}

amountEl?.addEventListener("input", updateConv);
selectEl?.addEventListener("change", updateConv);
