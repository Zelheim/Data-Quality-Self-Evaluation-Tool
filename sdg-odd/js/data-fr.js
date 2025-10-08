// Assessment data definitions (French)
const ETHICS_PRINCIPLES = [
  {
    id: "1",
    element: "Avantages pour la population canadienne",
    explanation: "Les renseignements obtenus et utilisés doivent fournir à la population canadienne un avantage clair et facile à communiquer. Les données doivent appuyer les rapports du Canada sur les objectifs de développement durable (<abbr>ODD</abbr>) en permettant la mesure d'un indicateur non présenté ou en fournissant des données plus granulaires pour un indicateur déjà présenté.",
    criteria: "Les renseignements fournissent-ils un avantage clair à la population canadienne?"
  },
  {
    id: "2",
    element: "Équité et absence de préjudice",
    explanation: "Les données qui incluent des sujets potentiellement sensibles nécessitent un plan de diffusion pour atténuer tout préjudice potentiel, toute injustice ou tout risque d'amplification des stéréotypes et de la stigmatisation des groupes présentés dans les données. De plus, les partenaires appropriés doivent être consultés tout au long du processus pour discuter de tout problème potentiel d'équité et de préjudice. Les données doivent utiliser la terminologie et les catégories appropriées pour décrire les différents groupes de population présentés.",
    criteria: "Les sujets potentiellement sensibles sont-ils traités de manière à assurer l'équité et à ne causer aucun préjudice?"
  },
  {
    id: "3",
    element: "Transparence et responsabilisation",
    explanation: "Les méthodes utilisées pour transformer les renseignements afin de produire des statistiques doivent être communiquées clairement pour assurer la transparence. La méthodologie utilisée doit être documentée et continuellement surveillée avec ses résultats pour assurer une robustesse et une pertinence continues pour les rapports.",
    criteria: "Les méthodes utilisées sont-elles comprises, surveillées et communiquées régulièrement avec leurs résultats?"
  },
  {
    id: "4",
    element: "Protection de la vie privée",
    explanation: "Protéger la vie privée des répondants tout au long du processus statistique est crucial. La vie privée se réfère au droit du répondant de décider comment ses données personnelles sont collectées et utilisées. La vie privée des répondants doit être maintenue pendant toutes les étapes du processus statistique.",
    criteria: "La vie privée des répondants est-elle respectée?"
  },
  {
    id: "5",
    element: "Confidentialité",
    explanation: "S'assurer que les données ne contiennent pas d'informations confidentielles, telles que des informations personnelles ou des caractéristiques d'identification, est crucial pour assurer la confidentialité. Quelques exemples de méthodes qui peuvent aider incluent limiter l'accès aux informations confidentielles selon le principe du « besoin de savoir » tout en limitant la collecte aux informations strictement nécessaires de personnes pleinement consentantes.",
    criteria: "La confidentialité est-elle maintenue?"
  }
];

