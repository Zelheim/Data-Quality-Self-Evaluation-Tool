// Quality Assessment Page Logic
(function() {
  let qualityScores = {};
  let criteriaSatisfaction = {};
  let totalScore = 0;
  let showResult = false;

  // Initialize the page
  function init() {
    // Load saved data
    qualityScores = AssessmentStorage.getQualityScores();
    criteriaSatisfaction = AssessmentStorage.getCriteriaSatisfaction();

    // Initialize default values
    QUALITY_DIMENSIONS.forEach(dimension => {
      if (qualityScores[dimension.id] === undefined) {
        qualityScores[dimension.id] = 0;
      }
      if (!criteriaSatisfaction[dimension.id]) {
        criteriaSatisfaction[dimension.id] = new Array(dimension.criteria.length).fill(false);
      }
    });

    // Calculate total score
    calculateTotalScore();

    // Render dimensions
    renderQualityDimensions();

    // Setup event listeners
    document.getElementById('evaluate-quality-btn').addEventListener('click', handleEvaluate);
    document.getElementById('continue-quality-btn').addEventListener('click', handleContinue);
  }

  // Calculate total score
  function calculateTotalScore() {
    totalScore = Object.values(qualityScores).reduce((sum, score) => sum + score, 0);
  }

  // Render quality dimensions form
  function renderQualityDimensions() {
    const list = document.getElementById('quality-dimensions-list');
    list.innerHTML = '';

    QUALITY_DIMENSIONS.forEach(dimension => {
      const li = document.createElement('li');
      li.className = 'mrgn-bttm-lg';

      const checkboxesHTML = dimension.criteria.map((criterion, idx) => {
        const checked = criteriaSatisfaction[dimension.id]?.[idx] || false;
        return `
          <div class="checkbox">
            <label for="quality-${dimension.id}-${idx}">
              <input
                id="quality-${dimension.id}-${idx}"
                type="checkbox"
                data-dimension-id="${dimension.id}"
                data-criterion-idx="${idx}"
                ${checked ? 'checked' : ''}
                aria-describedby="quality-el-${dimension.id}"
              />
              ${criterion}
            </label>
          </div>
        `;
      }).join('');

      li.innerHTML = `
        <div class="panel panel-default">
          <div class="panel-body">
            <fieldset>
              <legend id="quality-el-${dimension.id}">${dimension.element}</legend>

              <p class="mrgn-tp-md"><strong>Definition:</strong></p>
              <p>${dimension.definition}</p>

              <p class="mrgn-tp-md"><strong>Criteria:</strong></p>
              <div id="quality-crit-${dimension.id}">
                ${checkboxesHTML}
              </div>

              <div class="well mrgn-tp-md">
                <p class="mrgn-tp-0 mrgn-bttm-0">
                  <strong>Score:</strong> <span id="score-${dimension.id}">${qualityScores[dimension.id] || 0}/${dimension.maxScore}</span>
                </p>
              </div>
            </fieldset>
          </div>
        </div>
      `;

      list.appendChild(li);
    });

    // Add change listeners
    document.querySelectorAll('input[type="checkbox"][data-dimension-id]').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const dimensionId = this.dataset.dimensionId;
        const criterionIdx = parseInt(this.dataset.criterionIdx);
        handleCriteriaChange(dimensionId, criterionIdx, this.checked);
      });
    });
  }

  // Handle criteria checkbox change
  function handleCriteriaChange(dimensionId, criterionIdx, checked) {
    if (!criteriaSatisfaction[dimensionId]) {
      const dimension = QUALITY_DIMENSIONS.find(d => d.id === dimensionId);
      criteriaSatisfaction[dimensionId] = new Array(dimension.criteria.length).fill(false);
    }

    criteriaSatisfaction[dimensionId][criterionIdx] = checked;

    // Calculate score for this dimension
    const satisfiedCount = criteriaSatisfaction[dimensionId].filter(Boolean).length;

    // Special case for Accessibility and clarity (dimension 3)
    let score = satisfiedCount;
    if (dimensionId === "3" && satisfiedCount === 2) {
      score = 3;
    }

    qualityScores[dimensionId] = score;

    // Update display
    const scoreDisplay = document.getElementById(`score-${dimensionId}`);
    const dimension = QUALITY_DIMENSIONS.find(d => d.id === dimensionId);
    if (scoreDisplay) {
      scoreDisplay.textContent = `${score}/${dimension.maxScore}`;
    }

    // Calculate and save total score
    calculateTotalScore();
    AssessmentStorage.saveQualityScores(qualityScores, criteriaSatisfaction);
  }

  // Handle evaluate button click
  function handleEvaluate() {
    // Check if any dimension has a score of 0
    const hasZeroScore = QUALITY_DIMENSIONS.some(dimension =>
      qualityScores[dimension.id] === 0
    );

    // Fail if any score is 0 or if total score is less than 10
    const qualityPass = !hasZeroScore && totalScore >= 10;

    // Determine message
    let message = '';
    if (hasZeroScore) {
      message = t('qualityFailMessage');
    } else if (totalScore <= 9) {
      message = t('qualityLowMessage');
    } else if (totalScore >= 10 && totalScore <= 12) {
      message = t('qualityMediumMessage');
    } else if (totalScore >= 13) {
      message = t('qualityHighMessage');
    }

    // Save results
    AssessmentStorage.saveQualityResults(qualityPass, totalScore, message);

    // Show results
    showResults(qualityPass, message);
  }

  // Show results
  function showResults(qualityPass, message) {
    showResult = true;

    const resultsSection = document.getElementById('quality-results');
    const summaryTable = document.getElementById('quality-summary-table');
    const totalScoreDisplay = document.getElementById('total-score-display');
    const resultDisplay = document.getElementById('quality-result-display');
    const resultMessage = document.getElementById('quality-result-message');

    resultsSection.classList.remove('hidden');

    // Generate summary table
    let tableHTML = `
      <table class="table table-bordered">
        <caption class="sr-only">Data Quality Dimensions Summary</caption>
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
      const score = qualityScores[dimension.id] || 0;
      const criteria = criteriaSatisfaction[dimension.id] || [];

      const criteriaHTML = dimension.criteria.map((criterion, idx) => {
        const satisfied = criteria[idx] || false;
        const icon = satisfied ? '✓' : '✗';
        const colorClass = satisfied ? 'text-success' : 'text-danger';
        return `<div class="${colorClass}">${icon} ${criterion}</div>`;
      }).join('');

      tableHTML += `
        <tr>
          <td><strong>${dimension.element}</strong></td>
          <td class="text-center">${score}/${dimension.maxScore}</td>
          <td>${criteriaHTML}</td>
        </tr>
      `;
    });

    tableHTML += `
        </tbody>
      </table>
    `;

    summaryTable.innerHTML = tableHTML;

    // Total score
    totalScoreDisplay.textContent = `${totalScore}/15`;

    // Result display
    const alertClass = qualityPass ? 'alert alert-success' : 'alert alert-danger';
    const iconClass = qualityPass ? 'glyphicon-ok-sign' : 'glyphicon-remove-sign';
    const resultText = qualityPass ? t('qualityPass') : t('qualityFail');

    resultDisplay.innerHTML = `
      <div class="${alertClass}" role="alert" aria-live="polite">
        <p>
          <span class="glyphicon mrgn-rght-sm" aria-hidden="true"></span>
          <strong>${resultText}</strong>
        </p>
      </div>
    `;

    // Result message
    resultMessage.className = 'alert alert-info';
    resultMessage.setAttribute('role', 'status');
    resultMessage.setAttribute('aria-live', 'polite');
    resultMessage.innerHTML = `
      <p>
        <span class="glyphicon mrgn-rght-sm" aria-hidden="true"></span>
        ${message}
      </p>
    `;

    // Switch buttons
    document.getElementById('evaluate-quality-btn').classList.add('hidden');
    document.getElementById('continue-quality-btn').classList.remove('hidden');

    // Focus on results
    setTimeout(() => {
      resultsSection.focus();
    }, 100);
  }

  // Handle continue button click
  function handleContinue() {
    AssessmentStorage.calculateOverallPass();
    window.location.href = '/sdg-odd/en/overall-assessment.html';
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
