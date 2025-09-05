// components/layout/Footer.tsx
import { useTranslation } from 'react-i18next'

interface FooterProps {
    year: number
  }
  
  const Footer = ({ year }: FooterProps) => {
    const { t } = useTranslation()
    
    return (
      <footer id="wb-info">
        <h2 className="wb-inv">About this site</h2>
        <div className="gc-contextual">
          <div className="container">
            <nav>
              <h3>Statistics Canada</h3>
              <ul className="list-unstyled colcount-sm-2 colcount-md-3">
                <li><a href="https://www.statcan.gc.ca/en/reference/refcentre/index">Contact StatCan</a></li>
                <li><a href="https://www.statcan.gc.ca/en/trust">Trust Centre</a></li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="gc-main-footer">
          <div className="container">
            <nav>
              <h3>Government of Canada</h3>
              <ul className="list-unstyled colcount-sm-2 colcount-md-3">
                <li><a href="https://www.canada.ca/en/contact.html">All contacts</a></li>
                <li><a href="https://www.canada.ca/en/government/dept.html">Departments and agencies</a></li>
                <li><a href="https://www.canada.ca/en/government/system.html">About government</a></li>
              </ul>
              <h4><span className="wb-inv">Themes and topics</span></h4>
              <ul className="list-unstyled colcount-sm-2 colcount-md-3">
                <li><a href="https://www.canada.ca/en/services/jobs.html">Jobs</a></li>
                <li><a href="https://www.canada.ca/en/services/immigration-citizenship.html">Immigration and citizenship</a></li>
                <li><a href="https://travel.gc.ca/">Travel and tourism</a></li>
                <li><a href="https://www.canada.ca/en/services/business.html">Business</a></li>
                <li><a href="https://www.canada.ca/en/services/benefits.html">Benefits</a></li>
                <li><a href="https://www.canada.ca/en/services/health.html">Health</a></li>
                <li><a href="https://www.canada.ca/en/services/taxes.html">Taxes</a></li>
                <li><a href="https://www.canada.ca/en/services/environment.html">Environment and natural resources</a></li>
                <li><a href="https://www.canada.ca/en/services/defence.html">National security and defence</a></li>
                <li><a href="https://www.canada.ca/en/services/culture.html">Culture, history and sport</a></li>
                <li><a href="https://www.canada.ca/en/services/policing.html">Policing, justice and emergencies</a></li>
                <li><a href="https://www.canada.ca/en/services/transport.html">Transport and infrastructure</a></li>
                <li><a href="https://international.gc.ca/world-monde/index.aspx?lang=eng">Canada and the world</a></li>
                <li><a href="https://www.canada.ca/en/services/finance.html">Money and finance</a></li>
                <li><a href="https://www.canada.ca/en/services/science.html">Science and innovation</a></li>
                <li><a href="https://www.canada.ca/en/services/indigenous-peoples.html">Indigenous peoples</a></li>
                <li><a href="https://www.canada.ca/en/services/veterans.html">Veterans and military</a></li>
                <li><a href="https://www.canada.ca/en/services/youth.html">Youth</a></li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="gc-sub-footer">
          <div className="container d-flex align-items-center">
            <nav>
              <h3 className="wb-inv">Government of Canada Corporate</h3>
              <ul>
                <li><a href="https://www.canada.ca/en/social.html">Social media</a></li>
                <li><a href="https://www.canada.ca/en/mobile.html">Mobile applications</a></li>
                <li><a href="https://www.canada.ca/en/government/about.html">About Canada.ca</a></li>
                <li><a href="https://www.statcan.gc.ca/en/terms-conditions">Terms and conditions</a></li>
                <li><a href="https://www.statcan.gc.ca/en/reference/privacy">Privacy</a></li>
              </ul>
            </nav>
            <div className="wtrmrk align-self-end">
              <img 
                src="/wet-boew4b/assets/wmms-blk.svg" 
                alt="Symbol of the Government of Canada"
              />
            </div>
          </div>
          
          {/* Custom tool info - add our tool info in a way that doesn't break the WET-BOEW structure */}
          <div className="container">
            <div className="text-center" style={{ borderTop: '1px solid #666', paddingTop: '10px', marginTop: '10px', fontSize: '12px', color: '#999' }}>
              <p>{t('footer.copyright')} {year}</p>
              <p dangerouslySetInnerHTML={{ __html: t('footer.builtWith') }} />
            </div>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer