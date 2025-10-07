// src/components/assessment/QualityDimensions.tsx
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QUALITY_DIMENSIONS } from '../../types/assessment';
import { Button } from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import StatCanTooltip from '../ui/StatCanTooltip';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '../ui/Table';
import ErrorSummary, { type ValidationError } from '../ui/ErrorSummary';

interface QualityDimensionsProps {
  qualityScores: Record<string, number>;
  setQualityScores: (value: Record<string, number>) => void;
  totalScore: number;
  setTotalScore: (value: number) => void;
  qualityPass: boolean | null;
  setQualityPass: (value: boolean) => void;
  onEvaluate: () => void;
  onGoBack: () => void;
  showResult: boolean;
  setShowResult: (value: boolean) => void;
  qualityInterpretation: string;
  setQualityInterpretation: (value: string) => void;
  criteriaSatisfaction: Record<string, boolean[]>;
  setCriteriaSatisfaction: (value: Record<string, boolean[]>) => void;
}

const QualityDimensions: React.FC<QualityDimensionsProps> = ({
  qualityScores,
  setQualityScores,
  totalScore,
  setTotalScore,
  qualityPass,
  setQualityPass,
  onEvaluate,
  onGoBack,
  showResult,
  setShowResult,
  qualityInterpretation,
  setQualityInterpretation,
  criteriaSatisfaction,
  setCriteriaSatisfaction,
}) => {
  const { t } = useTranslation();
  const resultRef = useRef<HTMLDivElement>(null);
  const [validationErrors, setValidationErrors] = React.useState<ValidationError[]>([]);

  // Initialize dimensions with default values if not done already
  React.useEffect(() => {
    // Check if we need to initialize
    const needsInitialization = QUALITY_DIMENSIONS.some(dimension => 
      qualityScores[dimension.id] === undefined || !criteriaSatisfaction[dimension.id]
    );
    
    if (needsInitialization) {
      const initialScores = { ...qualityScores };
      const initialCriteria = { ...criteriaSatisfaction };
      
      // Set default values for any uninitialized dimension
      QUALITY_DIMENSIONS.forEach(dimension => {
        if (initialScores[dimension.id] === undefined) {
          initialScores[dimension.id] = 0;
        }
        if (!initialCriteria[dimension.id]) {
          initialCriteria[dimension.id] = new Array(dimension.criteria.length).fill(false);
        }
      });
      
      setQualityScores(initialScores);
      setCriteriaSatisfaction(initialCriteria);
    }
  }, []);

 // const getQualityScoreText = (score: number) => {
 //   if (score === 0) return t('assessment.quality.scoreText.notSufficient');
 //   if (score === 1) return t('assessment.quality.scoreText.low');
 //   if (score === 2) return t('assessment.quality.scoreText.medium');
 //   if (score === 3) return t('assessment.quality.scoreText.high');
 //   return "";
 // };

  const handleCriteriaChange = (dimensionId: string, criteriaIndex: number, checked: boolean) => {
    const newCriteriaSatisfaction = {
      ...criteriaSatisfaction,
      [dimensionId]: [...(criteriaSatisfaction[dimensionId] || [])]
    };
    
    newCriteriaSatisfaction[dimensionId][criteriaIndex] = checked;
    setCriteriaSatisfaction(newCriteriaSatisfaction);
    
    // Calculate new score for this dimension
    const satisfiedCount = newCriteriaSatisfaction[dimensionId].filter(Boolean).length;
    
    // Special case for Accessibility and clarity (dimension 3): only 2 criteria, so max score is achieved when both are satisfied
    let score = satisfiedCount;
    if (dimensionId === "3" && satisfiedCount === 2) {
      score = 3; // Award maximum points when both criteria are met for dimension 3
    }
    
    const newScores = {
      ...qualityScores,
      [dimensionId]: score
    };
    setQualityScores(newScores);
    
    // Update total score
    const newTotalScore = Object.values(newScores).reduce((sum, score) => sum + score, 0);
    setTotalScore(newTotalScore);
  };

  const generateQualitySummary = () => {
    return (
      <div>
        <Table aria-labelledby="quality-summary-title">
          <TableHeader>
            <TableRow>
              <TableHead>{t('assessment.quality.summary.tableHeaders.dimension')}</TableHead>
              <TableHead className="text-center">{t('assessment.quality.summary.tableHeaders.score')}</TableHead>
              <TableHead>{t('assessment.overall.criteriaSatisfied')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {QUALITY_DIMENSIONS.map((dimension) => {
              const score = qualityScores[dimension.id] || 0;
              const criteria = criteriaSatisfaction[dimension.id] || [];
              
              return (
                <TableRow key={dimension.id}>
                  <TableCell><strong>{t(`qualityDimensions.dimension${dimension.id}.element`)}</strong></TableCell>
                  <TableCell>
                    {t('assessment.quality.summary.scoreDisplay', { score: score, maxScore: dimension.maxScore })}
                  </TableCell>
                  <TableCell>
                    <div>
                      {dimension.criteria.map((_, idx) => (
                        <div key={idx} className={`${criteria[idx] ? 'text-success' : 'text-danger'}`}>
                          {criteria[idx] ? '✓' : '✗'} {t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  const validateQuality = () => {
    const errors: ValidationError[] = [];

    // Note: Quality dimensions don't have required validation since 0 is a valid score
    // The user can intentionally select no criteria, which results in a score of 0
    // This is different from ethics where all questions must be answered

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const updateQualityResult = () => {
    if (!validateQuality()) {
      return;
    }

    // Check if any dimension has a score of 0
    const hasZeroScore = QUALITY_DIMENSIONS.some(dimension =>
      qualityScores[dimension.id] === 0
    );

    // Fail if any score is 0 or if total score is less than 8
    const isQualityPass = !hasZeroScore && totalScore >= 8;
    setQualityPass(isQualityPass);

    let message = '';
    if (hasZeroScore) {
      message = t('assessment.quality.interpretation.fail');
    } else if (totalScore <= 7) {
      message = t('assessment.quality.interpretation.low');
    } else if (totalScore >= 8 && totalScore <= 10) {
      message = t('assessment.quality.interpretation.medium');
    } else if (totalScore >= 11) {
      message = t('assessment.quality.interpretation.high');
    }

    setQualityInterpretation(message);
    setShowResult(true);

    // Focus on the result section for screen readers
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.focus();
      }
    }, 100);
  };

  const handleEvaluate = () => {
    updateQualityResult();
  };
  
  const handleContinue = () => {
    // Call the parent onEvaluate function to proceed to the next step
    onEvaluate();
  };

  return (
    <Card className="panel panel-default">
      <CardHeader>
        <CardTitle id="quality-dimensions-title" as="h2">
          {t('assessment.quality.title')}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="intro-text">
          <p>
            {t('assessment.quality.intro.intro')}
          </p>
          <ol aria-label={t('frontPage.bulletPoints.label')}>
              <li>{t('assessment.quality.intro.bulletPoints.item1')}</li>
              <li>{t('assessment.quality.intro.bulletPoints.item2')}</li>
              <li>{t('assessment.quality.intro.bulletPoints.item3')}</li>
              <li>{t('assessment.quality.intro.bulletPoints.item4')}</li>
              <li>{t('assessment.quality.intro.bulletPoints.item5')}</li>
            </ol>
          <p>
            {t('assessment.quality.intro.part1')}
          </p>
          <p>
            {t('assessment.quality.intro.part2')}
          </p>
        </div>

        <ErrorSummary errors={validationErrors} titleKey="assessment.quality.validation.errorSummaryTitle" />

        <div className="mrgn-bttm-md">
          <StatCanTooltip
            tooltip={`${t('assessment.quality.table.tooltip.title')}\n\n• ${t('assessment.quality.table.tooltip.high')}\n• ${t('assessment.quality.table.tooltip.medium')}\n• ${t('assessment.quality.table.tooltip.low')}\n• ${t('assessment.quality.table.tooltip.notSufficient')}\n\n${t('assessment.quality.table.tooltip.exceptions')}`}
          >
            <strong>{t('assessment.quality.table.headers.answer')}</strong>
          </StatCanTooltip>
        </div>

        <form className="wb-frmvld" role="form" onSubmit={(e) => { e.preventDefault(); handleEvaluate(); }}>
          <ul className="list-unstyled mrgn-tp-lg">
            {QUALITY_DIMENSIONS.map((dimension) => (
              <li key={dimension.id} className="mrgn-bttm-lg">
                <section className="panel panel-default">
                  <div className="panel-body">
                    <fieldset>
                      <legend id={`quality-el-${dimension.id}`}>
                        {t(`qualityDimensions.dimension${dimension.id}.element`)}
                      </legend>

                      <div className="form-section-content">
                        <div className="form-section-label">{t('assessment.quality.table.headers.definition')}:</div>
                        <div dangerouslySetInnerHTML={{__html: t(`qualityDimensions.dimension${dimension.id}.definition`)}} />
                      </div>

                      <div className="form-section-content">
                        <div className="form-section-label">{t('assessment.quality.table.headers.criteria')}:</div>
                        <div className="checkbox-group-container" id={`quality-crit-${dimension.id}`}>
                          {dimension.criteria.map((_, idx) => (
                            <div key={idx} className="checkbox">
                              <label htmlFor={`quality-${dimension.id}-${idx}`}>
                                <input
                                  id={`quality-${dimension.id}-${idx}`}
                                  type="checkbox"
                                  checked={criteriaSatisfaction[dimension.id]?.[idx] || false}
                                  onChange={(e) => handleCriteriaChange(dimension.id, idx, e.target.checked)}
                                  aria-describedby={`quality-el-${dimension.id}`}
                                />
                                {t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="score-display-info">
                        <strong>{t('assessment.quality.summary.tableHeaders.score')}:</strong>
                        {' '}
                        <span className="label label-info">
                          {t('assessment.quality.summary.scoreDisplay', {
                            score: qualityScores[dimension.id] || 0,
                            maxScore: dimension.maxScore
                          })}
                        </span>
                      </div>
                    </fieldset>
                  </div>
                </section>
              </li>
            ))}
          </ul>
        </form>

        <section
          ref={resultRef}
          tabIndex={-1}
          aria-labelledby="quality-summary-title"
          className="transition-all"
        >
          <h3 id="quality-summary-title">
            {t('assessment.quality.summary.title')}
          </h3>

          {showResult && generateQualitySummary()}

          <div className="wb-inv-message wb-inv-message-grayscale mrgn-tp-md">
            <span className="glyphicon glyphicon-dashboard" aria-hidden="true"></span>
            <div className="wb-inv-message-content">
              <span>
                {t('assessment.quality.summary.totalScore')}
                <span>{t('assessment.quality.summary.scoreDisplay', { score: totalScore, maxScore: 15 })}</span>
              </span>
            </div>
          </div>

          {showResult && qualityPass !== null && (
            <div>
              <ResultCard result={qualityPass ? 'pass' : 'fail'}>
                <span className="text-center">{qualityPass ? t('assessment.quality.summary.pass') : t('assessment.quality.summary.fail')}</span>
              </ResultCard>
            </div>
          )}

          {showResult && qualityInterpretation && (
            <div className="wb-inv-message wb-inv-message-info mrgn-tp-md" role="status" aria-live="polite">
              <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
              <div className="wb-inv-message-content" dangerouslySetInnerHTML={{__html: qualityInterpretation}} />
            </div>
          )}
        </section>
      </CardContent>
      
      <CardFooter className="text-center">
        <Button 
          onClick={onGoBack}
          variant="outline"
          aria-label={t('assessment.quality.actions.goBackARIA')}
          className="btn-lg"
        >
          {t('assessment.quality.actions.goBack')}
        </Button>
        {!showResult ? (
          <Button 
            onClick={handleEvaluate}
            aria-label={t('assessment.quality.actions.evaluateARIA')}
            className="mrgn-lft-md btn-lg"
          >
            {t('assessment.quality.actions.evaluate')}
          </Button>
        ) : (
          <Button 
            onClick={handleContinue}
            aria-label={t('assessment.quality.actions.continueARIA')}
            className="mrgn-lft-md btn-lg"
          >
            {t('assessment.quality.actions.continue')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QualityDimensions;