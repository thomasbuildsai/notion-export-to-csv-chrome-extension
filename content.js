console.log("🚀 Extension Notion Exporter cargada en la página.");

function injectExportButtons() {
  const tables = document.querySelectorAll('table, .notion-table-view, [role="table"]');

  tables.forEach((table, index) => {
    if (table.dataset.hasCsvExporter) return;
    table.dataset.hasCsvExporter = "true";

    const btn = document.createElement('button');
    btn.innerText = '📥 Exportar CSV';
    btn.style.cssText = `
      margin: 10px 0;
      padding: 8px 14px;
      background-color: #2eaadc;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      font-size: 13px;
      z-index: 999999;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      exportTableToCSV(table, index);
    });

    table.parentNode.insertBefore(btn, table);
    console.log("✅ Botón de exportación inyectado con éxito.");
  });
}

function exportTableToCSV(table, index) {
  chrome.storage.local.get(['isPro'], (result) => {
    const isPro = result.isPro || false;
    let csv = [];
    const rows = Array.from(table.querySelectorAll('tr, [role="row"]'));

    rows.forEach((row) => {
      let rowData = [];
      const cols = row.querySelectorAll('th, td, [role="columnheader"], [role="cell"]');
      
      cols.forEach((col) => {
        let text = col.innerText.replace(/"/g, '""').replace(/\n/g, ' ').trim();
        rowData.push(`"${text}"`);
      });

      if (rowData.length > 0) {
        csv.push(rowData.join(','));
      }
    });

    if (csv.length === 0) {
      alert('No se encontraron datos en esta tabla.');
      return;
    }

    // Freemium restriction: Header + max 10 data rows
    if (!isPro && csv.length > 11) {
      csv = csv.slice(0, 11);
      alert('Free Version: Exported top 10 rows only. Activate PRO in the extension popup for unlimited exports!');
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + csv.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `notion_export_${index + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

const observer = new MutationObserver(() => {
  injectExportButtons();
});

observer.observe(document.body, { childList: true, subtree: true });
injectExportButtons();