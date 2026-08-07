const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);

const calculateLoan = (amount, annualRate, years) => {
  const principal = Number(amount);
  const rate = Number(annualRate) / 100 / 12;
  const months = Number(years) * 12;
  if (!principal || !annualRate || !years || principal <= 0 || annualRate <= 0 || years <= 0) {
    return null;
  }
  if (rate === 0) {
    return { monthlyPayment: principal / months, totalInterest: 0, totalPayment: principal, amortization: Array.from({ length: months }, (_, index) => ({ payment: index + 1, principal: principal / months, interest: 0, balance: Math.max(principal - (index + 1) * (principal / months), 0) })) };
  }
  const payment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
  let balance = principal;
  const amortization = [];
  for (let i = 1; i <= months; i += 1) {
    const interest = balance * rate;
    const principalPaid = payment - interest;
    balance = Math.max(balance - principalPaid, 0);
    amortization.push({ payment: i, principal: principalPaid, interest, balance });
  }
  return { monthlyPayment: payment, totalInterest: payment * months - principal, totalPayment: payment * months, amortization };
};

const renderChart = (amortization) => {
  const chart = document.getElementById('chart');
  if (!chart || !amortization?.length) return;
  const first = amortization.slice(0, 8);
  const totalPrincipal = first.reduce((sum, item) => sum + item.principal, 0);
  const totalInterest = first.reduce((sum, item) => sum + item.interest, 0);
  const items = [
    { label: 'Principal', value: totalPrincipal, color: 'var(--color-primary)' },
    { label: 'Interest', value: totalInterest, color: 'var(--color-accent)' }
  ];
  chart.innerHTML = items.map((item) => `
    <div class="chart-bar">
      <span>${item.label}</span>
      <div class="chart-track">
        <div class="chart-fill" style="width:${Math.max(8, (item.value / Math.max(totalPrincipal + totalInterest, 1)) * 100)}%; background:${item.color};"></div>
      </div>
      <strong>${formatCurrency(item.value)}</strong>
    </div>
  `).join('');
};

const renderAmortization = (amortization) => {
  const tbody = document.getElementById('amortizationBody');
  if (!tbody) return;
  const rows = amortization.slice(0, 12).map((item) => `
    <tr>
      <td>${item.payment}</td>
      <td>${formatCurrency(item.principal)}</td>
      <td>${formatCurrency(item.interest)}</td>
      <td>${formatCurrency(item.balance)}</td>
    </tr>
  `).join('');
  tbody.innerHTML = rows || '<tr><td colspan="4">No schedule available yet.</td></tr>';
};

const populateResults = (result) => {
  const monthly = document.getElementById('monthlyPayment');
  const interest = document.getElementById('totalInterest');
  const total = document.getElementById('totalPayment');
  const term = document.getElementById('termSummary');
  if (!result) {
    monthly.textContent = '$0.00';
    interest.textContent = '$0.00';
    total.textContent = '$0.00';
    term.textContent = '0 months';
    return;
  }
  monthly.textContent = formatCurrency(result.monthlyPayment);
  interest.textContent = formatCurrency(result.totalInterest);
  total.textContent = formatCurrency(result.totalPayment);
  term.textContent = `${result.amortization.length} months`;
};

const saveCalculation = (inputs) => {
  const payload = { ...inputs, updatedAt: new Date().toISOString() };
  localStorage.setItem('loanCalculatorLastCalculation', JSON.stringify(payload));
  const status = document.getElementById('statusMessage');
  if (status) {
    status.textContent = 'Last calculation saved to this browser.';
  }
};

const restoreCalculation = () => {
  const saved = localStorage.getItem('loanCalculatorLastCalculation');
  if (!saved) return;
  try {
    const payload = JSON.parse(saved);
    document.getElementById('loanAmount').value = payload.loanAmount || '';
    document.getElementById('interestRate').value = payload.interestRate || '';
    document.getElementById('loanTerm').value = payload.loanTerm || '';
  } catch (error) {
    console.warn(error);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const amount = document.getElementById('loanAmount').value;
  const rate = document.getElementById('interestRate').value;
  const years = document.getElementById('loanTerm').value;
  const result = calculateLoan(amount, rate, years);
  if (!result) {
    const status = document.getElementById('statusMessage');
    if (status) status.textContent = 'Please enter valid values for the loan amount, interest rate, and term.';
    populateResults(null);
    renderChart(null);
    renderAmortization([]);
    return;
  }
  populateResults(result);
  renderChart(result.amortization);
  renderAmortization(result.amortization);
  saveCalculation({ loanAmount: amount, interestRate: rate, loanTerm: years });
};

const copyResult = async () => {
  const summary = `Monthly payment: ${document.getElementById('monthlyPayment').textContent}
Total interest: ${document.getElementById('totalInterest').textContent}
Total payment: ${document.getElementById('totalPayment').textContent}`;
  try {
    await navigator.clipboard.writeText(summary);
    document.getElementById('statusMessage').textContent = 'Result copied to clipboard.';
  } catch (error) {
    document.getElementById('statusMessage').textContent = 'Copy was not available in this browser.';
  }
};

const shareResult = async () => {
  const summary = `Monthly payment: ${document.getElementById('monthlyPayment').textContent}
Total interest: ${document.getElementById('totalInterest').textContent}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Loan Calculator result', text: summary });
    } catch (error) {
      document.getElementById('statusMessage').textContent = 'Sharing was cancelled.';
    }
  } else {
    document.getElementById('statusMessage').textContent = 'Sharing is not supported on this device.';
  }
};

const printResult = () => {
  window.print();
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loan-form');
  form?.addEventListener('submit', handleSubmit);
  document.getElementById('saveCalc')?.addEventListener('click', () => {
    const amount = document.getElementById('loanAmount').value;
    const rate = document.getElementById('interestRate').value;
    const years = document.getElementById('loanTerm').value;
    saveCalculation({ loanAmount: amount, interestRate: rate, loanTerm: years });
  });
  document.getElementById('copyResult')?.addEventListener('click', copyResult);
  document.getElementById('shareResult')?.addEventListener('click', shareResult);
  document.getElementById('printResult')?.addEventListener('click', printResult);
  restoreCalculation();
  handleSubmit({ preventDefault() {} });
});
