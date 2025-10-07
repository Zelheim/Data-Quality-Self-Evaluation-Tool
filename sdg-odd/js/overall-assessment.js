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
    document.getElementById('export-btn').addEventListener('click', showExportModal);
    document.getElementById('reset-btn').addEventListener('click', handleReset);
    document.getElementById('export-format-select').addEventListener('change', handleFormatChange);
    document.getElementById('copy-btn').addEventListener('click', handleCopy);
    document.getElementById('download-btn').addEventListener('click', handleDownload);
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

    // Table
    let tableHTML = `
      <table class="table table-bordered">
        <caption class="sr-only">Data Ethics Principles Assessment</caption>
        <thead>
          <tr>
            <th scope="col">Elements</th>
            <th scope="col">Answer</th>
          </tr>
        </thead>
        <tbody>
    `;

    ETHICS_PRINCIPLES.forEach(principle => {
      const answer = ethicsPrinciples[principle.id];
      const answerText = answer === 'Yes' ? t('yes') : answer === 'No' ? t('no') : t('notEvaluated');

      tableHTML += `
        <tr>
          <td><strong>${principle.element}</strong></td>
          <td>${answerText}</td>
        </tr>
      `;
    });

    tableHTML += `
        </tbody>
      </table>
    `;

    document.getElementById('ethics-summary-table').innerHTML = tableHTML;
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

    // Table
    let tableHTML = `
      <table class="table table-bordered">
        <caption class="sr-only">Data Quality Dimensions Assessment</caption>
        <thead>
          <tr>
            <th scope="col">Dimension</th>
            <th scope="col" class="text-center">Score</th>
            <th scope="col">Criteria Satisfied ✓ or Not Satisfied ✗</th>
          </tr>
        </thead>
        <tbody>
    `;

    QUALITY_DIMENSIONS.forEach(dimension => {
      const score = qualityDimensions[dimension.id] || 0;
      const criteria = criteriaSatisfaction[dimension.id] || [];

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
        const icon = satisfied ? '✓' : '✗';
        const colorClass = satisfied ? 'text-success' : 'text-danger';
        return `<div class="${colorClass}">${icon} ${criterion}</div>`;
      }).join('');

      tableHTML += `
        <tr>
          <td><strong>${dimension.element}</strong></td>
          <td class="text-center">${score}/3</td>
          <td>${criteriaHTML}</td>
        </tr>
      `;
    });

    tableHTML += `
        </tbody>
      </table>
    `;

    document.getElementById('quality-summary-table').innerHTML = tableHTML;

    // Total score
    document.getElementById('total-score-display').textContent = `${results.totalQualityScore}/15`;
  }

  // Show export modal
  function showExportModal() {
    // Use WET-BOEW's modal via data attribute or directly via jQuery
    var $modal = $('#export-modal');
    $modal.addClass('in').attr('aria-hidden', 'false').css('display', 'block');
    $('body').addClass('modal-open');

    // Add backdrop
    if ($('.modal-backdrop').length === 0) {
      $('<div class="modal-backdrop fade in"></div>').appendTo('body');
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
    let content = `Data Quality Suitability Tool - Overall Assessment\n`;
    content += `Date: ${date}\n\n`;
    content += `Overall Result: ${overallPass ? t('overallPass') : t('overallFail')}\n\n`;

    // Ethics
    content += `DATA ETHICS PRINCIPLES\n`;
    content += `Data Ethics Principles Assessment: ${results.ethicsPass ? t('ethicsPass') : t('ethicsFail')}\n`;
    content += `Message: ${results.ethicsMessage.replace(/<[^>]*>/g, '')}\n\n`;
    content += `Data Ethics Principles:\n`;

    ETHICS_PRINCIPLES.forEach(principle => {
      const answer = ethicsPrinciples[principle.id];
      const answerText = answer === 'Yes' ? t('yes') : answer === 'No' ? t('no') : t('notEvaluated');
      content += `- ${principle.element}: ${answerText}\n`;
    });

    // Quality
    content += `\nDATA QUALITY DIMENSIONS\n`;
    content += `Data Quality Dimensions Assessment: ${results.qualityPass ? t('qualityPass') : t('qualityFail')} (Score: ${results.totalQualityScore}/15)\n`;
    content += `Message: ${results.qualityMessage.replace(/<[^>]*>/g, '')}\n\n`;
    content += `Data Quality Dimensions:\n`;

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

      content += `  Criteria Details:\n`;
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
    let content = `Data Quality Suitability Tool - Overall Assessment\r\n\r\n`;
    content += `SUMMARY\r\n`;
    content += `Category,Result\r\n`;
    content += `Date,${date}\r\n`;
    content += `Overall Result,${overallPass ? t('overallPass') : t('overallFail')}\r\n`;
    content += `Data Ethics Principles Assessment,${results.ethicsPass ? t('ethicsPass') : t('ethicsFail')}\r\n`;
    content += `Data Quality Dimensions Assessment,${results.qualityPass ? t('qualityPass') : t('qualityFail')}\r\n`;
    content += `Score,${results.totalQualityScore}/15\r\n\r\n`;

    // Ethics
    content += `DATA ETHICS PRINCIPLES\r\n`;
    content += `Data Ethics Principle,Evaluation\r\n`;

    ETHICS_PRINCIPLES.forEach(principle => {
      const answer = ethicsPrinciples[principle.id];
      const answerText = answer === 'Yes' ? t('yes') : answer === 'No' ? t('no') : t('notEvaluated');
      content += `"${principle.element}","${answerText}"\r\n`;
    });

    content += "\r\n";

    // Quality
    content += `DATA QUALITY DIMENSIONS\r\n`;
    content += `Data Quality Dimension,Score,Assessment,Criteria Details\r\n`;

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

  // Generate PDF export
  async function generatePDFExport(fileName) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const { ethicsPrinciples, qualityDimensions, results } = assessmentData;
    const date = results.date || new Date().toISOString().split('T')[0];
    const overallPass = results.ethicsPass && results.qualityPass;

    let yPosition = 20;
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Data Quality Suitability Tool - Overall Assessment', margin, yPosition);
    yPosition += 15;

    // Date
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date: ${date}`, margin, yPosition);
    yPosition += 20;

    // Overall Result
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Overall Result: ${overallPass ? 'Pass' : 'Fail'}`, margin, yPosition);
    yPosition += 15;

    // Ethics Section
    pdf.setFontSize(12);
    pdf.text('DATA ETHICS PRINCIPLES', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    ETHICS_PRINCIPLES.forEach(principle => {
      const answer = ethicsPrinciples[principle.id];
      const answerText = answer === 'Yes' ? 'Yes' : answer === 'No' ? 'No' : 'Not evaluated';
      pdf.text(`${principle.element}: ${answerText}`, margin, yPosition);
      yPosition += 8;
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = margin;
      }
    });

    yPosition += 10;

    // Quality Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DATA QUALITY DIMENSIONS', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    QUALITY_DIMENSIONS.forEach(dimension => {
      const score = qualityDimensions[dimension.id] || 0;
      const assessment = getQualityScoreText(score);

      pdf.setFont('helvetica', 'bold');
      pdf.text(`${dimension.element}: ${score}/3 - ${assessment}`, margin, yPosition);
      yPosition += 8;

      pdf.setFont('helvetica', 'normal');
      dimension.criteria.forEach((criterion, idx) => {
        const criteriaSatisfied = dimension.id === "3" ? (score >= 2 || (score === 1 && idx === 0)) : (idx < score);
        const status = criteriaSatisfied ? 'SATISFIED' : 'NOT SATISFIED';
        const criteriaText = `  ${idx + 1}. ${criterion}: ${status}`;
        const splitCriteria = pdf.splitTextToSize(criteriaText, pageWidth - 2 * margin);
        pdf.text(splitCriteria, margin, yPosition);
        yPosition += splitCriteria.length * 4;

        if (yPosition > 270) {
          pdf.addPage();
          yPosition = margin;
        }
      });
      yPosition += 5;
    });

    pdf.save(fileName);
  }

  // Generate Word export - Note: This is a simplified version
  // For full Word export with docx library, you would need to include the library
  async function generateWordExport(fileName) {
    // For now, create a simple HTML document that can be opened in Word
    const { ethicsPrinciples, qualityDimensions, results } = assessmentData;
    const date = results.date || new Date().toISOString().split('T')[0];
    const overallPass = results.ethicsPass && results.qualityPass;

    let html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head><meta charset='utf-8'><title>Data Quality Assessment</title></head>
      <body>
        <h1>Data Quality Suitability Tool - Overall Assessment</h1>
        <p>Date: ${date}</p>
        <h2>Overall Result: ${overallPass ? 'Pass' : 'Fail'}</h2>

        <h2>DATA ETHICS PRINCIPLES</h2>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr><th>Principle</th><th>Answer</th></tr>
    `;

    ETHICS_PRINCIPLES.forEach(principle => {
      const answer = ethicsPrinciples[principle.id];
      const answerText = answer === 'Yes' ? 'Yes' : answer === 'No' ? 'No' : 'Not evaluated';
      html += `<tr><td>${principle.element}</td><td>${answerText}</td></tr>`;
    });

    html += `
        </table>
        <h2>DATA QUALITY DIMENSIONS</h2>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr><th>Dimension</th><th>Score</th><th>Assessment</th></tr>
    `;

    QUALITY_DIMENSIONS.forEach(dimension => {
      const score = qualityDimensions[dimension.id] || 0;
      const assessment = getQualityScoreText(score);
      html += `<tr><td>${dimension.element}</td><td>${score}/3</td><td>${assessment}</td></tr>`;
    });

    html += `
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
    });

    downloadBlob(blob, fileName);
  }

  // Handle reset
  function handleReset() {
    if (confirm('Are you sure you want to reset the assessment? All data will be lost.')) {
      AssessmentStorage.reset();
      window.location.href = '/sdg-odd/en/index.html';
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
