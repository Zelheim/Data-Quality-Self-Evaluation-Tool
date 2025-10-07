// Ethics Assessment Page Logic
(function() {
  let ethicsAnswers = {};
  let showResult = false;

  // Initialize the page
  function init() {
    // Load saved data
    ethicsAnswers = AssessmentStorage.getEthicsAnswers();

    // Render principles
    renderEthicsPrinciples();

    // Setup event listeners
    document.getElementById('evaluate-btn').addEventListener('click', handleEvaluate);
    document.getElementById('continue-btn').addEventListener('click', handleContinue);
  }

  // Render ethics principles form
  function renderEthicsPrinciples() {
    const list = document.getElementById('ethics-principles-list');
    list.innerHTML = '';

    ETHICS_PRINCIPLES.forEach(principle => {
      const li = document.createElement('li');
      li.className = 'mrgn-bttm-lg';

      li.innerHTML = `
        <div class="well mrgn-bttm-0">
          <fieldset>
            <legend id="ethics-el-${principle.id}" class="h3 mrgn-tp-0 mrgn-bttm-md">
              ${principle.element}
            </legend>

            <div class="mrgn-bttm-md">
              <h4 class="mrgn-bttm-sm">Explanation</h4>
              <p>${principle.explanation}</p>
            </div>

            <div class="mrgn-bttm-md">
              <h4 class="mrgn-bttm-sm">Criteria</h4>
              <p id="ethics-crit-${principle.id}">${principle.criteria}</p>
            </div>

            <div class="form-group mrgn-tp-md mrgn-bttm-0">
              <label for="ethics-${principle.id}" class="required">
                <span class="field-name">Answer</span>
                <strong class="required" aria-hidden="true">(required)</strong>
              </label>
              <select
                id="ethics-${principle.id}"
                class="form-control"
                data-principle-id="${principle.id}"
                aria-labelledby="ethics-el-${principle.id}"
                aria-describedby="ethics-crit-${principle.id}"
                aria-required="true"
              >
                <option value="">Select</option>
                <option value="Yes" ${ethicsAnswers[principle.id] === 'Yes' ? 'selected' : ''}>Yes</option>
                <option value="No" ${ethicsAnswers[principle.id] === 'No' ? 'selected' : ''}>No</option>
              </select>
              <span id="ethics-${principle.id}-error" class="error text-danger hidden mrgn-tp-sm">
                <span class="label label-danger">
                  <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                  This field is required.
                </span>
              </span>
            </div>
          </fieldset>
        </div>
      `;

      list.appendChild(li);
    });

    // Add change listeners
    document.querySelectorAll('select[data-principle-id]').forEach(select => {
      select.addEventListener('change', function() {
        const principleId = this.dataset.principleId;
        ethicsAnswers[principleId] = this.value;
        AssessmentStorage.saveEthicsAnswers(ethicsAnswers);

        // Hide error for this field
        const errorEl = document.getElementById(`ethics-${principleId}-error`);
        if (errorEl) {
          errorEl.classList.add('hidden');
        }
      });
    });
  }

  // Validate answers
  function validateAnswers() {
    const errors = [];
    let allAnswered = true;

    // Hide error summary
    document.getElementById('error-summary').classList.add('hidden');

    ETHICS_PRINCIPLES.forEach(principle => {
      const answer = ethicsAnswers[principle.id];
      const errorEl = document.getElementById(`ethics-${principle.id}-error`);

      if (!answer || answer === '') {
        allAnswered = false;
        errors.push({
          id: principle.id,
          message: `${principle.element}: This field is required.`
        });
        if (errorEl) {
          errorEl.classList.remove('hidden');
        }
      } else {
        if (errorEl) {
          errorEl.classList.add('hidden');
        }
      }
    });

    if (!allAnswered) {
      // Show error summary
      const errorSummary = document.getElementById('error-summary');
      const errorList = document.getElementById('error-list');
      errorList.innerHTML = '';

      errors.forEach(error => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#ethics-${error.id}">${error.message}</a>`;
        errorList.appendChild(li);
      });

      errorSummary.classList.remove('hidden');
      errorSummary.focus();
      return false;
    }

    return true;
  }

  // Handle evaluate button click
  function handleEvaluate() {
    if (!validateAnswers()) {
      return;
    }

    // Calculate pass/fail
    const noAnswers = Object.values(ethicsAnswers).filter(a => a === 'No').length;
    const ethicsPass = noAnswers === 0;

    // Determine message
    const message = ethicsPass ? t('ethicsPassMessage') : t('ethicsFailMessage');

    // Save results
    AssessmentStorage.saveEthicsResults(ethicsPass, message);

    // Show results
    showResults(ethicsPass, message);
  }

  // Show results
  function showResults(ethicsPass, message) {
    showResult = true;

    const resultsSection = document.getElementById('ethics-results');
    const resultDisplay = document.getElementById('ethics-result-display');
    const resultMessage = document.getElementById('ethics-result-message');

    resultsSection.classList.remove('hidden');

    // Result display
    const alertClass = ethicsPass ? 'alert alert-success' : 'alert alert-danger';
    const iconClass = ethicsPass ? 'glyphicon-ok-sign' : 'glyphicon-remove-sign';
    const resultText = ethicsPass ? t('ethicsPass') : t('ethicsFail');

    resultDisplay.className = alertClass;
    resultDisplay.setAttribute('role', 'alert');
    resultDisplay.setAttribute('aria-live', 'polite');
    resultDisplay.innerHTML = `
      <p>
        <span class="glyphicon mrgn-rght-sm" aria-hidden="true"></span>
        <strong>${resultText}</strong>
      </p>
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
    document.getElementById('evaluate-btn');
    document.getElementById('continue-btn').classList.remove('hidden');

    // Focus on results
    setTimeout(() => {
      resultsSection.focus();
    }, 100);
  }

  // Handle continue button click
  function handleContinue() {
    window.location.href = '/sdg-odd/en/quality-assessment.html';
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