const QUALITY_DIMENSIONS = [
  {
    id: "1",
    element: "Exactitude et fiabilité",
    definition: "L'exactitude des renseignements statistiques désigne la mesure dans laquelle les renseignements décrivent correctement le phénomène qu'ils sont censés mesurer. La fiabilité correspond à la mesure dans laquelle les renseignements statistiques décrivent correctement, et de façon constante au fil du temps, le phénomène qu'ils sont censés mesurer. Les données doivent mesurer, avec exactitude et fiabilité, les progrès accomplis par le Canada à l'égard d'un indicateur choisi des <abbr title=\"Objectifs de développement durable\">ODD</abbr>.",
    criteria: [
      "Il n'y a pas ou peu de valeurs manquantes.",
      "Des règles de vérification sont établies pour la validation des données.",
      "Des processus d'assurance qualité documentés ont été suivis."
    ],
    maxScore: 3
  },
  {
    id: "2",
    element: "Actualité et ponctualité",
    definition: "L'actualité des renseignements statistiques se réfère au délai entre la période de référence de l'information et la date à laquelle l'information devient disponible. La ponctualité se réfère à la différence entre la disponibilité planifiée et réelle. Les données doivent fournir une mesure des progrès du Canada sur les <abbr title=\"Objectifs de développement durable\">ODD</abbr> à des intervalles planifiés et réguliers dans le temps couvrant la période de l'Agenda 2030.",
    criteria: [
      "Les données sont disponibles en temps opportun.",
      "Les données sont diffusées à des intervalles réguliers.",
      "Les données sont publiées aux dates prévues."
    ],
    maxScore: 3
  },
  {
    id: "3",
    element: "Accessibilité et clarté",
    definition: "L'accessibilité et la clarté des données et des informations de soutien se réfèrent à la facilité avec laquelle les utilisateurs peuvent apprendre que l'information existe, la trouver, la visualiser et l'utiliser. Les données et leurs informations de soutien doivent être facilement accessibles et récoltables pour faciliter leur utilisation dans les rapports du Canada sur les <abbr title=\"Objectifs de développement durable\">ODD</abbr>.",
    criteria: [
      "Les données et les renseignements à l'appui sont facilement accessibles.",
      "Les données et les renseignements à l'appui sont fournis dans un format convivial."
    ],
    maxScore: 3
  },
  {
    id: "4",
    element: "Intelligibilité",
    definition: "L'intelligibilité des renseignements statistiques se réfère à la disponibilité des informations d'accompagnement nécessaires pour interpréter les données et possiblement les reproduire. Ces informations couvrent normalement les concepts sous-jacents, la période de référence des données, les variables, les classifications utilisées ainsi que la méthodologie de collecte et de traitement des données.",
    criteria: [
      "Les utilisateurs et les utilisatrices ont accès à une description des méthodes utilisées pour recueillir, traiter et analyser les données.",
      "Les utilisateurs et les utilisatrices ont accès aux définitions de l'ensemble des variables, des ensembles de codes et des classifications utilisés.",
      "La période de référence des données est bien définie et communiquée."
    ],
    maxScore: 3
  },
  {
    id: "5",
    element: "Cohérence et comparabilité",
    definition: "La cohérence et la comparabilité des renseignements statistiques se réfèrent à la mesure dans laquelle ils peuvent être combinés et comparés de manière fiable avec d'autres renseignements statistiques et dans le temps. L'utilisation de concepts communs (par ex. terminologie, classification, méthodologie, etc.) sont cruciaux pour assurer la cohérence et faciliter leur utilisation dans les rapports du Canada sur les <abbr title=\"Objectifs de développement durable\">ODD</abbr>.",
    criteria: [
      "Des concepts normalisés sont utilisés.",
      "La comparabilité est maintenue au fil du temps et d'une région à l'autre.",
      "Toute incohérence ou rupture dans la série chronologique est expliquée."
    ],
    maxScore: 3
  }
];

