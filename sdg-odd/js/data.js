// Assessment data definitions
const ETHICS_PRINCIPLES = [
  {
    id: "1",
    element: "Benefit to Canadians",
    explanation: "The information acquired and utilized must provide a clear and easily communicated benefit to Canadians. The data must support Canada's reporting on the Sustainable Development Goals (<abbr>SDGs</abbr>) by enabling the measurement of an unreported indicator or by providing more granular data for an indicator already reported.",
    criteria: "Does the information provide a clear benefit to Canadians?"
  },
  {
    id: "2",
    element: "Fairness and do no harm",
    explanation: "Data that include potentially sensitive topics require a dissemination plan to alleviate any potential harm, unfairness or risk of amplifying stereotypes and stigma on groups featured in the data. Additionally, the appropriate partners should be consulted throughout the process to discuss any potential fairness and harm issues. The data must use the appropriate terminology and categories to describe the various population groups featured.",
    criteria: "Are potentially sensitive topics handled in a way that ensures fairness and causes no harm?"
  },
  {
    id: "3",
    element: "Transparency and accountability",
    explanation: "The methods used to transform the information to produce statistics must be communicated clearly to ensure transparency. The methodology used must be documented and continually monitored alongside its outputs to ensure continued robustness and relevance for the reporting.",
    criteria: "Are the methods used understood, monitored and communicated regularly alongside its outputs?"
  },
  {
    id: "4",
    element: "Privacy",
    explanation: "Protecting the privacy of respondents throughout the statistical process is critical. Privacy refers to the right of the respondent to decide how their personal data are collected and used. The privacy of respondents must be maintained during all the steps of the statistical process.",
    criteria: "Is the privacy of respondents respected?"
  },
  {
    id: "5",
    element: "Confidentiality",
    explanation: "Ensuring that the data do not contain confidential information, such as personal information or identifying characteristics is critical to ensuring confidentiality. Some examples of methods that can help include limiting access to confidential information to a need to know basis while limiting collection to strictly necessary information from fully consenting individuals.",
    criteria: "Is confidentiality maintained?"
  }
];

const QUALITY_DIMENSIONS = [
  {
    id: "1",
    element: "Accuracy and reliability",
    definition: "The accuracy of statistical information is the degree to which the information correctly describes the phenomena it was designed to measure. Reliability reflects the degree to which statistical information correctly describes the phenomena it was designed to measure consistently over time. The data must accurately and reliably measure Canada's progress for a selected <abbr title=\"Sustainable Development Goals\">SDG</abbr> indicator over time.",
    criteria: [
      "There are no or few missing values.",
      "There are established verification rules for data validation.",
      "Documented quality assurance processes were followed."
    ],
    maxScore: 3
  },
  {
    id: "2",
    element: "Timeliness and punctuality",
    definition: "The timeliness of statistical information refers to the delay between the information reference period and the date on which the information becomes available. Punctuality refers to the difference between planned and actual availability. The data must provide a measure of Canada's progress on the <abbr title=\"Sustainable Development Goals\">SDGs</abbr> at planned and regular intervals through time covering the period of the Agenda 2030.",
    criteria: [
      "Data are available in a timely manner.",
      "Data are released at regular intervals.",
      "Data are published on planned dates."
    ],
    maxScore: 3
  },
  {
    id: "3",
    element: "Accessibility and clarity",
    definition: "The accessibility and clarity of data and supporting information refer to the ease with which users can learn that the information exists, find it, view it and use it. The data and their supporting information must be easily accessible and harvested to facilitate its use in Canada's reporting on the <abbr title=\"Sustainable Development Goals\">SDGs</abbr>.",
    criteria: [
      "Data and supporting information are easily accessible.",
      "Data and supporting information are provided in an easy-to-use format."
    ],
    maxScore: 3
  },
  {
    id: "4",
    element: "Interpretability",
    definition: "The interpretability of statistical information refers to the availability of accompanying information needed to interpret the data and possibly reproduce it. This information normally covers the underlying concepts, the reference period of the data, the variables, the classifications used as well as the methodology of the data collection and processing.",
    criteria: [
      "A description of the methods used to collect, process and analyze the data is available to users.",
      "The definition of all variables, code sets and classifications used is provided to the users.",
      "The reference period of the data is well defined and communicated."
    ],
    maxScore: 3
  },
  {
    id: "5",
    element: "Coherence and comparability",
    definition: "The coherence and comparability of statistical information refer to the degree to which it can be reliably combined and compared with other statistical information and over time. The use of common concepts (e.g., terminology, classification, methodology etc.) are critical to ensuring coherence and facilitate its use in Canada's reporting on the <abbr title=\"Sustainable Development Goals\">SDGs</abbr>.",
    criteria: [
      "Standard concepts are used.",
      "Comparability is maintained over time and across regions.",
      "Any inconsistencies or break in the time series are explained."
    ],
    maxScore: 3
  }
];

