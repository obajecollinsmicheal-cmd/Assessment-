const amountInput = document.getElementById("amount")
const typeSelect = document.getElementById("type")
const addBtn = document.getElementById("addBtn")
const allBtn = document.getElementById("allBtn")
const creditBtn = document.getElementById("creditBtn")
const debitBtn = document.getElementById("debitBtn")
const transactionList = document.getElementById("transactionList")
const balanceDisplay = document.getElementById("balance")

let transactions = []
let nextId = 1
let currentFilter = "All"

addBtn.addEventListener("click", addTransaction)
allBtn.addEventListener("click", () => changeFilter("All"))
creditBtn.addEventListener("click", () => changeFilter("Credit"))
debitBtn.addEventListener("click", () => changeFilter("Debit"))

document.addEventListener("DOMContentLoaded", render)

function addTransaction() {
  const amount = Number(amountInput.value)
  const type = typeSelect.value

  if (!amount || amount <= 0) {
    alert("Enter a valid amount greater than 0.")
    return
  }

  transactions.push({
    id: nextId,
    amount,
    type
  })

  nextId += 1
  amountInput.value = ""
  typeSelect.value = "Credit"
  render()
}

function changeFilter(filter) {
  currentFilter = filter
  updateButtons()
  render()
}

function updateButtons() {
  allBtn.classList.toggle("active", currentFilter === "All")
  creditBtn.classList.toggle("active", currentFilter === "Credit")
  debitBtn.classList.toggle("active", currentFilter === "Debit")
}

function render() {
  sortTransactions()
  const visible = getVisibleTransactions()
  showTransactions(visible)
  updateBalance(visible)
}

function getVisibleTransactions() {
  if (currentFilter === "Credit") return transactions.filter(tx => tx.type === "Credit")
  if (currentFilter === "Debit") return transactions.filter(tx => tx.type === "Debit")
  return [...transactions]
}

function sortTransactions() {
  transactions.sort((a, b) => b.amount - a.amount)
}

function showTransactions(list) {
  transactionList.innerHTML = ""

  if (list.length === 0) {
    transactionList.innerHTML = "<li class='transaction-empty'>No transactions added yet.</li>"
    return
  }

  list.forEach(tx => {
    const item = document.createElement("li")
    item.className = `transaction-item ${tx.type.toLowerCase()}`
    item.innerHTML = `<span>${tx.type}</span><span>ID ${tx.id} • $${tx.amount.toFixed(2)}</span>`
    transactionList.appendChild(item)
  })
}

function updateBalance(list) {
  const total = list.reduce((sum, tx) => sum + (tx.type === "Credit" ? tx.amount : -tx.amount), 0)
  balanceDisplay.textContent = formatCurrency(total)
  balanceDisplay.style.color = total < 0 ? "#c02d2d" : "#1f8a3d"
}

function formatCurrency(value) {
  const sign = value < 0 ? "-" : ""
  return `${sign}$${Math.abs(value).toFixed(2)}`
}