const TRANSLATIONS = {
  fr: {
    ethicsPass: "Réussite",
    ethicsFail: "Échec",
    qualityPass: "Réussite",
    qualityFail: "Échec",
    overallPass: "Réussite",
    overallFail: "Échec",
    yes: "Oui",
    no: "Non",
    notEvaluated: "Non évalué",
    scoreDisplay: "{score}/{maxScore}",
    qualityScoreText: {
      notSufficient: "Insuffisant",
      low: "Faible",
      medium: "Moyen",
      high: "Élevé"
    },
    ethicsPassMessage: "Telles qu'évaluées ci-dessus, les données sont considérées comme adéquates à l'utilisation pour les rapports sur les <abbr title=\"Objectifs de développement durable\">ODD</abbr>.",
    ethicsFailMessage: "Telles qu'évaluées ci-dessus, les données ne sont pas considérées comme adéquates à l'utilisation pour les rapports sur les <abbr title=\"Objectifs de développement durable\">ODD</abbr>. Pour en savoir plus et améliorer l'éthique et la qualité des données, veuillez consulter le <a href=\"https://www.statcan.gc.ca/fr/confiance\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:text-blue-800 hover:underline\">Centre de confiance de Statistique Canada</a>.",
    qualityLowMessage: "Telle qu'évaluée ci-dessus, la qualité des données n'est pas considérée comme adéquate à l'utilisation pour les rapports sur les <abbr title=\"Objectifs de développement durable\">ODD</abbr>. Pour en savoir plus et améliorer l'éthique et la qualité des données, veuillez consulter le <a href=\"https://www.statcan.gc.ca/fr/confiance\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:text-blue-800 hover:underline\">Centre de confiance de Statistique Canada</a>.",
    qualityMediumMessage: "Telle qu'évaluée ci-dessus, la qualité des données est considérée comme adéquate à l'utilisation pour les rapports sur les <abbr title=\"Objectifs de développement durable\">ODD</abbr> mais pourrait être améliorée. Pour en savoir plus et améliorer l'éthique et la qualité des données, veuillez consulter le <a href=\"https://www.statcan.gc.ca/fr/confiance\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:text-blue-800 hover:underline\">Centre de confiance de Statistique Canada</a>.",
    qualityHighMessage: "Telle qu'évaluée ci-dessus, la qualité des données est considérée comme adéquate à l'utilisation pour les rapports sur les <abbr title=\"Objectifs de développement durable\">ODD</abbr>.",
    qualityFailMessage: "Telle qu'évaluée ci-dessus, la qualité des données n'est pas considérée comme adéquate à l'utilisation pour les rapports sur les <abbr title=\"Objectifs de développement durable\">ODD</abbr>. Pour en savoir plus et améliorer l'éthique et la qualité des données, veuillez consulter le <a href=\"https://www.statcan.gc.ca/fr/confiance\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:text-blue-800 hover:underline\">Centre de confiance de Statistique Canada</a>.",
    overallBothPass: "Telles qu'évaluées, les données sont considérées comme adéquates à l'utilisation pour les rapports sur les <abbr title=\"Objectifs de développement durable\">ODD</abbr>.",
    overallEthicsFailQualityPass: "Telles qu'évaluées, les données ne sont pas considérées comme adéquates à l'utilisation pour les rapports sur les <abbr title=\"Objectifs de développement durable\">ODD</abbr>. Les données doivent satisfaire tous les principes fondamentaux d'éthique des données pour être considérées comme adéquates à l'utilisation pour les rapports sur les <abbr title=\"Objectifs de développement durable\">ODD</abbr>. Pour en savoir plus et améliorer l'éthique et la qualité des données, veuillez consulter le <a href=\"https://www.statcan.gc.ca/fr/confiance\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:text-blue-800 hover:underline\">Centre de confiance de Statistique Canada</a>.",
    overallEthicsPassQualityFail: "Telles qu'évaluées, les données ne sont pas considérées comme adéquates à l'utilisation pour les rapports sur les <abbr title=\"Objectifs de développement durable\">ODD</abbr>. Les données doivent obtenir un score minimum de 10 sur l'évaluation par rapport aux critères des dimensions de qualité. Pour en savoir plus et améliorer l'éthique et la qualité des données, veuillez consulter le <a href=\"https://www.statcan.gc.ca/fr/confiance\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:text-blue-800 hover:underline\">Centre de confiance de Statistique Canada</a>.",
    overallBothFail: "Telles qu'évaluées, les données ne sont pas considérées comme adéquates à l'utilisation pour les rapports sur les <abbr title=\"Objectifs de développement durable\">ODD</abbr>. Pour en savoir plus et améliorer l'éthique et la qualité des données, veuillez consulter le <a href=\"https://www.statcan.gc.ca/fr/confiance\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-600 hover:text-blue-800 hover:underline\">Centre de confiance de Statistique Canada</a>.",
    requiredFieldError: "Ce champ est obligatoire.",
    allFieldsRequired: "Veuillez fournir des réponses pour tous les critères.",
    exportFormats: {
      text: "Texte",
      csv: "CSV",
      pdf: "PDF",
      word: "DOCX"
    },
    pdfPreview: "Un rapport PDF sera généré lorsque vous cliquez sur Télécharger.",
    wordPreview: "Un rapport Word sera généré lorsque vous cliquez sur Télécharger.",
    satisfied: "RESPECTÉ",
    notSatisfied: "NON RESPECTÉ",
    satisfiedLabel: "Respecté :",
    notSatisfiedLabel: "Non respecté :",
    scoreLabel: "Note :",
    criteriaAssessmentLabel: "Évaluation des critères :",
    exportTitle: "Outil d'évaluation de la qualité des données - Évaluation globale",
    dateLabel: "Date :",
    overallResultLabel: "Résultat global :",
    ethicsPrinciplesTitle: "PRINCIPES D'ÉTHIQUE DES DONNÉES",
    ethicsAssessmentLabel: "Évaluation des principes d'éthique des données :",
    messageLabel: "Message :",
    ethicsPrinciplesLabel: "Principes d'éthique des données :",
    qualityDimensionsTitle: "DIMENSIONS DE QUALITÉ DES DONNÉES",
    qualityAssessmentLabel: "Évaluation des dimensions de qualité des données :",
    qualityDimensionsLabel: "Dimensions de qualité des données :",
    criteriaDetailsLabel: "Détails des critères :",
    summaryLabel: "RÉSUMÉ",
    categoryLabel: "Catégorie",
    resultLabel: "Résultat",
    ethicsPrincipleLabel: "Principe d'éthique des données",
    evaluationLabel: "Évaluation",
    qualityDimensionLabel: "Dimension de qualité des données",
    assessmentLabel: "Évaluation",
    principleLabel: "Principe",
    answerTableLabel: "Réponse",
    dimensionLabel: "Dimension",
    passLabel: "RÉUSSITE",
    failLabel: "ÉCHEC",
    explanationLabel: "Explication",
    criteriaLabel: "Critères",
    answerLabel: "Réponse",
    requiredLabel: "(obligatoire)",
    selectOption: "Sélectionner",
    definitionLabel: "Définition",
    scoringLabel: "Note",
    criteriaSelectAll: "Critères (sélectionner tous ceux qui s'appliquent)"
  }
};

// Get translation function
function t(key, replacements = {}) {
  const lang = 'fr';

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