const TRANSLATIONS = {
  en: {
    ethicsPass: "Pass",
    ethicsFail: "Fail",
    qualityPass: "Pass",
    qualityFail: "Fail",
    overallPass: "Pass",
    overallFail: "Fail",
    yes: "Yes",
    no: "No",
    notEvaluated: "Not evaluated",
    scoreDisplay: "{score}/{maxScore}",
    qualityScoreText: {
      notSufficient: "Not sufficient",
      low: "Low",
      medium: "Medium",
      high: "High"
    },
    ethicsPassMessage: "As evaluated above, the data are considered fit for purpose for <abbr title=\"Sustainable Development Goals\">SDG</abbr> reporting.",
    ethicsFailMessage: "As evaluated above, the data are not considered fit for purpose for <abbr title=\"Sustainable Development Goals\">SDG</abbr> reporting. To learn more about and improve on data ethics and data quality, please refer to <a href=\"https://www.statcan.gc.ca/en/trust\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:text-blue-800 hover:underline\">Statistics Canada's Trust Center</a>.",
    qualityLowMessage: "As evaluated above, the quality of the data is not considered fit for purpose for <abbr title=\"Sustainable Development Goals\">SDG</abbr> reporting. To learn more about and improve on data ethics and data quality, please refer to <a href=\"https://www.statcan.gc.ca/en/trust\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:text-blue-800 hover:underline\">Statistics Canada's Trust Center</a>.",
    qualityMediumMessage: "As evaluated above, the quality of the data is considered fit for purpose for <abbr title=\"Sustainable Development Goals\">SDG</abbr> reporting but could be improved. To learn more about and improve on data ethics and data quality, please refer to <a href=\"https://www.statcan.gc.ca/en/trust\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:text-blue-800 hover:underline\">Statistics Canada's Trust Center</a>.",
    qualityHighMessage: "As evaluated above, the quality of the data is considered fit for purpose for <abbr title=\"Sustainable Development Goals\">SDG</abbr> reporting.",
    qualityFailMessage: "As evaluated above, the quality of the data is not considered fit for purpose for <abbr title=\"Sustainable Development Goals\">SDG</abbr> reporting. To learn more about and improve on data ethics and data quality, please refer to <a href=\"https://www.statcan.gc.ca/en/trust\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:text-blue-800 hover:underline\">Statistics Canada's Trust Center</a>.",
    overallBothPass: "As evaluated, the data are considered fit for purpose for <abbr title=\"Sustainable Development Goals\">SDG</abbr> reporting.",
    overallEthicsFailQualityPass: "As evaluated, the data are not considered fit for purpose for <abbr title=\"Sustainable Development Goals\">SDG</abbr> reporting. The data must satisfy all core data ethics principles to be suitable for <abbr title=\"Sustainable Development Goals\">SDG</abbr> reporting. To learn more about and improve on data ethics and data quality, please refer to <a href=\"https://www.statcan.gc.ca/en/trust\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:text-blue-800 hover:underline\">Statistics Canada's Trust Center</a>.",
    overallEthicsPassQualityFail: "As evaluated, the data are not considered fit for purpose for <abbr title=\"Sustainable Development Goals\">SDG</abbr> reporting. The data must obtain a minimum score of 10 on the assessment against the dimensions of quality criteria. To learn more about and improve on data ethics and data quality, please refer to <a href=\"https://www.statcan.gc.ca/en/trust\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:text-blue-800 hover:underline\">Statistics Canada's Trust Center</a>.",
    overallBothFail: "As evaluated, the data are not considered fit for purpose for <abbr title=\"Sustainable Development Goals\">SDG</abbr> reporting. To learn more about and improve on data ethics and data quality, please refer to <a href=\"https://www.statcan.gc.ca/en/trust\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:text-blue-800 hover:underline\">Statistics Canada's Trust Center</a>.",
    requiredFieldError: "This field is required.",
    allFieldsRequired: "Please provide answers to all criteria.",
    exportFormats: {
      text: "Text",
      csv: "CSV",
      pdf: "PDF",
      word: "DOCX"
    },
    pdfPreview: "A PDF report will be generated when you click Download.",
    wordPreview: "A Word document report will be generated when you click Download.",
    satisfied: "SATISFIED",
    notSatisfied: "NOT SATISFIED",
    satisfiedLabel: "Satisfied:",
    notSatisfiedLabel: "Not Satisfied:",
    scoreLabel: "Score:",
    criteriaAssessmentLabel: "Criteria Assessment:",
    exportTitle: "Data Suitability Assessment Tool - Overall Assessment",
    dateLabel: "Date:",
    overallResultLabel: "Overall Result:",
    ethicsPrinciplesTitle: "DATA ETHICS PRINCIPLES",
    ethicsAssessmentLabel: "Data Ethics Principles Assessment:",
    messageLabel: "Message:",
    ethicsPrinciplesLabel: "Data Ethics Principles:",
    qualityDimensionsTitle: "DATA QUALITY DIMENSIONS",
    qualityAssessmentLabel: "Data Quality Dimensions Assessment:",
    qualityDimensionsLabel: "Data Quality Dimensions:",
    criteriaDetailsLabel: "Criteria Details:",
    summaryLabel: "SUMMARY",
    categoryLabel: "Category",
    resultLabel: "Result",
    ethicsPrincipleLabel: "Data Ethics Principle",
    evaluationLabel: "Evaluation",
    qualityDimensionLabel: "Data Quality Dimension",
    assessmentLabel: "Assessment",
    principleLabel: "Principle",
    answerTableLabel: "Answer",
    dimensionLabel: "Dimension",
    passLabel: "PASS",
    failLabel: "FAIL",
    explanationLabel: "Explanation",
    criteriaLabel: "Criteria",
    answerLabel: "Answer",
    requiredLabel: "(required)",
    selectOption: "Select",
    definitionLabel: "Definition",
    scoringLabel: "Score",
    criteriaSelectAll: "Criteria (select all that apply)"
  }
};

// Get translation function
function t(key, replacements = {}) {
  const lang = 'en'; // For now, only English

  // Handle nested keys (e.g., 'qualityScoreText.high')
  const keys = key.split('.');
  let text = TRANSLATIONS[lang];

  for (const k of keys) {
    if (text && typeof text === 'object' && k in text) {
      text = text[k];
    } else {
      text = key; // Return the key if not found
      break;
    }
  }

  // Handle replacements
  if (typeof text === 'string') {
    Object.keys(replacements).forEach(placeholder => {
      text = text.replace(`{${placeholder}}`, replacements[placeholder]);
    });
  }

  return text;
}

function getQualityScoreText(score) {
  if (score === 0) return t('qualityScoreText.notSufficient');
  if (score === 1) return t('qualityScoreText.low');
  if (score === 2) return t('qualityScoreText.medium');
  if (score === 3) return t('qualityScoreText.high');
  return "";
}
