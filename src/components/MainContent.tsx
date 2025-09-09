// src/components/MainContent.tsx (updated version)
import { useState, forwardRef, useImperativeHandle } from 'react'
import FrontPage from './tabs/FrontPage'
import AssessmentTool from './tabs/AssessmentTool'
// import License from './tabs/License' // COMMENTED OUT: License tab is hidden

export interface MainContentRef {
  handleReturnHome: () => void;
}

const MainContent = forwardRef<MainContentRef>((_, ref) => {
  const [activeTab, setActiveTab] = useState('front-page')
  // const [showTabsNavigation, setShowTabsNavigation] = useState(false) // COMMENTED OUT: No tab navigation
  // const [currentYear] = useState(() => new Date().getFullYear()) // COMMENTED OUT: Not needed for license tab
  
  // Assessment state lifted up to preserve across tab switches
  const [currentStep, setCurrentStep] = useState<'ethics' | 'quality' | 'overall'>('ethics')
  const [ethicsAnswers, setEthicsAnswers] = useState<Record<string, string>>({})
  const [ethicsPass, setEthicsPass] = useState<boolean | null>(null)
  const [part1MessageKey, setPart1MessageKey] = useState<string>('')
  const [qualityScores, setQualityScores] = useState<Record<string, number>>({})
  const [totalQualityScore, setTotalQualityScore] = useState(0)
  const [qualityPass, setQualityPass] = useState<boolean | null>(null)
  const [qualityInterpretationKey, setQualityInterpretationKey] = useState('')
  
  // UI state to preserve result display across tab switches
  const [ethicsShowResult, setEthicsShowResult] = useState(false)
  const [qualityShowResult, setQualityShowResult] = useState(false)
  const [qualityInterpretation, setQualityInterpretation] = useState('')
  const [criteriaSatisfaction, setCriteriaSatisfaction] = useState<Record<string, boolean[]>>({})
  
  const handleStartAssessment = () => {
    setActiveTab('assessment-tool')
  }

  const handleReturnHome = () => {
    setActiveTab('front-page')
    // Reset assessment state when returning home (still functional for reset button)
    setCurrentStep('ethics')
    setEthicsAnswers({})
    setEthicsPass(null)
    setPart1MessageKey('')
    setQualityScores({})
    setTotalQualityScore(0)
    setQualityPass(null)
    setQualityInterpretationKey('')
    // Reset UI state
    setEthicsShowResult(false)
    setQualityShowResult(false)
    setQualityInterpretation('')
    setCriteriaSatisfaction({})
  }
  
  // Expose handleReturnHome method to parent component
  useImperativeHandle(ref, () => ({
    handleReturnHome
  }))
  
  return (
    <>
      {activeTab === 'front-page' && (
        <FrontPage onStartAssessment={handleStartAssessment} />
      )}
      
      {/* COMMENTED OUT: Tab navigation - keeping only front page and direct assessment tool */}
      {/* 
      {showTabsNavigation && (
        <div className="mrgn-tp-md">
          {/* Bootstrap/WET-BOEW Tab Navigation */}
          {/* 
          <ul className="nav nav-tabs" role="tablist" aria-label={t('mainContent.navigation')}>
            <li role="presentation" className={activeTab === 'assessment-tab-panel' ? 'active' : ''}>
              <a
                href="#assessment-tab-panel"
                role="tab"
                aria-controls="assessment-tab-panel"
                aria-selected={activeTab === 'assessment-tab-panel'}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('assessment-tab-panel');
                }}
                className="nav-link"
              >
                {t('mainContent.tabs.assessment')}
              </a>
            </li>
            <li role="presentation" className={activeTab === 'license-tab-panel' ? 'active' : ''}>
              <a
                href="#license-tab-panel"
                role="tab"
                aria-controls="license-tab-panel"
                aria-selected={activeTab === 'license-tab-panel'}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('license-tab-panel');
                }}
                className="nav-link"
              >
                {t('mainContent.tabs.license')}
              </a>
            </li>
          </ul>
          */}
          
          {/* Tab Content */}
          {/* 
          <div className="tab-content">
            <div 
              id="assessment-tab-panel"
              className={`tab-pane ${activeTab === 'assessment-tab-panel' ? 'active in' : ''}`}
              role="tabpanel"
              aria-labelledby="assessment-tab"
              tabIndex={0}
            >
              {activeTab === 'assessment-tab-panel' && (
                <AssessmentTool 
                  onReturnHome={handleReturnHome}
                  // Pass assessment state as props
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  ethicsAnswers={ethicsAnswers}
                  setEthicsAnswers={setEthicsAnswers}
                  ethicsPass={ethicsPass}
                  setEthicsPass={setEthicsPass}
                  part1MessageKey={part1MessageKey}
                  setPart1MessageKey={setPart1MessageKey}
                  qualityScores={qualityScores}
                  setQualityScores={setQualityScores}
                  totalQualityScore={totalQualityScore}
                  setTotalQualityScore={setTotalQualityScore}
                  qualityPass={qualityPass}
                  setQualityPass={setQualityPass}
                  qualityInterpretationKey={qualityInterpretationKey}
                  setQualityInterpretationKey={setQualityInterpretationKey}
                  // Pass UI state as props
                  ethicsShowResult={ethicsShowResult}
                  setEthicsShowResult={setEthicsShowResult}
                  qualityShowResult={qualityShowResult}
                  setQualityShowResult={setQualityShowResult}
                  qualityInterpretation={qualityInterpretation}
                  setQualityInterpretation={setQualityInterpretation}
                  criteriaSatisfaction={criteriaSatisfaction}
                  setCriteriaSatisfaction={setCriteriaSatisfaction}
                />
              )}
            </div>
            
            <div 
              id="license-tab-panel"
              className={`tab-pane ${activeTab === 'license-tab-panel' ? 'active in' : ''}`}
              role="tabpanel"
              aria-labelledby="license-tab"
              tabIndex={0}
            >
              {activeTab === 'license-tab-panel' && (
                <License currentYear={currentYear} />
              )}
            </div>
          </div>
        </div>
      )}
      */}

      {activeTab === 'assessment-tool' && (
        <div className="mrgn-tp-md">
          <AssessmentTool 
            onReturnHome={handleReturnHome}
            // Pass assessment state as props
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            ethicsAnswers={ethicsAnswers}
            setEthicsAnswers={setEthicsAnswers}
            ethicsPass={ethicsPass}
            setEthicsPass={setEthicsPass}
            part1MessageKey={part1MessageKey}
            setPart1MessageKey={setPart1MessageKey}
            qualityScores={qualityScores}
            setQualityScores={setQualityScores}
            totalQualityScore={totalQualityScore}
            setTotalQualityScore={setTotalQualityScore}
            qualityPass={qualityPass}
            setQualityPass={setQualityPass}
            qualityInterpretationKey={qualityInterpretationKey}
            setQualityInterpretationKey={setQualityInterpretationKey}
            // Pass UI state as props
            ethicsShowResult={ethicsShowResult}
            setEthicsShowResult={setEthicsShowResult}
            qualityShowResult={qualityShowResult}
            setQualityShowResult={setQualityShowResult}
            qualityInterpretation={qualityInterpretation}
            setQualityInterpretation={setQualityInterpretation}
            criteriaSatisfaction={criteriaSatisfaction}
            setCriteriaSatisfaction={setCriteriaSatisfaction}
          />
        </div>
      )}
    </>
  )
})

MainContent.displayName = 'MainContent'

export default MainContent