// src/components/layout/Header.tsx
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

interface HeaderProps {
  onTitleClick?: () => void;
}

const Header = ({ onTitleClick }: HeaderProps) => {
  const { t, i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en')
  
  // Update the state when i18n.language changes
  useEffect(() => {
    setCurrentLanguage(i18n.language)
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
          <a className="wb-sl" href="#wb-cont">Skip to main content</a>
        </li>
        <li className="wb-slc visible-sm visible-md visible-lg">
          <a className="wb-sl" href="#wb-info">Skip to "About this site"</a>
        </li>
      </ul>
      
      <header role="banner">
        <div id="wb-bnr" className="container">
          {/* Language Selection */}
          <section id="wb-lng" className="visible-md visible-lg text-right">
            <h2 className="wb-inv">Language selection</h2>
            <div className="row">
              <div className="col-md-12">
                <ul className="list-inline margin-bottom-none">
                  <li>
                    <button 
                      onClick={toggleLanguage}
                      lang={currentLanguage === 'en' ? 'fr' : 'en'}
                      style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {currentLanguage === 'en' ? 'Français' : 'English'}
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
                src="/wet-boew4b/assets/sig-blk-gov-en.svg" 
                alt="Government of Canada"
              />
              <span className="wb-inv"> / <span lang="fr">Gouvernement du Canada</span></span>
            </div>
            
            {/* Mobile Menu Button */}
            <section className="wb-mb-links col-xs-4 col-sm-3 visible-sm visible-xs" id="wb-glb-mn">
              <h2>Search and menus</h2>
              <ul className="list-inline text-right chvrn">
                <li>
                  <a href="#mb-pnl" title="Search and menus" aria-controls="mb-pnl" className="overlay-lnk" role="button">
                    <span className="glyphicon glyphicon-search">
                      <span className="glyphicon glyphicon-th-list">
                        <span className="wb-inv">Search and menus</span>
                      </span>
                    </span>
                  </a>
                </li>
              </ul>
              <div id="mb-pnl"></div>
            </section>
            
            {/* Search Section */}
            <section id="wb-srch" className="col-xs-6 text-right visible-md visible-lg">
              <h2 className="wb-inv">Search</h2>
              <form 
                action="https://www.statcan.gc.ca/search/results/site-search" 
                method="get" 
                name="cse-search-box" 
                role="search" 
                className="form-inline"
              >
                <div className="form-group wb-srch-qry">
                  <label htmlFor="wb-srch-q" className="wb-inv">Search website</label>
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
                    placeholder="Search website"
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
                    <span className="wb-inv">Search</span>
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav role="navigation" id="wb-sm" className="wb-menu visible-md visible-lg" data-trgt="mb-pnl" data-ajax-replace="/wet-boew4b/ajax/sitemenu-en.html" typeof="SiteNavigationElement">
          <div className="container nvbar">
            <h2 className="wb-inv">Topics menu</h2>
            <div className="row">
              <ul className="list-inline menu">
                <li><a href="https://www150.statcan.gc.ca/n1/en/subjects?MM=1">Subjects</a></li>
                <li><a href="https://www150.statcan.gc.ca/n1/en/type/data?MM=1">Data</a></li>
                <li><a href="https://www150.statcan.gc.ca/n1/en/type/analysis?MM=1">Analysis</a></li>
                <li><a href="https://www.statcan.gc.ca/en/reference?MM=1">Reference</a></li>
                <li><a href="https://www.statcan.gc.ca/en/geography?MM=1">Geography</a></li>
                <li><a href="https://www.statcan.gc.ca/en/census?MM=1">Census</a></li>
                <li><a href="https://www.statcan.gc.ca/en/surveys?MM=1">Surveys and statistical programs</a></li>
                <li><a href="https://www.statcan.gc.ca/en/about/statcan?MM=1">About StatCan</a></li>
                <li><a href="https://www.canada.ca/en.html">Canada.ca</a></li>
              </ul>
            </div>
          </div>
        </nav>
        
        {/* Breadcrumb Navigation */}
        <nav role="navigation" id="wb-bc" className="" property="breadcrumb">
          <div className="container">
            <div className="row">
              <ol className="breadcrumb">
                <li><a href="https://www.statcan.gc.ca/en/start">Home</a></li>
                <li><a href="https://www150.statcan.gc.ca/n1/en/subjects">Subjects</a></li>
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