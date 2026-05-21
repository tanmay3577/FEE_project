document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('expense-name');
    const amountInput = document.getElementById('expense-amount');
    const categorySelect = document.getElementById('expense-category');
    const addBtn = document.getElementById('add-expense-btn');
    const clearBtn = document.getElementById('clear-expenses-btn');
    const totalDisplay = document.getElementById('total-expense');
    const expenseList = document.getElementById('expense-list');
    
    let expenses = JSON.parse(localStorage.getItem('hub-expenses')) || [];
    let chartInstance = null;

    // Initialize Chart
    const ctx = document.getElementById('expenseChart').getContext('2d');

    const categoryColors = {
        'Food': '#ef4444',
        'Transport': '#3b82f6',
        'Utilities': '#f59e0b',
        'Entertainment': '#8b5cf6',
        'Shopping': '#ec4899',
        'Other': '#94a3b8'
    };

    function updateChart() {
        const categoryTotals = {};
        expenses.forEach(exp => {
            if (!categoryTotals[exp.category]) categoryTotals[exp.category] = 0;
            categoryTotals[exp.category] += exp.amount;
        });

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
        const backgroundColors = labels.map(label => categoryColors[label] || categoryColors['Other']);

        if (chartInstance) {
            chartInstance.destroy();
        }

        // Only show chart if there's data
        if (data.length === 0) return;

        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.body).getPropertyValue('--text-primary').trim()
                        }
                    }
                }
            }
        });
    }

    function renderList() {
        expenseList.innerHTML = '';
        let total = 0;

        expenses.forEach((exp, index) => {
            total += exp.amount;
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.padding = '1rem';
            item.style.borderBottom = '1px solid var(--card-border)';
            
            item.innerHTML = `
                <div>
                    <strong>${exp.name}</strong> <span style="color: var(--text-secondary); font-size: 0.8rem;">(${exp.category})</span>
                </div>
                <div style="font-weight: bold; color: var(--accent-1);">
                    ₹${exp.amount.toFixed(2)}
                    <button class="delete-btn" data-index="${index}" style="margin-left: 1rem; background: transparent; border: none; color: var(--danger); cursor: pointer; font-size: 1.2rem;">&times;</button>
                </div>
            `;
            expenseList.appendChild(item);
        });

        totalDisplay.innerText = `₹${total.toFixed(2)}`;

        // Attach delete event listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                expenses.splice(index, 1);
                saveAndRender();
            });
        });
    }

    function saveAndRender() {
        localStorage.setItem('hub-expenses', JSON.stringify(expenses));
        renderList();
        updateChart();
    }

    addBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const category = categorySelect.value;

        if (name && !isNaN(amount) && amount > 0) {
            expenses.push({ name, amount, category, date: new Date().toISOString() });
            nameInput.value = '';
            amountInput.value = '';
            saveAndRender();
            
            // Button success state
            const originalText = addBtn.innerText;
            addBtn.innerText = '✓ Added';
            addBtn.style.background = 'var(--success)';
            setTimeout(() => {
                addBtn.innerText = originalText;
                addBtn.style.background = '';
            }, 1000);
        }
    });

    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all expenses?')) {
            expenses = [];
            saveAndRender();
            if (chartInstance) chartInstance.destroy();
        }
    });

    // Initial render
    renderList();
    updateChart();
});
