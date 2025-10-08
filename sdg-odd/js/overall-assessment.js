// Overall Assessment Page Logic
(function() {
  let assessmentData = {};
  let exportFormat = 'text';

  // Initialize the page
  function init() {
    // Load assessment data
    assessmentData = AssessmentStorage.getData();

    // Render overall assessment
    renderOverallAssessment();

    // Setup event listeners
    var exportBtn = document.getElementById('export-btn');
    var resetBtn = document.getElementById('reset-btn');
    var exportFormatSelect = document.getElementById('export-format-select');
    var copyBtn = document.getElementById('copy-btn');
    var downloadBtn = document.getElementById('download-btn');

    if (exportBtn) exportBtn.addEventListener('click', showExportModal);
    if (resetBtn) {
      console.log('Reset button found, attaching event listener');
      resetBtn.addEventListener('click', handleReset);
    } else {
      console.error('Reset button not found!');
    }
    if (exportFormatSelect) exportFormatSelect.addEventListener('change', handleFormatChange);
    if (copyBtn) copyBtn.addEventListener('click', handleCopy);
    if (downloadBtn) downloadBtn.addEventListener('click', handleDownload);

    // Setup modal close handlers
    var closeButtons = document.querySelectorAll('#export-modal [data-dismiss="modal"]');
    closeButtons.forEach(function(btn) {
      btn.addEventListener('click', closeExportModal);
    });

    // Close modal when clicking backdrop
    var modal = document.getElementById('export-modal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeExportModal();
        }
      });
    }
  }

  // Close export modal
  function closeExportModal() {
    var modal = document.getElementById('export-modal');
    if (modal) {
      modal.classList.remove('in');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
    }

    document.body.classList.remove('modal-open');

    var backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }

  // Render overall assessment
  function renderOverallAssessment() {
    const { ethicsPrinciples, qualityDimensions, results } = assessmentData;
    const overallPass = results.ethicsPass && results.qualityPass;

    // Overall result display
    const overallResultDisplay = document.getElementById('overall-result-display');
    const alertClass = overallPass ? 'alert alert-success' : 'alert alert-danger';
    const iconClass = overallPass ? 'glyphicon-ok-sign' : 'glyphicon-remove-sign';
    const resultText = overallPass ? t('overallPass') : t('overallFail');

    overallResultDisplay.className = alertClass;
    overallResultDisplay.setAttribute('role', 'alert');
    overallResultDisplay.innerHTML = `
      <p>
        <span class="glyphicon mrgn-rght-sm" aria-hidden="true"></span>
        <strong>${resultText}</strong>
      </p>
    `;

    // Overall message
    const overallMessage = document.getElementById('overall-message');
    let messageText = '';
    if (overallPass) {
      messageText = t('overallBothPass');
    } else if (results.ethicsPass && !results.qualityPass) {
      messageText = t('overallEthicsPassQualityFail');
    } else if (!results.ethicsPass && results.qualityPass) {
      messageText = t('overallEthicsFailQualityPass');
    } else {
      messageText = t('overallBothFail');
    }

    overallMessage.className = 'alert alert-info';
    overallMessage.innerHTML = `
      <p>
        <span class="glyphicon mrgn-rght-sm" aria-hidden="true"></span>
        ${messageText}
      </p>
    `;

    // Ethics summary
    renderEthicsSummary();

    // Quality summary
    renderQualitySummary();
  }

  // Render ethics summary
  function renderEthicsSummary() {
    const { ethicsPrinciples, results } = assessmentData;

    // Result
    const ethicsSummaryResult = document.getElementById('ethics-summary-result');
    const alertClass = results.ethicsPass ? 'alert alert-success' : 'alert alert-danger';
    const iconClass = results.ethicsPass ? 'glyphicon-ok-sign' : 'glyphicon-remove-sign';
    const resultText = results.ethicsPass ? t('ethicsPass') : t('ethicsFail');

    ethicsSummaryResult.className = alertClass;
    ethicsSummaryResult.setAttribute('role', 'status');
    ethicsSummaryResult.innerHTML = `
      <p>
        <span class="glyphicon mrgn-rght-sm" aria-hidden="true"></span>
        <strong>${resultText}</strong>
      </p>
    `;

    // Message
    const ethicsSummaryMessage = document.getElementById('ethics-summary-message');
    ethicsSummaryMessage.className = 'alert alert-info';
    ethicsSummaryMessage.innerHTML = `
      <p>
        <span class="glyphicon mrgn-rght-sm" aria-hidden="true"></span>
        ${results.ethicsMessage}
      </p>
    `;

    // Generate list
    let listHTML = '<div class="mrgn-tp-lg">';

    ETHICS_PRINCIPLES.forEach(principle => {
      const answer = ethicsPrinciples[principle.id];
      const answerText = answer === 'Yes' ? t('yes') : answer === 'No' ? t('no') : t('notEvaluated');
      const answerIcon = answer === 'Yes' ? '<span class="glyphicon glyphicon-ok-sign text-success" aria-hidden="true"></span>' : answer === 'No' ? '<span class="glyphicon glyphicon-remove-sign text-danger" aria-hidden="true"></span>' : '<span class="glyphicon glyphicon-question-sign text-muted" aria-hidden="true"></span>';
      const labelClass = answer === 'Yes' ? 'label-success' : answer === 'No' ? 'label-danger' : 'label-default';

      listHTML += `
        <div class="panel panel-default mrgn-bttm-md">
          <div class="panel-body">
            <div class="row">
              <div class="col-sm-8">
                <h5 class="mrgn-tp-0 mrgn-bttm-0">${principle.element}</h5>
              </div>
              <div class="col-sm-4 text-right">
                <span class="h5 mrgn-tp-0 mrgn-bttm-0">
                  ${answerIcon}
                  <span class="label ${labelClass} mrgn-lft-sm" style="font-size: 1em;">${answerText}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    listHTML += '</div>';

    document.getElementById('ethics-summary-table').innerHTML = listHTML;
  }

  // Render quality summary
  function renderQualitySummary() {
    const { qualityDimensions, criteriaSatisfaction, results } = assessmentData;

    // Result
    const qualitySummaryResult = document.getElementById('quality-summary-result');
    const alertClass = results.qualityPass ? 'alert alert-success' : 'alert alert-danger';
    const iconClass = results.qualityPass ? 'glyphicon-ok-sign' : 'glyphicon-remove-sign';
    const resultText = results.qualityPass ? t('qualityPass') : t('qualityFail');

    qualitySummaryResult.className = alertClass;
    qualitySummaryResult.setAttribute('role', 'status');
    qualitySummaryResult.innerHTML = `
      <p>
        <span class="glyphicon mrgn-rght-sm" aria-hidden="true"></span>
        <strong>${resultText}</strong>
      </p>
    `;

    // Message
    const qualitySummaryMessage = document.getElementById('quality-summary-message');
    qualitySummaryMessage.className = 'alert alert-info';
    qualitySummaryMessage.innerHTML = `
      <p>
        <span class="glyphicon mrgn-rght-sm" aria-hidden="true"></span>
        ${results.qualityMessage}
      </p>
    `;

    // Generate summary list
    let summaryHTML = '<div class="mrgn-tp-lg">';

    QUALITY_DIMENSIONS.forEach(dimension => {
      const score = qualityDimensions[dimension.id] || 0;
      const criteria = criteriaSatisfaction[dimension.id] || [];

      // Determine score badge color
      const scoreClass = score === 0 ? 'label-danger' : score === 3 ? 'label-success' : 'label-warning';

      // Calculate criteria satisfaction based on score
      const criteriaSatisfied = [];
      for (let i = 0; i < dimension.criteria.length; i++) {
        if (dimension.id === "3") {
          criteriaSatisfied.push(score >= 2 || (score === 1 && i === 0));
        } else {
          criteriaSatisfied.push(i < score);
        }
      }

      const criteriaHTML = dimension.criteria.map((criterion, idx) => {
        const satisfied = criteriaSatisfied[idx];
        const icon = satisfied ? '<span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>' : '<span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>';
        const statusLabel = satisfied ? `<strong class="text-success">${t('satisfiedLabel')}</strong>` : `<strong class="text-danger">${t('notSatisfiedLabel')}</strong>`;
        return `<li class="mrgn-bttm-sm">${icon} ${statusLabel} ${criterion}</li>`;
      }).join('');

      summaryHTML += `
        <section class="panel panel-primary mrgn-bttm-lg">
          <header class="panel-heading">
            <h4 class="panel-title">${dimension.element}</h4>
          </header>
          <div class="panel-body">
            <div class="row">
              <div class="col-md-12">
                <div class="well well-sm mrgn-bttm-md">
                  <span class="mrgn-tp-0 mrgn-bttm-0">
                    <strong>${t('scoreLabel')}</strong> <span class="label ${scoreClass} mrgn-lft-sm" style="font-size: 1em;">${score}/3</span>
                  </span>
                </div>
              </div>
            </div>
            <h5 class="mrgn-tp-md mrgn-bttm-sm">${t('criteriaAssessmentLabel')}</h5>
            <ul class="fa-ul mrgn-lft-lg">
              ${criteriaHTML}
            </ul>
          </div>
        </section>
      `;
    });

    summaryHTML += '</div>';

    document.getElementById('quality-summary-table').innerHTML = summaryHTML;

    // Total score
    document.getElementById('total-score-display').textContent = `${results.totalQualityScore}/15`;
  }

  // Show export modal
  function showExportModal() {
    var modal = document.getElementById('export-modal');
    if (!modal) return;

    // Show modal
    modal.classList.add('in');
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'block';

    // Add modal-open class to body
    document.body.classList.add('modal-open');

    // Add backdrop if it doesn't exist
    if (!document.querySelector('.modal-backdrop')) {
      var backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade in';
      document.body.appendChild(backdrop);
    }

    generateExportContent();
  }

  // Handle format change
  function handleFormatChange(e) {
    exportFormat = e.target.value;
    generateExportContent();
  }

  // Generate export content
  function generateExportContent() {
    const { ethicsPrinciples, qualityDimensions, criteriaSatisfaction, results } = assessmentData;
    const date = results.date || new Date().toISOString().split('T')[0];
    const overallPass = results.ethicsPass && results.qualityPass;

    let content = '';

    if (exportFormat === 'text') {
      content = generateTextExport(date, overallPass, ethicsPrinciples, qualityDimensions, criteriaSatisfaction, results);
      document.getElementById('export-preview').value = content;
      document.getElementById('export-preview-container').classList.remove('hidden');
      document.getElementById('export-info').classList.add('hidden');
      document.getElementById('copy-btn').disabled = false;
    } else if (exportFormat === 'csv') {
      content = generateCSVExport(date, overallPass, ethicsPrinciples, qualityDimensions, criteriaSatisfaction, results);
      document.getElementById('export-preview').value = content;
      document.getElementById('export-preview-container').classList.remove('hidden');
      document.getElementById('export-info').classList.add('hidden');
      document.getElementById('copy-btn').disabled = false;
    } else if (exportFormat === 'pdf' || exportFormat === 'word') {
      document.getElementById('export-preview-container').classList.add('hidden');
      document.getElementById('export-info').classList.remove('hidden');
      document.getElementById('export-info-text').textContent = exportFormat === 'pdf' ? t('pdfPreview') : t('wordPreview');
      document.getElementById('copy-btn').disabled = true;
    }
  }

  // Generate text export
  function generateTextExport(date, overallPass, ethicsPrinciples, qualityDimensions, criteriaSatisfaction, results) {
    let content = `${t('exportTitle')}\n`;
    content += `${t('dateLabel')} ${date}\n\n`;
    content += `${t('overallResultLabel')} ${overallPass ? t('overallPass') : t('overallFail')}\n\n`;

    // Ethics
    content += `${t('ethicsPrinciplesTitle')}\n`;
    content += `${t('ethicsAssessmentLabel')} ${results.ethicsPass ? t('ethicsPass') : t('ethicsFail')}\n`;
    content += `${t('messageLabel')} ${results.ethicsMessage.replace(/<[^>]*>/g, '')}\n\n`;
    content += `${t('ethicsPrinciplesLabel')}\n`;

    ETHICS_PRINCIPLES.forEach(principle => {
      const answer = ethicsPrinciples[principle.id];
      const answerText = answer === 'Yes' ? t('yes') : answer === 'No' ? t('no') : t('notEvaluated');
      content += `- ${principle.element}: ${answerText}\n`;
    });

    // Quality
    content += `\n${t('qualityDimensionsTitle')}\n`;
    content += `${t('qualityAssessmentLabel')} ${results.qualityPass ? t('qualityPass') : t('qualityFail')} (${t('scoreLabel')} ${results.totalQualityScore}/15)\n`;
    content += `${t('messageLabel')} ${results.qualityMessage.replace(/<[^>]*>/g, '')}\n\n`;
    content += `${t('qualityDimensionsLabel')}\n`;

    QUALITY_DIMENSIONS.forEach(dimension => {
      const score = qualityDimensions[dimension.id] || 0;
      const assessment = getQualityScoreText(score);
      content += `- ${dimension.element}: ${score}/3 - ${assessment}\n`;

      // Criteria details
      const criteriaSatisfied = [];
      for (let i = 0; i < dimension.criteria.length; i++) {
        if (dimension.id === "3") {
          criteriaSatisfied.push(score >= 2 || (score === 1 && i === 0));
        } else {
          criteriaSatisfied.push(i < score);
        }
      }

      content += `  ${t('criteriaDetailsLabel')}\n`;
      dimension.criteria.forEach((criterion, idx) => {
        const status = criteriaSatisfied[idx] ? t('satisfied') : t('notSatisfied');
        content += `    ${idx + 1}. ${criterion}: ${status}\n`;
      });
      content += '\n';
    });

    return content;
  }

  // Generate CSV export
  function generateCSVExport(date, overallPass, ethicsPrinciples, qualityDimensions, criteriaSatisfaction, results) {
    let content = `${t('exportTitle')}\r\n\r\n`;
    content += `${t('summaryLabel')}\r\n`;
    content += `${t('categoryLabel')},${t('resultLabel')}\r\n`;
    content += `${t('dateLabel').replace(':', '')},${date}\r\n`;
    content += `${t('overallResultLabel').replace(':', '')},${overallPass ? t('overallPass') : t('overallFail')}\r\n`;
    content += `${t('ethicsAssessmentLabel').replace(':', '')},${results.ethicsPass ? t('ethicsPass') : t('ethicsFail')}\r\n`;
    content += `${t('qualityAssessmentLabel').replace(':', '')},${results.qualityPass ? t('qualityPass') : t('qualityFail')}\r\n`;
    content += `${t('scoreLabel').replace(':', '')},${results.totalQualityScore}/15\r\n\r\n`;

    // Ethics
    content += `${t('ethicsPrinciplesTitle')}\r\n`;
    content += `${t('ethicsPrincipleLabel')},${t('evaluationLabel')}\r\n`;

    ETHICS_PRINCIPLES.forEach(principle => {
      const answer = ethicsPrinciples[principle.id];
      const answerText = answer === 'Yes' ? t('yes') : answer === 'No' ? t('no') : t('notEvaluated');
      content += `"${principle.element}","${answerText}"\r\n`;
    });

    content += "\r\n";

    // Quality
    content += `${t('qualityDimensionsTitle')}\r\n`;
    content += `${t('qualityDimensionLabel')},${t('scoreLabel').replace(':', '')},${t('assessmentLabel')},${t('criteriaDetailsLabel').replace(':', '')}\r\n`;

    QUALITY_DIMENSIONS.forEach(dimension => {
      const score = qualityDimensions[dimension.id] || 0;
      const assessment = getQualityScoreText(score);

      const criteriaSatisfied = [];
      for (let i = 0; i < dimension.criteria.length; i++) {
        if (dimension.id === "3") {
          criteriaSatisfied.push(score >= 2 || (score === 1 && i === 0));
        } else {
          criteriaSatisfied.push(i < score);
        }
      }

      const criteriaDetails = dimension.criteria.map((criterion, idx) => {
        const status = criteriaSatisfied[idx] ? t('satisfied') : t('notSatisfied');
        return `${idx + 1}. ${criterion}: ${status}`;
      }).join('; ');

      content += `"${dimension.element}",${score}/3,"${assessment}","${criteriaDetails.replace(/"/g, '""')}"\r\n`;
    });

    return content;
  }

  // Handle copy to clipboard
  function handleCopy() {
    const preview = document.getElementById('export-preview');
    preview.select();
    document.execCommand('copy');
    alert('Copied to clipboard!');
  }

  // Handle download
  async function handleDownload() {
    const date = assessmentData.results.date || new Date().toISOString().split('T')[0];
    let fileName = `data-quality-assessment-${date}`;

    if (exportFormat === 'text') {
      fileName += '.txt';
      const blob = new Blob([document.getElementById('export-preview').value], { type: 'text/plain' });
      downloadBlob(blob, fileName);
    } else if (exportFormat === 'csv') {
      fileName += '.csv';
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + document.getElementById('export-preview').value], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, fileName);
    } else if (exportFormat === 'pdf') {
      fileName += '.pdf';
      await generatePDFExport(fileName);
    } else if (exportFormat === 'word') {
      fileName += '.docx';
      await generateWordExport(fileName);
    }
  }

  // Download blob helper
  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Generate PDF export without external library
  function generatePDFExport(fileName) {
    const { ethicsPrinciples, qualityDimensions, criteriaSatisfaction, results } = assessmentData;
    const date = results.date || new Date().toISOString().split('T')[0];
    const overallPass = results.ethicsPass && results.qualityPass;

    // Build HTML content for PDF
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${t('exportTitle')}</title>
  <style>
    @page { margin: 1in; }
    body {
      font-family: Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.4;
    }
    h1 {
      font-size: 18pt;
      font-weight: bold;
      margin-bottom: 12pt;
      page-break-after: avoid;
    }
    h2 {
      font-size: 14pt;
      font-weight: bold;
      margin-top: 24pt;
      margin-bottom: 12pt;
      page-break-after: avoid;
    }
    p { margin: 6pt 0; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 12pt 0;
      page-break-inside: auto;
    }
    tr { page-break-inside: avoid; page-break-after: auto; }
    th, td {
      border: 1px solid black;
      padding: 6pt;
      text-align: left;
    }
    th {
      background-color: #e0e0e0;
      font-weight: bold;
    }
    .criteria-list {
      margin: 6pt 0;
      padding-left: 20pt;
    }
    .criteria-item {
      margin: 3pt 0;
    }
    .status-satisfied {
      color: #006400;
      font-weight: bold;
    }
    .status-not-satisfied {
      color: #8B0000;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>${t('exportTitle')}</h1>
  <p><strong>${t('dateLabel')}</strong> ${date}</p>
  <h2>${t('overallResultLabel')} ${overallPass ? t('passLabel') : t('failLabel')}</h2>

  <h2>${t('ethicsPrinciplesTitle')}</h2>
  <p><strong>${t('assessmentLabel')}:</strong> ${results.ethicsPass ? t('passLabel') : t('failLabel')}</p>

  <table>
    <thead>
      <tr>
        <th>${t('principleLabel')}</th>
        <th>${t('answerTableLabel')}</th>
      </tr>
    </thead>
    <tbody>
`;

    ETHICS_PRINCIPLES.forEach(principle => {
      const answer = ethicsPrinciples[principle.id];
      const answerText = answer === 'Yes' ? t('yes') : answer === 'No' ? t('no') : t('notEvaluated');
      html += `
      <tr>
        <td>${principle.element}</td>
        <td>${answerText}</td>
      </tr>`;
    });

    html += `
    </tbody>
  </table>

  <h2>${t('qualityDimensionsTitle')}</h2>
  <p><strong>${t('assessmentLabel')}:</strong> ${results.qualityPass ? t('passLabel') : t('failLabel')} (${t('scoreLabel')} ${results.totalQualityScore}/15)</p>

  <table>
    <thead>
      <tr>
        <th>${t('dimensionLabel')}</th>
        <th>${t('scoreLabel').replace(':', '')}</th>
        <th>${t('assessmentLabel')}</th>
      </tr>
    </thead>
    <tbody>
`;

    QUALITY_DIMENSIONS.forEach(dimension => {
      const score = qualityDimensions[dimension.id] || 0;
      const assessment = getQualityScoreText(score);
      const criteria = criteriaSatisfaction[dimension.id] || [];

      let criteriaHTML = '<div class="criteria-list">';
      dimension.criteria.forEach((criterion, idx) => {
        const satisfied = criteria[idx] || false;
        const statusClass = satisfied ? 'status-satisfied' : 'status-not-satisfied';
        const statusText = satisfied ? t('satisfied') : t('notSatisfied');
        criteriaHTML += `<div class="criteria-item"><span class="${statusClass}">${statusText}:</span> ${criterion}</div>`;
      });
      criteriaHTML += '</div>';

      html += `
      <tr>
        <td>${dimension.element}${criteriaHTML}</td>
        <td>${score}/3</td>
        <td>${assessment}</td>
      </tr>`;
    });

    html += `
    </tbody>
  </table>
</body>
</html>`;

    // For PDF, we'll use print functionality
    // Open in new window and trigger print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
      // Note: User will need to "Save as PDF" in their print dialog
    };
  }

  // Generate Word export without external library
  function generateWordExport(fileName) {
    const { ethicsPrinciples, qualityDimensions, criteriaSatisfaction, results } = assessmentData;
    const date = results.date || new Date().toISOString().split('T')[0];
    const overallPass = results.ethicsPass && results.qualityPass;

    // Build HTML content for Word
    let html = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${t('exportTitle')}</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; }
    h1 { font-size: 18pt; font-weight: bold; margin-bottom: 12pt; }
    h2 { font-size: 14pt; font-weight: bold; margin-top: 24pt; margin-bottom: 12pt; }
    p { margin: 6pt 0; }
    table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
    th, td { border: 1px solid black; padding: 6pt; text-align: left; }
    th { background-color: #f0f0f0; font-weight: bold; }
  </style>
</head>
<body>
  <h1>${t('exportTitle')}</h1>
  <p><strong>${t('dateLabel')}</strong> ${date}</p>
  <h2>${t('overallResultLabel')} ${overallPass ? t('passLabel') : t('failLabel')}</h2>

  <h2>${t('ethicsPrinciplesTitle')}</h2>
  <p><strong>${t('assessmentLabel')}:</strong> ${results.ethicsPass ? t('passLabel') : t('failLabel')}</p>

  <table>
    <thead>
      <tr>
        <th>${t('principleLabel')}</th>
        <th>${t('answerTableLabel')}</th>
      </tr>
    </thead>
    <tbody>
`;

    ETHICS_PRINCIPLES.forEach(principle => {
      const answer = ethicsPrinciples[principle.id];
      const answerText = answer === 'Yes' ? t('yes') : answer === 'No' ? t('no') : t('notEvaluated');
      html += `
      <tr>
        <td>${principle.element}</td>
        <td>${answerText}</td>
      </tr>`;
    });

    html += `
    </tbody>
  </table>

  <h2>${t('qualityDimensionsTitle')}</h2>
  <p><strong>${t('assessmentLabel')}:</strong> ${results.qualityPass ? t('passLabel') : t('failLabel')} (${t('scoreLabel')} ${results.totalQualityScore}/15)</p>

  <table>
    <thead>
      <tr>
        <th>${t('dimensionLabel')}</th>
        <th>${t('scoreLabel').replace(':', '')}</th>
        <th>${t('assessmentLabel')}</th>
      </tr>
    </thead>
    <tbody>
`;

    QUALITY_DIMENSIONS.forEach(dimension => {
      const score = qualityDimensions[dimension.id] || 0;
      const assessment = getQualityScoreText(score);
      html += `
      <tr>
        <td>${dimension.element}</td>
        <td>${score}/3</td>
        <td>${assessment}</td>
      </tr>`;
    });

    html += `
    </tbody>
  </table>
</body>
</html>`;

    // Create blob with proper MIME type for Word
    const blob = new Blob([html], {
      type: 'application/vnd.ms-word'
    });

    downloadBlob(blob, fileName);
  }

  // Handle reset
  function handleReset(e) {
    e.preventDefault();
    // Clear all localStorage
    localStorage.clear();
    // Redirect to ethics assessment page
    window.location.href = 'ethics-assessment.html';
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
