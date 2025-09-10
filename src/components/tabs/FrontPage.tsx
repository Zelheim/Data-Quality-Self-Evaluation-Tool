import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

interface FrontPageProps {
  onStartAssessment: () => void;
}

const FrontPage: React.FC<FrontPageProps> = ({ onStartAssessment }) => {
  const { t } = useTranslation();
  
  return (
    <div 
      id="front-page" 
      role="region"
    >
      <div className="panel panel-info mrgn-tp-lg">
        <div className="panel-body">
          <p className="mrgn-tp-md">{t('frontPage.intro')}</p>
          <p>{t('frontPage.assessmentInfo')}</p>
          
          <ul 
            className="list-unstyled mrgn-tp-md" 
            aria-label={t('frontPage.bulletPoints.label')}
          >
            <li className="mrgn-bttm-sm">
              <span className="glyphicon glyphicon-check text-success mrgn-rght-sm" aria-hidden="true"></span>
              {t('frontPage.bulletPoints.item1')}
            </li>
            <li className="mrgn-bttm-sm">
              <span className="glyphicon glyphicon-check text-success mrgn-rght-sm" aria-hidden="true"></span>
              {t('frontPage.bulletPoints.item2')}
            </li>
          </ul>
          
          <p className="mrgn-tp-md">{t('frontPage.noteToUsers')}</p>

          <p 
            className="mrgn-tp-md"
            dangerouslySetInnerHTML={{ __html: t('frontPage.usage') }}
          ></p>
          
          <p 
            className="mrgn-tp-md"
            dangerouslySetInnerHTML={{ __html: t('frontPage.contactInfo') }}
          ></p>
          
        </div>
      </div>
      
      <div className="text-center mrgn-tp-md">
        <Button 
          onClick={onStartAssessment}
          size="lg"
          variant="primary"
          aria-label={t('frontPage.startButtonAriaLabel')}
        >
          <span className="glyphicon glyphicon-play mrgn-rght-sm" aria-hidden="true"></span>
          {t('frontPage.startButton')}
        </Button>
      </div>
    </div>
  );
};

export default FrontPage;