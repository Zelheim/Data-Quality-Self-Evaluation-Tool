// src/components/assessment/EthicsPrinciples.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ETHICS_PRINCIPLES } from '../../types/assessment';

interface EthicsPrinciplesProps {
  ethicsAnswers: Record<string, string>;
  setEthicsAnswers: (value: Record<string, string>) => void;
  ethicsPass: boolean | null;
  setEthicsPass: (value: boolean) => void;
  part1MessageKey: string;
  setPart1MessageKey: (value: string) => void;
  onShowAlert: (message: string) => void;
  onNextStep: () => void;
  showResult: boolean;
  setShowResult: (value: boolean) => void;
}

const EthicsPrinciples: React.FC<EthicsPrinciplesProps> = ({
  ethicsAnswers,
  setEthicsAnswers,
  ethicsPass,
  setEthicsPass,
  part1MessageKey,
  setPart1MessageKey,
  onShowAlert,
  onNextStep,
  showResult,
  setShowResult,
}) => {
  const { t } = useTranslation();
  const resultRef = React.useRef<HTMLDivElement>(null);

  const handleAnswerChange = (id: string, value: string) => {
    setEthicsAnswers({
      ...ethicsAnswers,
      [id]: value
    });
  };

  const validateAnswers = () => {
    const requiredPrinciples = ETHICS_PRINCIPLES.map(p => p.id);
    let allValid = true;
    let noAnswers = 0;
    
    for (const id of requiredPrinciples) {
      if (!ethicsAnswers[id] || ethicsAnswers[id] === "unselected") {
        allValid = false;
      } else if (ethicsAnswers[id] === "No") {
        noAnswers++;
      }
    }
    
    if (!allValid) {
      onShowAlert(t('assessment.ethics.alerts.answerAll'));
      return false;
    }
    
    const isPass = noAnswers === 0;
    setEthicsPass(isPass);
    
    // Set message key based on result
    if (isPass) {
      setPart1MessageKey('assessment.ethics.results.passMessage');
    } else {
      setPart1MessageKey('assessment.ethics.results.failMessage');
    }
    
    setShowResult(true);
    
    // Focus on the result section for screen readers
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.focus();
      }
    }, 100);
    
    return true;
  };
  
  const handleEvaluate = () => {
    validateAnswers();
  };
  
  const handleContinue = () => {
    if (showResult) {
      onNextStep();
    } else {
      if (validateAnswers()) {
        onNextStep();
      }
    }
  };

  return (
    <section className="panel panel-default">
      <header className="panel-heading">
        <h2 id="ethics-principles-title" className="panel-title">
          {t('assessment.ethics.title')}
        </h2>
      </header>

      <div className="panel-body">
        <div className="mrgn-bttm-lg">
          <p className="lead">
            {t('assessment.ethics.intro.intro')}
          </p>
          <ol className="mrgn-bttm-lg mrgn-tp-md">
            <li>{t('assessment.ethics.intro.bulletPoints.item1')}</li>
            <li>{t('assessment.ethics.intro.bulletPoints.item2')}</li>
            <li>{t('assessment.ethics.intro.bulletPoints.item3')}</li>
            <li>{t('assessment.ethics.intro.bulletPoints.item4')}</li>
            <li>{t('assessment.ethics.intro.bulletPoints.item5')}</li>
          </ol>
          <p dangerouslySetInnerHTML={{__html: t('assessment.ethics.intro.part1')}} />
          <p className="mrgn-tp-md">
            {t('assessment.ethics.intro.part2')}
          </p>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <caption className="wb-inv">{t('assessment.ethics.table.caption')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('assessment.ethics.table.headers.elements')}</th>
                <th scope="col">{t('assessment.ethics.table.headers.explanation')}</th>
                <th scope="col">{t('assessment.ethics.table.headers.criteria')}</th>
                <th scope="col">{t('assessment.ethics.table.headers.answer')}</th>
              </tr>
            </thead>
            <tbody>
              {ETHICS_PRINCIPLES.map((principle) => (
                <tr key={principle.id}>
                  <td>
                    <strong id={`ethics-el-${principle.id}`}>
                      {t(`ethicsPrinciples.principle${principle.id}.element`)}
                    </strong>
                  </td>
                  <td>{t(`ethicsPrinciples.principle${principle.id}.explanation`)}</td>
                  <td id={`ethics-crit-${principle.id}`}>
                    {t(`ethicsPrinciples.principle${principle.id}.criteria`)}
                  </td>
                  <td>
                    <div className="form-group">
                      <label htmlFor={`ethics-select-${principle.id}`} className="wb-inv">
                        {t('assessment.ethics.table.headers.answer')} - {t(`ethicsPrinciples.principle${principle.id}.element`)}
                      </label>
                      <select
                        id={`ethics-select-${principle.id}`}
                        className="form-control"
                        value={ethicsAnswers[principle.id] || ""}
                        onChange={(e) => handleAnswerChange(principle.id, e.target.value)}
                        aria-labelledby={`ethics-el-${principle.id} ethics-crit-${principle.id}`}
                      >
                        <option value="">{t('assessment.ethics.table.answers.select')}</option>
                        <option value="Yes">{t('assessment.ethics.table.answers.yes')}</option>
                        <option value="No">{t('assessment.ethics.table.answers.no')}</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mrgn-tp-lg">
          <h3 id="ethics-results-title">
            {t('assessment.ethics.results.title')}
          </h3>
          
          <div 
            ref={resultRef}
            tabIndex={-1}
            aria-labelledby="ethics-results-title"
          >
            {showResult && ethicsPass !== null && (
              <div 
                className={`alert ${ethicsPass ? 'alert-success' : 'alert-danger'} mrgn-tp-md`}
                role="alert"
                aria-live="polite"
              >
                <p className="h4">
                  {ethicsPass ? t('assessment.ethics.results.pass') : t('assessment.ethics.results.fail')}
                </p>
              </div>
            )}

            {showResult && (
              <div className="alert alert-info mrgn-tp-md" role="status" aria-live="polite">
                <p dangerouslySetInnerHTML={{__html: t(part1MessageKey)}} />
              </div>
            )}
          </div>
        </section>
      </div>

      <footer className="panel-footer text-center">
        {!showResult ? (
          <button 
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleEvaluate}
            aria-label={t('assessment.ethics.actions.evaluate')}
          >
            {t('assessment.ethics.actions.evaluate')}
          </button>
        ) : (
          <button 
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleContinue}
            aria-label={t('assessment.ethics.actions.continue')}
          >
            {t('assessment.ethics.actions.continue')}
          </button>
        )}
      </footer>
    </section>
  );
};

export default EthicsPrinciples;