// src/components/assessment/EthicsPrinciples.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ETHICS_PRINCIPLES } from '../../types/assessment';
import { Button } from '../ui/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '../ui/Card';
import {
  Select,
  SelectItem
} from '../ui/Select';
import ErrorSummary, { type ValidationError } from '../ui/ErrorSummary';

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
  const [validationErrors, setValidationErrors] = React.useState<ValidationError[]>([]);

  const handleAnswerChange = (id: string, value: string) => {
    setEthicsAnswers({
      ...ethicsAnswers,
      [id]: value
    });

    // Clear validation error for this field when user makes a selection
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors.filter(error => error.id !== `ethics-${id}`));
    }
  };

  const validateAnswers = () => {
    const requiredPrinciples = ETHICS_PRINCIPLES.map(p => p.id);
    const errors: ValidationError[] = [];
    let noAnswers = 0;

    for (const id of requiredPrinciples) {
      if (!ethicsAnswers[id] || ethicsAnswers[id] === "unselected") {
        const principle = ETHICS_PRINCIPLES.find(p => p.id === id);
        if (principle) {
          errors.push({
            id: `ethics-${id}`,
            message: t('assessment.ethics.validation.fieldRequired'),
            fieldLabel: t(`ethicsPrinciples.principle${id}.element`)
          });
        }
      } else if (ethicsAnswers[id] === "No") {
        noAnswers++;
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors([]);
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
    <Card>
      <CardHeader>
        <CardTitle id="ethics-principles-title" as="h2">
          {t('assessment.ethics.title')}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div>
          <p>
          {t('assessment.ethics.intro.intro') }
          </p>
          <ol
                aria-label={t('frontPage.bulletPoints.label')}
            >
              <li>{t('assessment.ethics.intro.bulletPoints.item1')}</li>
              <li>{t('assessment.ethics.intro.bulletPoints.item2')}</li>
              <li>{t('assessment.ethics.intro.bulletPoints.item3')}</li>
              <li>{t('assessment.ethics.intro.bulletPoints.item4')}</li>
              <li>{t('assessment.ethics.intro.bulletPoints.item5')}</li>
            </ol>
          <p dangerouslySetInnerHTML={{__html: t('assessment.ethics.intro.part1')}}
          />
          <p>
            {t('assessment.ethics.intro.part2')}
          </p>
        </div>

        <ErrorSummary errors={validationErrors} titleKey="assessment.ethics.validation.errorSummaryTitle" />

        <form className="wb-frmvld" role="form" onSubmit={(e) => { e.preventDefault(); handleEvaluate(); }}>
          <ul className="list-unstyled mrgn-tp-lg">
            {ETHICS_PRINCIPLES.map((principle) => {
              const hasError = validationErrors.some(error => error.id === `ethics-${principle.id}`);
              return (
                <li key={principle.id} className="mrgn-bttm-lg">
                  <section className="panel panel-default">
                    <div className="panel-body">
                      <div className="form-group">
                        <h3 id={`ethics-el-${principle.id}`} className="mrgn-tp-0">
                          {t(`ethicsPrinciples.principle${principle.id}.element`)}
                        </h3>

                        <div className="form-section-content">
                          <div className="form-section-label">{t('assessment.ethics.table.headers.explanation')}:</div>
                          <div dangerouslySetInnerHTML={{ __html: t(`ethicsPrinciples.principle${principle.id}.explanation`) }} />
                        </div>

                        <div className="form-section-content">
                          <div className="form-section-label">{t('assessment.ethics.table.headers.criteria')}:</div>
                          <p id={`ethics-crit-${principle.id}`}>{t(`ethicsPrinciples.principle${principle.id}.criteria`)}</p>
                        </div>

                        <div className="form-group">
                          <label htmlFor={`ethics-${principle.id}`} className="required">
                            <span className="field-name">{t('assessment.ethics.table.headers.answer')}</span>
                            {' '}
                            <strong className="required" aria-hidden="true">
                              {t('assessment.ethics.validation.required')}
                            </strong>
                          </label>

                          <div id={`ethics-${principle.id}`} className={hasError ? 'has-error' : ''}>
                            <Select
                              value={ethicsAnswers[principle.id] || "unselected"}
                              onValueChange={(value) => handleAnswerChange(principle.id, value)}
                              aria-labelledby={`ethics-el-${principle.id}`}
                              aria-describedby={`ethics-crit-${principle.id} ${hasError ? `ethics-${principle.id}-error` : ''}`}
                              aria-required="true"
                              aria-invalid={hasError}
                            >
                              <SelectItem value="unselected" disabled>
                                {t('assessment.ethics.table.answers.select')}
                              </SelectItem>
                              <SelectItem value="Yes">
                                {t('assessment.ethics.table.answers.yes')}
                              </SelectItem>
                              <SelectItem value="No">
                                {t('assessment.ethics.table.answers.no')}
                              </SelectItem>
                            </Select>
                            {hasError && (
                              <span id={`ethics-${principle.id}-error`} className="error text-danger">
                                <span className="label label-danger">
                                  <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                                  {' '}{t('assessment.ethics.validation.fieldRequired')}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </li>
              );
            })}
          </ul>
        </form>

        <section
          ref={resultRef}
          tabIndex={-1}
          aria-labelledby="ethics-results-title"
          className="transition-all"
        >
          <h4 id="ethics-results-title">
            {t('assessment.ethics.results.title')}
          </h4>

          {showResult && ethicsPass !== null && (
            <div
              className={`wb-inv-result ${ethicsPass ? 'wb-inv-result-pass' : 'wb-inv-result-fail'} text-center mrgn-tp-md`}
              role="alert"
              aria-live="polite"
            >
              <span className={`glyphicon ${ethicsPass ? 'glyphicon-ok-sign text-success' : 'glyphicon-remove-sign text-danger'} mrgn-rght-sm`} aria-hidden="true"></span>
              <strong>{ethicsPass ? t('assessment.ethics.results.pass') : t('assessment.ethics.results.fail')}</strong>
            </div>
          )}

          {showResult && (
            <div className="wb-inv-message wb-inv-message-info mrgn-tp-md" role="status" aria-live="polite">
              <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
              <div className="wb-inv-message-content" dangerouslySetInnerHTML={{__html: t(part1MessageKey)}} />
            </div>
          )}
        </section>
      </CardContent>

      <CardFooter>
        {!showResult ? (
          <Button 
            onClick={handleEvaluate}
            aria-label={t('assessment.ethics.actions.evaluateARIA')}
            className="btn-lg"
          >
            {t('assessment.ethics.actions.evaluate')}
          </Button>
        ) : (
          <Button 
            onClick={handleContinue}
            aria-label={t('assessment.ethics.actions.continueARIA')}
            className="btn-lg"
          >
            {t('assessment.ethics.actions.continue')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EthicsPrinciples;