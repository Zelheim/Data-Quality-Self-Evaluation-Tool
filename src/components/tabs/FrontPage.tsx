import React from 'react';
import { useTranslation } from 'react-i18next';

interface FrontPageProps {
  onStartAssessment: () => void;
}

const FrontPage: React.FC<FrontPageProps> = ({ onStartAssessment }) => {
  const { t } = useTranslation();
  
  return (
    <div className="row">
      <div className="col-md-12">
        {/* Hero section */}
        <section className="jumbotron mrgn-bttm-lg">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 text-center">
                <h2 className="h1 mrgn-bttm-md">
                  {t('frontPage.titleLine1')} {t('frontPage.titleLine2')}
                </h2>
                <p className="lead mrgn-bttm-lg">
                  {t('frontPage.intro')}
                </p>
                <button 
                  type="button"
                  className="btn btn-call-to-action btn-lg"
                  onClick={onStartAssessment}
                  aria-label={t('frontPage.startButtonAriaLabel')}
                >
                  <span className="glyphicon glyphicon-play" aria-hidden="true"></span>
                  {t('frontPage.startButton')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="row">
          <div className="col-md-8">
            {/* Overview section */}
            <section className="panel panel-primary">
              <header className="panel-heading">
                <h3 className="panel-title">
                  {t('frontPage.assessmentInfo')}
                </h3>
              </header>
              <div className="panel-body">
                <p>{t('frontPage.assessmentInfo')}</p>
                
                <h4 className="h5 mrgn-tp-lg">
                  {t('frontPage.bulletPoints.label')}
                </h4>
                <ul className="fa-ul mrgn-bttm-md">
                  <li>
                    <span className="fa-li">
                      <span className="fas fa-check text-success" aria-hidden="true"></span>
                    </span>
                    {t('frontPage.bulletPoints.item1')}
                  </li>
                  <li>
                    <span className="fa-li">
                      <span className="fas fa-check text-success" aria-hidden="true"></span>
                    </span>
                    {t('frontPage.bulletPoints.item2')}
                  </li>
                </ul>

                <div className="alert alert-info">
                  <p className="h5">
                    <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                    {t('frontPage.noteToUsers')}
                  </p>
                </div>
              </div>
            </section>

            {/* Usage information */}
            <section className="panel panel-default">
              <header className="panel-heading">
                <h3 className="panel-title">
                  How to use this tool
                </h3>
              </header>
              <div className="panel-body">
                <div 
                  dangerouslySetInnerHTML={{ __html: t('frontPage.usage') }}
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="col-md-4">
            {/* Getting started */}
            <section className="well">
              <h3 className="h4">Getting started</h3>
              <p>Ready to evaluate your data? Click the button below to begin the assessment process.</p>
              <button 
                type="button"
                className="btn btn-primary btn-block btn-lg mrgn-tp-md"
                onClick={onStartAssessment}
                aria-label={t('frontPage.startButtonAriaLabel')}
              >
                <span className="glyphicon glyphicon-play" aria-hidden="true"></span>
                {t('frontPage.startButton')}
              </button>
            </section>

            {/* Contact information */}
            <section className="panel panel-info">
              <header className="panel-heading">
                <h3 className="panel-title">
                  <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>
                  Contact information
                </h3>
              </header>
              <div className="panel-body">
                <div 
                  dangerouslySetInnerHTML={{ __html: t('frontPage.contactInfo') }}
                />
              </div>
            </section>

            {/* Related links */}
            <section className="panel panel-default">
              <header className="panel-heading">
                <h3 className="panel-title">
                  <span className="glyphicon glyphicon-link" aria-hidden="true"></span>
                  Related resources
                </h3>
              </header>
              <div className="panel-body">
                <ul className="list-unstyled">
                  <li className="mrgn-bttm-sm">
                    <a href="https://www.statcan.gc.ca/en/about/quality" 
                       className="btn btn-link btn-block text-left">
                      <span className="glyphicon glyphicon-new-window" aria-hidden="true"></span>
                      Statistics Canada Quality Guidelines
                    </a>
                  </li>
                  <li className="mrgn-bttm-sm">
                    <a href="https://www.statcan.gc.ca/en/about/smr01/smr01" 
                       className="btn btn-link btn-block text-left">
                      <span className="glyphicon glyphicon-new-window" aria-hidden="true"></span>
                      Survey Methods and Practices
                    </a>
                  </li>
                  <li className="mrgn-bttm-sm">
                    <a href="https://www.statcan.gc.ca/en/trust" 
                       className="btn btn-link btn-block text-left">
                      <span className="glyphicon glyphicon-new-window" aria-hidden="true"></span>
                      Trust Centre
                    </a>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>

        {/* Date modified */}
        <div className="pagedetails">
          <dl id="wb-dtmd">
            <dt>Date modified:</dt>
            <dd>
              <time property="dateModified">{new Date().toLocaleDateString()}</time>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;