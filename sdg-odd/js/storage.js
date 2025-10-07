// LocalStorage utility for managing assessment state
const AssessmentStorage = {
  STORAGE_KEY: 'assessment_data',

  // Get all assessment data
  getData() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : this.getDefaultData();
  },

  // Get default/empty assessment data
  getDefaultData() {
    return {
      ethicsPrinciples: {},
      qualityDimensions: {},
      criteriaSatisfaction: {},
      results: {
        ethicsPass: null,
        qualityPass: null,
        overallPass: null,
        totalQualityScore: 0,
        date: null,
        ethicsMessage: '',
        qualityMessage: ''
      }
    };
  },

  // Save all assessment data
  setData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  // Save ethics principles answers
  saveEthicsAnswers(answers) {
    const data = this.getData();
    data.ethicsPrinciples = answers;
    this.setData(data);
  },

  // Save ethics results
  saveEthicsResults(ethicsPass, message) {
    const data = this.getData();
    data.results.ethicsPass = ethicsPass;
    data.results.ethicsMessage = message;
    data.results.date = new Date().toISOString().split('T')[0];
    this.setData(data);
  },

  // Save quality dimensions scores
  saveQualityScores(scores, criteriaSatisfaction) {
    const data = this.getData();
    data.qualityDimensions = scores;
    data.criteriaSatisfaction = criteriaSatisfaction;
    this.setData(data);
  },

  // Save quality results
  saveQualityResults(qualityPass, totalScore, message) {
    const data = this.getData();
    data.results.qualityPass = qualityPass;
    data.results.totalQualityScore = totalScore;
    data.results.qualityMessage = message;
    this.setData(data);
  },

  // Calculate overall pass/fail
  calculateOverallPass() {
    const data = this.getData();
    data.results.overallPass = data.results.ethicsPass && data.results.qualityPass;
    this.setData(data);
    return data.results.overallPass;
  },

  // Reset all assessment data
  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  // Get ethics answers
  getEthicsAnswers() {
    return this.getData().ethicsPrinciples;
  },

  // Get quality scores
  getQualityScores() {
    return this.getData().qualityDimensions;
  },

  // Get criteria satisfaction
  getCriteriaSatisfaction() {
    return this.getData().criteriaSatisfaction;
  },

  // Get results
  getResults() {
    return this.getData().results;
  }
};
