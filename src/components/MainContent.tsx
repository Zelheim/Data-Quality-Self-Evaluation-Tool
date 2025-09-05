// src/components/MainContent.tsx (updated version)
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore - React is used for JSX
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import FrontPage from './tabs/FrontPage'
import AssessmentTool from './tabs/AssessmentTool'
import License from './tabs/License'

export interface MainContentRef {
  handleReturnHome: () => void;
}

const MainContent = forwardRef<MainContentRef>((_, ref) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('front-page')
  const [showTabsNavigation, setShowTabsNavigation] = useState(false)
  const [currentYear] = useState(() => new Date().getFullYear())
  
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
    setActiveTab('assessment-tab-panel')
    setShowTabsNavigation(true)
  }

  const handleReturnHome = () => {
    setActiveTab('front-page')
    setShowTabsNavigation(false)
    // Reset assessment state when returning home
    setCurrentStep('ethics')
    setEthicsAnswers({})
    setEthicsPass(null)
    setPart1MessageKey('')
    setQualityScores({})
    setTotalQualityScore(0)
    setQualityPass(null)
    setQualityInterpretationKey('')
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
    <div className="container">
      {/* This component uses React JSX */}
      {activeTab === 'front-page' && (
        <FrontPage onStartAssessment={handleStartAssessment} />
      )}
      
      {showTabsNavigation && (
        <div className="wb-tabs">
          <div className="tabpanels">
            <details 
              id="assessment-details" 
              open={activeTab === 'assessment-tab-panel'}
            >
              <summary 
                className="btn btn-primary btn-lg"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('assessment-tab-panel');
                }}
              >
                {t('mainContent.tabs.assessment')}
              </summary>
              {activeTab === 'assessment-tab-panel' && (
                <div className="tabbedcontent">
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
            </details>
            
            <details 
              id="license-details" 
              open={activeTab === 'license-tab-panel'}
            >
              <summary 
                className="btn btn-default btn-lg"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('license-tab-panel');
                }}
              >
                {t('mainContent.tabs.license')}
              </summary>
              {activeTab === 'license-tab-panel' && (
                <div className="tabbedcontent">
                  <License currentYear={currentYear} />
                </div>
              )}
            </details>
          </div>
        </div>
      )}
    </div>
  )
})

MainContent.displayName = 'MainContent'

export default MainContent