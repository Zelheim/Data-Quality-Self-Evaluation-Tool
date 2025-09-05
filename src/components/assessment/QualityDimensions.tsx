// src/components/assessment/QualityDimensions.tsx
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QUALITY_DIMENSIONS } from '../../types/assessment';

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

  const handleCriteriaChange = (dimensionId: string, criteriaIndex: number, checked: boolean) => {
    const newCriteriaSatisfaction = {
      ...criteriaSatisfaction,
      [dimensionId]: [...(criteriaSatisfaction[dimensionId] || [])]
    };
    
    newCriteriaSatisfaction[dimensionId][criteriaIndex] = checked;
    setCriteriaSatisfaction(newCriteriaSatisfaction);
    
    // Calculate new score for this dimension
    const satisfiedCount = newCriteriaSatisfaction[dimensionId].filter(Boolean).length;
    
    // Special case for Accessibility and clarity (dimension 3): 2 criteria satisfied = 3 points
    let score = satisfiedCount;
    if (dimensionId === "3" && satisfiedCount === 2) {
      score = 3;
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
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <caption className="wb-inv">{t('assessment.quality.summary.title')}</caption>
          <thead>
            <tr>
              <th scope="col">{t('assessment.quality.summary.tableHeaders.dimension')}</th>
              <th scope="col">{t('assessment.quality.summary.tableHeaders.score')}</th>
              <th scope="col">{t('assessment.overall.criteriaSatisfied')}</th>
            </tr>
          </thead>
          <tbody>
            {QUALITY_DIMENSIONS.map((dimension) => {
              const score = qualityScores[dimension.id] || 0;
              const criteria = criteriaSatisfaction[dimension.id] || [];
              
              return (
                <tr key={dimension.id}>
                  <td><strong>{t(`qualityDimensions.dimension${dimension.id}.element`)}</strong></td>
                  <td>{t('assessment.quality.summary.scoreDisplay', { score: score, maxScore: dimension.maxScore })}</td>
                  <td>
                    <ul className="list-unstyled">
                      {dimension.criteria.map((_, idx) => (
                        <li key={idx} className={`small ${criteria[idx] ? 'text-success' : 'text-danger'}`}>
                          {criteria[idx] ? '✓' : '✗'} {t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const updateQualityResult = () => {
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
    <section className="panel panel-default">
      <header className="panel-heading">
        <h2 id="quality-dimensions-title" className="panel-title">
          {t('assessment.quality.title')}
        </h2>
      </header>

      <div className="panel-body">
        <div className="mrgn-bttm-lg">
          <p className="lead">
            {t('assessment.quality.intro.intro')}
          </p>
          <ol className="mrgn-bttm-lg mrgn-tp-md">
            <li>{t('assessment.quality.intro.bulletPoints.item1')}</li>
            <li>{t('assessment.quality.intro.bulletPoints.item2')}</li>
            <li>{t('assessment.quality.intro.bulletPoints.item3')}</li>
            <li>{t('assessment.quality.intro.bulletPoints.item4')}</li>
            <li>{t('assessment.quality.intro.bulletPoints.item5')}</li>
          </ol>
          <p>{t('assessment.quality.intro.part1')}</p>
          <p className="mrgn-tp-md">{t('assessment.quality.intro.part2')}</p>
        </div>

        <div className="table-responsive mrgn-bttm-lg">
          <table className="table table-striped table-bordered">
            <caption className="wb-inv">{t('assessment.quality.table.caption')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('assessment.quality.table.headers.elements')}</th>
                <th scope="col">{t('assessment.quality.table.headers.definition')}</th>
                <th scope="col">{t('assessment.quality.table.headers.criteria')}</th>
                <th scope="col">{t('assessment.quality.table.headers.answer')}</th>
              </tr>
            </thead>
            <tbody>
              {QUALITY_DIMENSIONS.map((dimension) => (
                <tr key={dimension.id}>
                  <td>
                    <strong id={`quality-el-${dimension.id}`}>
                      {t(`qualityDimensions.dimension${dimension.id}.element`)}
                    </strong>
                  </td>
                  <td>{t(`qualityDimensions.dimension${dimension.id}.definition`)}</td>
                  <td colSpan={2}>
                    <div id={`quality-crit-${dimension.id}`}>
                      {dimension.criteria.map((_, idx) => (
                        <div key={idx} className="criteria-row mrgn-bttm-sm">
                          <div className="criteria-text">
                            <label htmlFor={`quality-${dimension.id}-${idx}`}>
                              {idx + 1}. {t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}
                            </label>
                          </div>
                          <div className="criteria-checkbox">
                            <div className="checkbox">
                              <input
                                id={`quality-${dimension.id}-${idx}`}
                                type="checkbox"
                                checked={criteriaSatisfaction[dimension.id]?.[idx] || false}
                                onChange={(e) => handleCriteriaChange(dimension.id, idx, e.target.checked)}
                                aria-describedby={`quality-crit-${dimension.id}`}
                              />
                              <label htmlFor={`quality-${dimension.id}-${idx}`} className="wb-inv">
                                {t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mrgn-tp-lg">
          <h3 id="quality-summary-title">
            {t('assessment.quality.summary.title')}
          </h3>
          
          <div 
            ref={resultRef}
            tabIndex={-1}
            aria-labelledby="quality-summary-title"
          >
            {showResult && generateQualitySummary()}
            
            <div className="well mrgn-tp-md">
              <p className="lead">
                {t('assessment.quality.summary.totalScore')} 
                <strong className="text-primary">
                  {t('assessment.quality.summary.scoreDisplay', { score: totalScore, maxScore: 15 })}
                </strong>
              </p>
            </div>
            
            {showResult && qualityPass !== null && (
              <div className={`alert ${qualityPass ? 'alert-success' : 'alert-danger'} mrgn-tp-md`} role="alert">
                <p className="h4">
                  {qualityPass ? t('assessment.quality.summary.pass') : t('assessment.quality.summary.fail')}
                </p>
              </div>
            )}
            
            {showResult && qualityInterpretation && (
              <div className="alert alert-info mrgn-tp-md" role="status" aria-live="polite">
                <div dangerouslySetInnerHTML={{__html: qualityInterpretation}} />
              </div>
            )}
          </div>
        </section>
      </div>
      
      <footer className="panel-footer text-center">
        <button 
          type="button"
          className="btn btn-default mrgn-rght-sm"
          onClick={onGoBack}
          aria-label={t('assessment.quality.actions.goBack')}
        >
          {t('assessment.quality.actions.goBack')}
        </button>
        {!showResult ? (
          <button 
            type="button"
            className="btn btn-primary"
            onClick={handleEvaluate}
            aria-label={t('assessment.quality.actions.evaluate')}
          >
            {t('assessment.quality.actions.evaluate')}
          </button>
        ) : (
          <button 
            type="button"
            className="btn btn-primary"
            onClick={handleContinue}
            aria-label={t('assessment.quality.actions.continue')}
          >
            {t('assessment.quality.actions.continue')}
          </button>
        )}
      </footer>
    </section>
  );
};

export default QualityDimensions;