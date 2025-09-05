// src/components/assessment/EthicsPrinciples.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ETHICS_PRINCIPLES } from '../../types/assessment';
import { Button } from '../ui/Button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '../ui/Table';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '../ui/Select';

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
    <section className="wb-cont mb-8">
      <div className="panel panel-default">
        <header className="panel-heading">
          <h2 id="ethics-principles-title" className="panel-title">
            {t('assessment.ethics.title')}
          </h2>
        </header>

        <div className="panel-body">
          <div className="mrgn-bttm-lg">
            <p className="mrgn-bttm-md">
              {t('assessment.ethics.intro.intro')}
            </p>
            <ul className="list-unstyled mrgn-bttm-md">
              <li>{t('assessment.ethics.intro.bulletPoints.item1')}</li>
              <li>{t('assessment.ethics.intro.bulletPoints.item2')}</li>
              <li>{t('assessment.ethics.intro.bulletPoints.item3')}</li>
              <li>{t('assessment.ethics.intro.bulletPoints.item4')}</li>
              <li>{t('assessment.ethics.intro.bulletPoints.item5')}</li>
            </ul>
            <p className="mrgn-bttm-md" dangerouslySetInnerHTML={{__html: t('assessment.ethics.intro.part1')}} />
            <p>
              {t('assessment.ethics.intro.part2')}
            </p>
          </div>

          <div className="table-responsive">
            <Table className="table table-striped table-bordered">
              <caption className="wb-inv">{t('assessment.ethics.table.caption')}</caption>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-primary text-white">{t('assessment.ethics.table.headers.elements')}</TableHead>
                  <TableHead className="bg-primary text-white">{t('assessment.ethics.table.headers.explanation')}</TableHead>
                  <TableHead className="bg-primary text-white">{t('assessment.ethics.table.headers.criteria')}</TableHead>
                  <TableHead className="bg-primary text-white">{t('assessment.ethics.table.headers.answer')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ETHICS_PRINCIPLES.map((principle) => (
                  <TableRow key={principle.id}>
                    <TableCell className="font-weight-bold">
                      <strong id={`ethics-el-${principle.id}`}>{t(`ethicsPrinciples.principle${principle.id}.element`)}</strong>
                    </TableCell>
                    <TableCell>{t(`ethicsPrinciples.principle${principle.id}.explanation`)}</TableCell>
                    <TableCell id={`ethics-crit-${principle.id}`}>{t(`ethicsPrinciples.principle${principle.id}.criteria`)}</TableCell>
                    <TableCell>
                      <Select
                        value={ethicsAnswers[principle.id] || ""}
                        onValueChange={(value) => handleAnswerChange(principle.id, value)}
                      >
                        <SelectTrigger 
                          className="form-control" 
                          aria-labelledby={`ethics-el-${principle.id} ethics-crit-${principle.id}`}
                        >
                          <SelectValue 
                            placeholder={t('assessment.ethics.table.answers.select')} 
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unselected">
                            {t('assessment.ethics.table.answers.select')}
                          </SelectItem>
                          <SelectItem value="Yes">
                            {t('assessment.ethics.table.answers.yes')}
                          </SelectItem>
                          <SelectItem value="No">
                            {t('assessment.ethics.table.answers.no')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="well well-sm mrgn-tp-lg" id="ethics-results-title">
            <h3 className="h4 mrgn-bttm-md">
              {t('assessment.ethics.results.title')}
            </h3>
            
            <div 
              ref={resultRef}
              tabIndex={-1}
              aria-labelledby="ethics-results-title"
            >
              {showResult && ethicsPass !== null && (
                <div 
                  className={`alert ${ethicsPass ? 'alert-success' : 'alert-danger'} text-center`}
                  role="alert"
                  aria-live="polite"
                >
                  <strong>{ethicsPass ? t('assessment.ethics.results.pass') : t('assessment.ethics.results.fail')}</strong>
                </div>
              )}

              {showResult && (
                <div className="alert alert-info" role="status" aria-live="polite">
                  <p className="mrgn-bttm-0" dangerouslySetInnerHTML={{__html: t(part1MessageKey)}} />
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="panel-footer text-center">
          {!showResult ? (
            <Button 
              onClick={handleEvaluate}
              aria-label={t('assessment.ethics.actions.evaluate')}
              className="btn btn-primary"
            >
              {t('assessment.ethics.actions.evaluate')}
            </Button>
          ) : (
            <Button 
              onClick={handleContinue}
              aria-label={t('assessment.ethics.actions.continue')}
              className="btn btn-primary"
            >
              {t('assessment.ethics.actions.continue')}
            </Button>
          )}
        </footer>
      </div>
    </section>
  );
};

export default EthicsPrinciples;