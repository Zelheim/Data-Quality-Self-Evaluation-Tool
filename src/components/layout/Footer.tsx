// components/layout/Footer.tsx
import { useTranslation } from 'react-i18next'

interface FooterProps {
    year: number
  }
  
  const Footer = ({ year }: FooterProps) => {
    const { t, i18n } = useTranslation()
    
    return (
      <footer id="wb-info">
        <h2 className="wb-inv">{i18n.language === 'en' ? 'About this site' : 'À propos de ce site'}</h2>
        
        {/* Statistics Canada specific footer section */}
        <div className="gc-contextual">
          <div className="container">
            <nav>
              <h3>{i18n.language === 'en' ? 'Statistics Canada' : 'Statistique Canada'}</h3>
              <ul className="list-unstyled colcount-sm-2 colcount-md-3">
                <li>
                  <a href="https://www.statcan.gc.ca/en/reference/refcentre/index">
                    {i18n.language === 'en' ? 'Contact StatCan' : 'Contactez StatCan'}
                  </a>
                </li>
                <li>
                  <a href="https://www.statcan.gc.ca/en/trust">
                    {i18n.language === 'en' ? 'Trust Centre' : 'Centre de confiance'}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Main Government of Canada footer */}
        <div className="gc-main-footer">
          <div className="container">
            <nav>
              <h3>{i18n.language === 'en' ? 'Government of Canada' : 'Gouvernement du Canada'}</h3>
              <ul className="list-unstyled colcount-sm-2 colcount-md-3">
                <li>
                  <a href="https://www.canada.ca/en/contact.html">
                    {i18n.language === 'en' ? 'All contacts' : 'Tous les contacts'}
                  </a>
                </li>
                <li>
                  <a href="https://www.canada.ca/en/government/dept.html">
                    {i18n.language === 'en' ? 'Departments and agencies' : 'Ministères et organismes'}
                  </a>
                </li>
                <li>
                  <a href="https://www.canada.ca/en/government/system.html">
                    {i18n.language === 'en' ? 'About government' : 'À propos du gouvernement'}
                  </a>
                </li>
              </ul>
              
              <h4><span className="wb-inv">{i18n.language === 'en' ? 'Themes and topics' : 'Thèmes et sujets'}</span></h4>
              <ul className="list-unstyled colcount-sm-2 colcount-md-3">
                <li><a href="https://www.canada.ca/en/services/jobs.html">{i18n.language === 'en' ? 'Jobs' : 'Emplois'}</a></li>
                <li><a href="https://www.canada.ca/en/services/immigration-citizenship.html">{i18n.language === 'en' ? 'Immigration and citizenship' : 'Immigration et citoyenneté'}</a></li>
                <li><a href="https://travel.gc.ca/">{i18n.language === 'en' ? 'Travel and tourism' : 'Voyage et tourisme'}</a></li>
                <li><a href="https://www.canada.ca/en/services/business.html">{i18n.language === 'en' ? 'Business' : 'Entreprises'}</a></li>
                <li><a href="https://www.canada.ca/en/services/benefits.html">{i18n.language === 'en' ? 'Benefits' : 'Prestations'}</a></li>
                <li><a href="https://www.canada.ca/en/services/health.html">{i18n.language === 'en' ? 'Health' : 'Santé'}</a></li>
                <li><a href="https://www.canada.ca/en/services/taxes.html">{i18n.language === 'en' ? 'Taxes' : 'Impôts'}</a></li>
                <li><a href="https://www.canada.ca/en/services/environment.html">{i18n.language === 'en' ? 'Environment and natural resources' : 'Environnement et ressources naturelles'}</a></li>
                <li><a href="https://www.canada.ca/en/services/defence.html">{i18n.language === 'en' ? 'National security and defence' : 'Sécurité nationale et défense'}</a></li>
                <li><a href="https://www.canada.ca/en/services/culture.html">{i18n.language === 'en' ? 'Culture, history and sport' : 'Culture, histoire et sport'}</a></li>
                <li><a href="https://www.canada.ca/en/services/policing.html">{i18n.language === 'en' ? 'Policing, justice and emergencies' : 'Services de police, justice et urgences'}</a></li>
                <li><a href="https://www.canada.ca/en/services/transport.html">{i18n.language === 'en' ? 'Transport and infrastructure' : 'Transport et infrastructure'}</a></li>
                <li><a href="https://international.gc.ca/world-monde/index.aspx?lang=eng">{i18n.language === 'en' ? 'Canada and the world' : 'Le Canada et le monde'}</a></li>
                <li><a href="https://www.canada.ca/en/services/finance.html">{i18n.language === 'en' ? 'Money and finance' : 'Argent et finance'}</a></li>
                <li><a href="https://www.canada.ca/en/services/science.html">{i18n.language === 'en' ? 'Science and innovation' : 'Science et innovation'}</a></li>
                <li><a href="https://www.canada.ca/en/services/indigenous-peoples.html">{i18n.language === 'en' ? 'Indigenous peoples' : 'Peuples autochtones'}</a></li>
                <li><a href="https://www.canada.ca/en/services/veterans.html">{i18n.language === 'en' ? 'Veterans and military' : 'Vétérans et militaires'}</a></li>
                <li><a href="https://www.canada.ca/en/services/youth.html">{i18n.language === 'en' ? 'Youth' : 'Jeunesse'}</a></li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Sub footer with corporate links */}
        <div className="gc-sub-footer">
          <div className="container d-flex align-items-center">
            <nav>
              <h3 className="wb-inv">{i18n.language === 'en' ? 'Government of Canada Corporate' : 'Gouvernement du Canada institutionnel'}</h3>
              <ul>
                <li>
                  <a href="https://www.canada.ca/en/social.html">
                    {i18n.language === 'en' ? 'Social media' : 'Médias sociaux'}
                  </a>
                </li>
                <li>
                  <a href="https://www.canada.ca/en/mobile.html">
                    {i18n.language === 'en' ? 'Mobile applications' : 'Applications mobiles'}
                  </a>
                </li>
                <li>
                  <a href="https://www.canada.ca/en/government/about.html">
                    {i18n.language === 'en' ? 'About Canada.ca' : 'À propos de Canada.ca'}
                  </a>
                </li>
                <li>
                  <a href="https://www.statcan.gc.ca/en/terms-conditions">
                    {i18n.language === 'en' ? 'Terms and conditions' : 'Avis'}
                  </a>
                </li>
                <li>
                  <a href="https://www.statcan.gc.ca/en/reference/privacy">
                    {i18n.language === 'en' ? 'Privacy' : 'Confidentialité'}
                  </a>
                </li>
              </ul>
            </nav>
            <div className="wtrmrk align-self-end">
              <img 
                src="/wet-boew4b/assets/wmms-blk.svg" 
                alt={i18n.language === 'en' ? 'Symbol of the Government of Canada' : 'Symbole du gouvernement du Canada'}
              />
            </div>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer