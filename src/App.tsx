// src/App.tsx
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import MainContent from './components/MainContent'
import React from 'react'

function App() {
  const [currentYear] = useState(new Date().getFullYear())
  const { t, i18n } = useTranslation()
  
  const mainContentRef = React.useRef<{ handleReturnHome: () => void } | null>(null)
  
  const handleTitleClick = () => {
    if (mainContentRef.current) {
      mainContentRef.current.handleReturnHome()
    }
  }

  // Update document language attribute when language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.title = i18n.language === 'en' ? 'Data Suitability Assessment Tool' : 'Outil d\'évaluation de l\'adéquation des données'
  }, [i18n.language])

  return (
    <>
      <Header onTitleClick={handleTitleClick} />
      
      <main role="main" property="mainContentOfPage" className="container">
        <section>
          <h1 property="name" id="wb-cont">{t('mainContent.title')}</h1>
          <MainContent ref={mainContentRef} />
        </section>
        <div className="pagedetails">
          <dl id="wb-dtmd">
            <dt>{t('mainContent.dateModified')}&#32;</dt>
            <dd>
              <time property="dateModified">{new Date().toISOString().split('T')[0]}</time>
            </dd>
          </dl>
        </div>
      </main>
      
      <Footer year={currentYear} />
    </>
  )
}

export default App