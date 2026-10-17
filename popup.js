document.addEventListener('DOMContentLoaded', () => {
  const statusBadge = document.getElementById('statusBadge');
  const licenseInput = document.getElementById('licenseKey');
  const activateBtn = document.getElementById('activateBtn');

  // Check current license status on popup open
  chrome.storage.local.get(['isPro'], (result) => {
    if (result.isPro) {
      statusBadge.textContent = 'PRO PLAN ACTIVATED';
      statusBadge.style.background = '#e8f5e9';
      statusBadge.style.color = '#2e7d32';
      licenseInput.style.display = 'none';
      activateBtn.style.display = 'none';
    }
  });

  // Activate Pro button click
  activateBtn.addEventListener('click', () => {
    const key = licenseInput.value.trim();
    if (key === 'NOTION-CSV-PRO-2026') {
      chrome.storage.local.set({ isPro: true }, () => {
        statusBadge.textContent = 'PRO PLAN ACTIVATED';
        statusBadge.style.background = '#e8f5e9';
        statusBadge.style.color = '#2e7d32';
        licenseInput.style.display = 'none';
        activateBtn.style.display = 'none';
        alert('PRO version successfully activated!');
      });
    } else {
      alert('Invalid license key. Please check and try again.');
    }
  });
});