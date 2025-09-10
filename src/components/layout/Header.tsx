// src/components/layout/Header.tsx
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

// Extend window interface for WET-BOEW
declare global {
  interface Window {
    wb?: {
      ajax?: {
        refresh: () => void
      }
      init?: () => void
      menu?: {
        init: () => void
      }
    }
  }
}

interface HeaderProps {
  onTitleClick?: () => void;
}

const Header = ({ onTitleClick }: HeaderProps) => {
  const { t, i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en')
  
  // Update the state when i18n.language changes
  useEffect(() => {
    setCurrentLanguage(i18n.language)
    
    // Trigger WET-BOEW Ajax replacement after language change
    setTimeout(() => {
      // Simple approach: just trigger WET-BOEW refresh
      if (window.wb && window.wb.ajax) {
        window.wb.ajax.refresh()
      }
    }, 100)
  }, [i18n.language])
  
  
  
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'fr' : 'en'
    i18n.changeLanguage(newLanguage)
    setCurrentLanguage(newLanguage)
  }
  
  return (
    <>
      {/* Skip to content links */}
      <ul id="wb-tphp">
        <li className="wb-slc">
          <a className="wb-sl" href="#wb-cont">{t('header.skipToMainContent')}</a>
        </li>
        <li className="wb-slc visible-sm visible-md visible-lg">
          <a className="wb-sl" href="#wb-info">{t('header.skipToAboutSite')}</a>
        </li>
      </ul>
      
      <header role="banner">
        <div id="wb-bnr" className="container">
          {/* Language Selection */}
          <section id="wb-lng" className="visible-md visible-lg text-right">
            <h2 className="wb-inv">{t('header.languageSelection')}</h2>
            <div className="row">
              <div className="col-md-12">
                <ul className="list-inline margin-bottom-none">
                  <li>
                    <button 
                      onClick={toggleLanguage}
                      lang={currentLanguage === 'en' ? 'fr' : 'en'}
                      style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {currentLanguage === 'en' ? t('header.switchToFrench') : t('header.switchToEnglish')}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Header Brand and Search */}
          <div className="row">
            {/* Government of Canada Brand */}
            <div className="brand col-xs-8 col-sm-9 col-md-6">
              <img 
                src={currentLanguage === 'en' ? "./wet-boew4b/assets/sig-blk-gov-en.svg" : "./wet-boew4b/assets/sig-blk-gov-fr.svg"}
                alt={currentLanguage === 'en' ? t('header.governmentOfCanada') : t('header.governmentOfCanadaFr')}
              />
              <span className="wb-inv"> / <span lang={currentLanguage === 'en' ? 'fr' : 'en'}>{currentLanguage === 'en' ? t('header.governmentOfCanadaFr') : t('header.governmentOfCanada')}</span></span>
            </div>
            
            {/* Mobile Menu Button */}
            <section className="wb-mb-links col-xs-4 col-sm-3 visible-sm visible-xs" id="wb-glb-mn">
              <h2>{t('header.searchAndMenus')}</h2>
              <ul className="list-inline text-right chvrn">
                <li>
                  <a href="#mb-pnl" title={t('header.searchAndMenus')} aria-controls="mb-pnl" className="overlay-lnk" role="button">
                    <span className="glyphicon glyphicon-search">
                      <span className="glyphicon glyphicon-th-list">
                        <span className="wb-inv">{t('header.searchAndMenus')}</span>
                      </span>
                    </span>
                  </a>
                </li>
              </ul>
              <div id="mb-pnl"></div>
            </section>
            
            {/* Search Section */}
            <section id="wb-srch" className="col-xs-6 text-right visible-md visible-lg">
              <h2 className="wb-inv">{t('header.search')}</h2>
              <form 
                action={currentLanguage === 'en' ? "https://www.statcan.gc.ca/search/results/site-search" : "https://www.statcan.gc.ca/recherche/resultats/site-recherche"}
                method="get" 
                name="cse-search-box" 
                role="search" 
                className="form-inline"
              >
                <div className="form-group wb-srch-qry">
                  <label htmlFor="wb-srch-q" className="wb-inv">{t('header.searchWebsite')}</label>
                  <input type="hidden" name="fq" value="stclac:2" />
                  <input 
                    id="wb-srch-q" 
                    list="wb-srch-q-ac"
                    className="wb-srch-q form-control" 
                    name="q" 
                    type="search" 
                    value=""
                    size={27} 
                    maxLength={150} 
                    placeholder={t('header.searchWebsite')}
                  />
                  <datalist id="wb-srch-q-ac"></datalist>
                </div>
                <div className="form-group submit">
                  <button 
                    type="submit" 
                    id="wb-srch-sub" 
                    className="btn btn-primary btn-small"
                    name="wb-srch-sub"
                  >
                    <span className="glyphicon-search glyphicon"></span>
                    <span className="wb-inv">{t('header.search')}</span>
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav role="navigation" id="wb-sm" className="wb-menu visible-md visible-lg" data-trgt="mb-pnl" data-ajax-replace={currentLanguage === 'en' ? "/wet-boew4b/ajax/sitemenu-en.html" : "/wet-boew4b/ajax/sitemenu-fr.html"} typeof="SiteNavigationElement">
          <div className="container nvbar">
            <h2 className="wb-inv">{t('header.topicsMenu')}</h2>
            <div className="row">
              <ul className="list-inline menu">
                <li><a href={currentLanguage === 'en' ? "https://www150.statcan.gc.ca/n1/en/subjects?MM=1" : "https://www150.statcan.gc.ca/n1/fr/sujets?MM=1"}>
                  {t('header.subjects')}
                </a></li>
                <li><a href={currentLanguage === 'en' ? "https://www150.statcan.gc.ca/n1/en/type/data?MM=1" : "https://www150.statcan.gc.ca/n1/fr/type/donnees?MM=1"}>
                  {t('header.data')}
                </a></li>
                <li><a href={currentLanguage === 'en' ? "https://www150.statcan.gc.ca/n1/en/type/analysis?MM=1" : "https://www150.statcan.gc.ca/n1/fr/type/analyses?MM=1"}>
                  {t('header.analysis')}
                </a></li>
                <li><a href={currentLanguage === 'en' ? "https://www.statcan.gc.ca/en/reference?MM=1" : "https://www.statcan.gc.ca/fr/references?MM=1"}>
                  {t('header.reference')}
                </a></li>
                <li><a href={currentLanguage === 'en' ? "https://www.statcan.gc.ca/en/geography?MM=1" : "https://www.statcan.gc.ca/fr/geographie?MM=1"}>
                  {t('header.geography')}
                </a></li>
                <li><a href={currentLanguage === 'en' ? "https://www.statcan.gc.ca/en/census?MM=1" : "https://www.statcan.gc.ca/fr/recensement?MM=1"}>
                  {t('header.census')}
                </a></li>
                <li><a href={currentLanguage === 'en' ? "https://www.statcan.gc.ca/en/surveys?MM=1" : "https://www.statcan.gc.ca/fr/enquetes?MM=1"}>
                  {t('header.surveysAndPrograms')}
                </a></li>
                <li><a href={currentLanguage === 'en' ? "https://www.statcan.gc.ca/en/about/statcan?MM=1" : "https://www.statcan.gc.ca/fr/apercu/statcan?MM=1"}>
                  {t('header.aboutStatCan')}
                </a></li>
                <li><a href={currentLanguage === 'en' ? "https://www.canada.ca/en.html" : "https://www.canada.ca/fr.html"}>
                  {t('header.canadaCa')}
                </a></li>
              </ul>
            </div>
          </div>
        </nav>
        
        {/* Breadcrumb Navigation */}
        <nav role="navigation" id="wb-bc" className="" property="breadcrumb">
          <div className="container">
            <div className="row">
              <ol className="breadcrumb">
                <li><a href={currentLanguage === 'en' ? "https://www.statcan.gc.ca/en/start" : "https://www.statcan.gc.ca/fr/debut"}>
                  {t('header.home')}
                </a></li>
                <li><a href={currentLanguage === 'en' ? "https://www150.statcan.gc.ca/n1/en/subjects" : "https://www150.statcan.gc.ca/n1/fr/sujets"}>
                  {t('header.subjects')}
                </a></li>
                <li>
                  <button 
                    onClick={onTitleClick}
                    style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    {t('header.title')}
                  </button>
                </li>
              </ol>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Header