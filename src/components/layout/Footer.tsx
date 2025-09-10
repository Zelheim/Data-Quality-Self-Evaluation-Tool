// components/layout/Footer.tsx
import { useTranslation } from 'react-i18next'

interface FooterProps {
  year: number
}

const Footer = ({ year }: FooterProps) => {
  const { t, i18n } = useTranslation()
  
  // Suppress unused vars warning - these are kept for potential future use
  void year;
  void t;
  
  return (
    <footer id="wb-info">
      <h2 className="wb-inv">{t('footer.aboutThisSite')}</h2>
      
      {/* Statistics Canada Contextual Footer */}
      <div className="gc-contextual">
        <div className="container">
          <nav>
            <h3>{t('footer.statisticsCanada')}</h3>
            <ul className="list-unstyled colcount-sm-2 colcount-md-3">
              <li><a href={i18n.language === 'en' ? "https://www.statcan.gc.ca/en/reference/refcentre/index" : "https://www.statcan.gc.ca/fr/reference/centreref/index"}>
                {t('footer.contactStatCan')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.statcan.gc.ca/en/trust" : "https://www.statcan.gc.ca/fr/confiance"}>
                {t('footer.trustCentre')}
              </a></li>
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Government of Canada Main Footer */}
      <div className="gc-main-footer">
        <div className="container">
          <nav>
            <h3>{t('footer.governmentOfCanada')}</h3>
            <ul className="list-unstyled colcount-sm-2 colcount-md-3">
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/contact.html" : "https://www.canada.ca/fr/contact.html"}>
                {t('footer.allContacts')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/government/dept.html" : "https://www.canada.ca/fr/gouvernement/min.html"}>
                {t('footer.departmentsAndAgencies')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/government/system.html" : "https://www.canada.ca/fr/gouvernement/systeme.html"}>
                {t('footer.aboutGovernment')}
              </a></li>
            </ul>
            
            <h4>
              <span className="wb-inv">{t('footer.themesAndTopics')}</span>
            </h4>
            <ul className="list-unstyled colcount-sm-2 colcount-md-3">
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/jobs.html" : "https://www.canada.ca/fr/services/emplois.html"}>
                {t('footer.jobs')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/immigration-citizenship.html" : "https://www.canada.ca/fr/services/immigration-citoyennete.html"}>
                {t('footer.immigrationAndCitizenship')}
              </a></li>
              <li><a href="https://travel.gc.ca/">
                {t('footer.travelAndTourism')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/business.html" : "https://www.canada.ca/fr/services/entreprises.html"}>
                {t('footer.business')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/benefits.html" : "https://www.canada.ca/fr/services/prestations.html"}>
                {t('footer.benefits')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/health.html" : "https://www.canada.ca/fr/services/sante.html"}>
                {t('footer.health')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/taxes.html" : "https://www.canada.ca/fr/services/impots.html"}>
                {t('footer.taxes')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/environment.html" : "https://www.canada.ca/fr/services/environnement.html"}>
                {t('footer.environmentAndNaturalResources')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/defence.html" : "https://www.canada.ca/fr/services/defense.html"}>
                {t('footer.nationalSecurityAndDefence')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/culture.html" : "https://www.canada.ca/fr/services/culture.html"}>
                {t('footer.cultureHistoryAndSport')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/policing.html" : "https://www.canada.ca/fr/services/police.html"}>
                {t('footer.policingJusticeAndEmergencies')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/transport.html" : "https://www.canada.ca/fr/services/transport.html"}>
                {t('footer.transportAndInfrastructure')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://international.gc.ca/world-monde/index.aspx?lang=eng" : "https://www.international.gc.ca/world-monde/index.aspx?lang=fra"}>
                {t('footer.canadaAndTheWorld')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/finance.html" : "https://www.canada.ca/fr/services/finance.html"}>
                {t('footer.moneyAndFinance')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/science.html" : "https://www.canada.ca/fr/services/science.html"}>
                {t('footer.scienceAndInnovation')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/indigenous-peoples.html" : "https://www.canada.ca/fr/services/autochtones.html"}>
                {t('footer.indigenousPeoples')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/veterans.html" : "https://www.canada.ca/fr/services/veterans.html"}>
                {t('footer.veteransAndMilitary')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/services/youth.html" : "https://www.canada.ca/fr/services/jeunesse.html"}>
                {t('footer.youth')}
              </a></li>
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Government of Canada Sub-Footer */}
      <div className="gc-sub-footer">
        <div className="container d-flex align-items-center">
          <nav>
            <h3 className="wb-inv">{t('footer.governmentOfCanadaCorporate')}</h3>
            <ul>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/social.html" : "https://www.canada.ca/fr/sociaux.html"}>
                {t('footer.socialMedia')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/mobile.html" : "https://www.canada.ca/fr/mobile.html"}>
                {t('footer.mobileApplications')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.canada.ca/en/government/about.html" : "https://www.canada.ca/fr/gouvernement/a-propos.html"}>
                {t('footer.aboutCanadaCa')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.statcan.gc.ca/en/terms-conditions" : "https://www.statcan.gc.ca/fr/avis"}>
                {t('footer.termsAndConditions')}
              </a></li>
              <li><a href={i18n.language === 'en' ? "https://www.statcan.gc.ca/en/reference/privacy" : "https://www.statcan.gc.ca/fr/reference/privee"}>
                {t('footer.privacy')}
              </a></li>
            </ul>
          </nav>
          
          <div className="wtrmrk align-self-end">
            <img 
              src="./wet-boew4b/assets/wmms-blk.svg" 
              alt={t('footer.symbolOfGovernmentOfCanada')}
            />
          </div>
        </div>
      </div>
      
    </footer>
  )
}

export default Footer