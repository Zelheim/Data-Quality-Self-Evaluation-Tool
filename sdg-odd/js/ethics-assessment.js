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
    document.getElementById('evaluate-btn-resubmit').addEventListener('click', handleEvaluate);
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
            <legend id="ethics-el-${principle.id}" class="mrgn-tp-0 mrgn-bttm-md">
              ${principle.element}
            </legend>

            <div class="mrgn-bttm-md">
              <h3 class="mrgn-bttm-sm">${t('explanationLabel')}</h3>
              <p>${principle.explanation}</p>
            </div>

            <div class="mrgn-bttm-md">
              <h3 class="mrgn-bttm-sm">${t('criteriaLabel')}</h3>
              <p id="ethics-crit-${principle.id}">${principle.criteria}</p>
            </div>

            <div class="form-group mrgn-tp-md mrgn-bttm-0">
              <label for="ethics-${principle.id}" class="required">
                <span class="field-name">${t('answerLabel')}</span>
                <strong class="required" aria-hidden="true">${t('requiredLabel')}</strong>
              </label>
              <select
                id="ethics-${principle.id}"
                class="form-control"
                data-principle-id="${principle.id}"
                aria-labelledby="ethics-el-${principle.id}"
                aria-describedby="ethics-crit-${principle.id}"
                aria-required="true"
              >
                <option value="">${t('selectOption')}</option>
                <option value="Yes" ${ethicsAnswers[principle.id] === 'Yes' ? 'selected' : ''}>${t('yes')}</option>
                <option value="No" ${ethicsAnswers[principle.id] === 'No' ? 'selected' : ''}>${t('no')}</option>
              </select>
              <span id="ethics-${principle.id}-error" class="error text-danger hidden mrgn-tp-sm">
                <span class="label label-danger">
                  <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                  ${t('requiredFieldError')}
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
          message: `${principle.element}: ${t('requiredFieldError')}`
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

    // Hide submit button container and show results
    document.getElementById('submit-button-container').classList.add('hidden');
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

    // Focus on results
    setTimeout(() => {
      resultsSection.focus();
    }, 100);
  }

  // Handle continue button click
  function handleContinue() {
    // Detect language from HTML lang attribute
    const lang = document.documentElement.lang || 'en';
    const langPath = lang === 'fr' ? 'fr' : 'en';
    window.location.href = `/sdg-odd/${langPath}/quality-assessment.html`;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
