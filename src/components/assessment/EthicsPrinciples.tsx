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
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '../ui/Table';
import { 
  Select, 
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
    <Card>
      <CardHeader>
        <CardTitle id="ethics-principles-title">
          {t('assessment.ethics.title')}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-6 text-[var(--text-color)]">
          <p className="text-lg">
          {t('assessment.ethics.intro.intro') }
          </p>
          <ol 
                className="my-6 list-decimal pl-6 space-y-2" 
                aria-label={t('frontPage.bulletPoints.label')}
            >
              <li className="text-lg">{t('assessment.ethics.intro.bulletPoints.item1')}</li>
              <li className="text-lg">{t('assessment.ethics.intro.bulletPoints.item2')}</li>
              <li className="text-lg">{t('assessment.ethics.intro.bulletPoints.item3')}</li>
              <li className="text-lg">{t('assessment.ethics.intro.bulletPoints.item4')}</li>
              <li className="text-lg">{t('assessment.ethics.intro.bulletPoints.item5')}</li>
            </ol>
          <p className="text-lg" dangerouslySetInnerHTML={{__html: t('assessment.ethics.intro.part1')}}
          />
          <p className="text-lg">
            {t('assessment.ethics.intro.part2')}
          </p>
        </div>

        <div className="rounded-lg overflow-hidden shadow-md">
          <Table>
            <caption className="sr-only">{t('assessment.ethics.table.caption')}</caption>
            <TableHeader className="text-lg">
              <TableRow>
                <TableHead className="bg-[var(--primary-color)]">{t('assessment.ethics.table.headers.elements')}</TableHead>
                <TableHead className="bg-[var(--primary-color)]">{t('assessment.ethics.table.headers.explanation')}</TableHead>
                <TableHead className="bg-[var(--primary-color)]">{t('assessment.ethics.table.headers.criteria')}</TableHead>
                <TableHead className="bg-[var(--primary-color)]">{t('assessment.ethics.table.headers.answer')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ETHICS_PRINCIPLES.map((principle, index) => (
                <TableRow 
                  key={principle.id} 
                  className={index % 2 === 1 ? "bg-[var(--light-blue)]" : "bg-white"}
                >
                  <TableCell className="font-medium">
                    <strong id={`ethics-el-${principle.id}`} className="text-[var(--primary-color)] text-base">{t(`ethicsPrinciples.principle${principle.id}.element`)}</strong>
                  </TableCell>
                  <TableCell className="text-base">{t(`ethicsPrinciples.principle${principle.id}.explanation`)}</TableCell>
                  <TableCell id={`ethics-crit-${principle.id}`} className="text-base">{t(`ethicsPrinciples.principle${principle.id}.criteria`)}</TableCell>
                  <TableCell>
                    <Select
                      value={ethicsAnswers[principle.id] || "unselected"}
                      onValueChange={(value) => handleAnswerChange(principle.id, value)}
                      aria-labelledby={`ethics-el-${principle.id} ethics-crit-${principle.id}`}
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div 
          className="section-header font-bold mt-8 mb-4 text-xl"
          id="ethics-results-title"
        >
          {t('assessment.ethics.results.title')}
        </div>
        
        <div 
          ref={resultRef}
          tabIndex={-1}
          aria-labelledby="ethics-results-title"
          className="transition-all"
        >
          {showResult && ethicsPass !== null && (
            <div 
              className={`wb-inv-result ${ethicsPass ? 'wb-inv-result-pass' : 'wb-inv-result-fail'} text-center mrgn-tp-md`}
              role="alert"
              aria-live="polite"
            >
              <span className={`glyphicon ${ethicsPass ? 'glyphicon-ok text-success' : 'glyphicon-remove text-danger'} mrgn-rght-sm`} aria-hidden="true"></span>
              <strong>{ethicsPass ? t('assessment.ethics.results.pass') : t('assessment.ethics.results.fail')}</strong>
            </div>
          )}

          {showResult && (
            <div className="wb-inv-message wb-inv-message-info mrgn-tp-md" role="status" aria-live="polite">
              <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
              <div className="wb-inv-message-content" dangerouslySetInnerHTML={{__html: t(part1MessageKey)}} />
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="text-center gap-3">
        {!showResult ? (
          <Button 
            onClick={handleEvaluate}
            aria-label={t('assessment.ethics.actions.evaluate')}
            className="transform transition-transform hover:scale-105 px-6 py-2.5 text-lg"
          >
            {t('assessment.ethics.actions.evaluate')}
          </Button>
        ) : (
          <Button 
            onClick={handleContinue}
            aria-label={t('assessment.ethics.actions.continue')}
            className="transform transition-transform hover:scale-105 px-6 py-2.5 text-lg"
          >
            {t('assessment.ethics.actions.continue')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EthicsPrinciples;