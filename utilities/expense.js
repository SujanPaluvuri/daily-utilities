// Get elements
const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const netBalanceEl = document.getElementById("net-balance");
const filterSelect = document.getElementById("filter");

// Load from localStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Chart.js Setup
const ctx = document.getElementById("expenseChart").getContext("2d");
let expenseChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Income", "Expense"],
    datasets: [{
      data: [0, 0],
      backgroundColor: ["#38b000", "#d00000"],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "bottom" }
    }
  }
});

// Display stored data on load
window.addEventListener("DOMContentLoaded", () => {
  renderTransactions();
  updateBalance();
});

// Handle form submit
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const type = document.getElementById("type").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount greater than 0.");
    return;
  }
  if (!category) {
    alert("Please enter a category.");
    return;
  }

  const transaction = {
    id: Date.now(),
    type,
    amount,
    category,
    description
  };

  transactions.unshift(transaction); // Most recent on top
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
  updateBalance();
  expenseForm.reset();
});

// Render transactions based on filter
function renderTransactions() {
  expenseList.innerHTML = "";
  const filter = filterSelect.value;

  const filtered = transactions.filter(txn => filter === "all" || txn.type === filter);

  if (filtered.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "No transactions yet.";
    emptyMsg.style.textAlign = "center";
    emptyMsg.style.color = "#fff";
    emptyMsg.style.fontStyle = "italic";
    expenseList.appendChild(emptyMsg);
    return;
  }

  filtered.forEach(txn => addTransactionToList(txn));
}

// Add transaction to UI
function addTransactionToList(txn) {
  const li = document.createElement("li");
  li.classList.add(txn.type);
  li.dataset.id = txn.id; // store id as data attribute
  li.innerHTML = `
    <span>${txn.type === "income" ? "+" : "-"}₹${txn.amount} - ${txn.category} (${txn.description || "No details"})</span>
    <button class="delete-btn">Delete</button>
  `;
  expenseList.appendChild(li);

  li.querySelector(".delete-btn").addEventListener("click", () => deleteTransaction(txn.id));
}

// Update balance and chart
function updateBalance() {
  let income = 0, expense = 0;
  transactions.forEach(txn => {
    if (txn.type === "income") income += txn.amount;
    else expense += txn.amount;
  });

  totalIncomeEl.textContent = `₹${income}`;
  totalExpenseEl.textContent = `₹${expense}`;
  netBalanceEl.textContent = `₹${income - expense}`;

  expenseChart.data.datasets[0].data = [income, expense];
  expenseChart.update();
}

// Delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter(txn => txn.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions();
  updateBalance();
}

// Handle filter change
filterSelect.addEventListener("change", renderTransactions);
