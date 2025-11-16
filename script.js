const loginContainer = document.getElementById('login-container');
const mainApp = document.getElementById('main-app');
const balanceEl = document.getElementById('balance');
const initialAmountEl = document.getElementById('initial-amount');
const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let initialBalance = parseFloat(localStorage.getItem('initialBalance')) || 0;

// Default credentials (ubah jika perlu)
const defaultUsername = 'admin';
const defaultPassword = '1234567';

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        loginContainer.style.display = 'none';
        mainApp.style.display = 'block';
        renderTransactions();
    } else {
        loginContainer.style.display = 'flex';
        mainApp.style.display = 'none';
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');
    if (username === defaultUsername && password === defaultPassword) {
        localStorage.setItem('isLoggedIn', 'true');
        checkLoginStatus();
    } else {
        errorMsg.style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    checkLoginStatus();
}

function updateBalance() {
    const transactionTotal = transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
    const totalBalance = initialBalance + transactionTotal;
    balanceEl.textContent = totalBalance.toLocaleString('id-ID');
}

function updateInitialBalance() {
    initialBalance = parseFloat(initialAmountEl.value) || 0;
    localStorage.setItem('initialBalance', initialBalance);
    updateBalance();
}

function renderTransactions() {
    list.innerHTML = '';
    transactions.forEach((t, index) => {
        const li = document.createElement('li');
        li.className = `transaction ${t.type}`;
        const icon = t.type === 'income' ? '<i class="fas fa-arrow-up"></i>' : '<i class="fas fa-arrow-down"></i>';
        li.innerHTML = `
            <span>${icon} ${t.description} - Rp ${t.amount.toLocaleString('id-ID')}</span>
            <button onclick="deleteTransaction(${index})"><i class="fas fa-trash"></i></button>
        `;
        list.appendChild(li);
    });
    updateBalance();
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    if (amount > 0) {
        transactions.push({ type, description, amount });
        localStorage.setItem('transactions', JSON.stringify(transactions));
        renderTransactions();
        form.reset();
    }
});

// Load initial balance on page load
initialAmountEl.value = initialBalance;
checkLoginStatus();
