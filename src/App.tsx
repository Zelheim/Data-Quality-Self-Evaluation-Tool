// src/App.tsx
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import MainContent from './components/MainContent'
import React from 'react'

function App() {
  const [currentYear] = useState(new Date().getFullYear())
  const { i18n } = useTranslation()
  
  const mainContentRef = React.useRef<{ handleReturnHome: () => void } | null>(null)
  
  const handleTitleClick = () => {
    if (mainContentRef.current) {
      mainContentRef.current.handleReturnHome()
    }
  }

  // Update document language attribute when language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.title = i18n.language === 'en' ? 'Data Suitability Assessment Tool - Canada.ca' : 'Outil d\'évaluation de l\'adéquation des données - Canada.ca'
  }, [i18n.language])

  return (
    <div className="newpar">
      {/* Skip to main content link */}
      <ul id="wb-tphp">
        <li className="wb-slc">
          <a className="wb-sl" href="#wb-cont">
            {i18n.language === 'en' ? 'Skip to main content' : 'Passer au contenu principal'}
          </a>
        </li>
        <li className="wb-slc visible-sm visible-md visible-lg">
          <a className="wb-sl" href="#wb-info">
            {i18n.language === 'en' ? 'Skip to "About this site"' : 'Passer à « À propos de ce site »'}
          </a>
        </li>
      </ul>
      
      <Header onTitleClick={handleTitleClick} />
      
      <main property="mainContentOfPage" resource="#wb-main" className="container" typeof="WebPageElement">
        <div className="row">
          <div className="col-md-12">
            <h1 id="wb-cont" property="name">
              {i18n.language === 'en' ? 'Data Suitability Assessment Tool' : 'Outil d\'évaluation de l\'adéquation des données'}
            </h1>
            <div className="assessment-container">
              <MainContent ref={mainContentRef} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer year={currentYear} />
    </div>
  )
}

export default App