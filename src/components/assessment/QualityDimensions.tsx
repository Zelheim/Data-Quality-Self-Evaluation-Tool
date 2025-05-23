// src/components/assessment/QualityDimensions.tsx
import React, { type JSX, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QUALITY_DIMENSIONS } from '../../types/assessment';
import { Button } from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import TooltipInfo from '../ui/TooltipInfo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell,
  TableCaption 
} from '../ui/Table';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '../ui/Select';

interface QualityDimensionsProps {
  qualityScores: Record<string, number>;
  setQualityScores: (value: Record<string, number>) => void;
  totalScore: number;
  setTotalScore: (value: number) => void;
  qualityPass: boolean | null;
  setQualityPass: (value: boolean) => void;
  onEvaluate: () => void;
}

const QualityDimensions: React.FC<QualityDimensionsProps> = ({
  qualityScores,
  setQualityScores,
  totalScore,
  setTotalScore,
  qualityPass,
  setQualityPass,
  onEvaluate,
}) => {
  const { t } = useTranslation();
  const [qualitySummary, setQualitySummary] = React.useState<JSX.Element | null>(null);
  const [qualityInterpretation, setQualityInterpretation] = React.useState('');
  const [showResult, setShowResult] = React.useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const getQualityScoreText = (score: number) => {
    if (score === 0) return t('assessment.quality.scoreText.notSufficient');
    if (score === 1) return t('assessment.quality.scoreText.low');
    if (score === 2) return t('assessment.quality.scoreText.medium');
    if (score === 3) return t('assessment.quality.scoreText.high');
    return "";
  };

  const handleScoreChange = (id: string, value: number) => {
    const newScores = {
      ...qualityScores,
      [id]: value
    };
    setQualityScores(newScores);
    
    // Update total score
    const newTotalScore = Object.values(newScores).reduce((sum, score) => sum + score, 0);
    setTotalScore(newTotalScore);
  };

  const generateQualitySummary = () => {
    return (
      <div className="overflow-hidden rounded-lg shadow-md">
        <Table aria-labelledby="quality-summary-title">
          <TableHeader>
            <TableRow>
              <TableHead>{t('assessment.quality.summary.tableHeaders.dimension')}</TableHead>
              <TableHead className="text-center">{t('assessment.quality.summary.tableHeaders.score')}</TableHead>
              <TableHead>{t('assessment.quality.summary.tableHeaders.assessment')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {QUALITY_DIMENSIONS.map((dimension, index) => {
              const score = qualityScores[dimension.id] || 0;
              const assessment = getQualityScoreText(score);
              return (
                <TableRow key={dimension.id} className={index % 2 === 0 ? "bg-white" : "bg-[var(--light-blue)]"}>
                  <TableCell className="font-bold text-[var(--primary-color)]">{t(`qualityDimensions.dimension${dimension.id}.element`)}</TableCell>
                  <TableCell className="text-start font-semibold">
                    {t('assessment.quality.summary.scoreDisplay', { score: score, maxScore: dimension.maxScore })}
                  </TableCell>
                  <TableCell>{assessment}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  const updateQualityResult = () => {
    const isQualityPass = totalScore >= 8;
    setQualityPass(isQualityPass);
    
    let message = '';
    if (totalScore <= 7) {
      message = t('assessment.quality.interpretation.low');
    } else if (totalScore >= 8 && totalScore <= 10) {
      message = t('assessment.quality.interpretation.medium');
    } else if (totalScore >= 11) {
      message = t('assessment.quality.interpretation.high');
    }
    
    setQualityInterpretation(message);
    setQualitySummary(generateQualitySummary());
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
    <Card className="backdrop-blur-sm bg-white/90 shadow-lg border border-[var(--border-color)] p-6 rounded-lg transition-all hover:shadow-xl">
      <CardHeader>
        <CardTitle id="quality-dimensions-title">
          {t('assessment.quality.title')}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="intro-text mb-6">
          <p className="text-lg">
            {t('assessment.quality.intro.part1')}
          </p>
          <br></br>
          <p className="text-lg">
            {t('assessment.quality.intro.part2')}
          </p>
        </div>

        <div className="overflow-hidden rounded-lg shadow-md mb-8">
          <Table aria-labelledby="quality-dimensions-title">
            <TableCaption className="sr-only">{t('assessment.quality.table.caption')}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg">{t('assessment.quality.table.headers.elements')}</TableHead>
                <TableHead className="text-lg">{t('assessment.quality.table.headers.definition')}</TableHead>
                <TableHead className="text-lg">{t('assessment.quality.table.headers.criteria')}</TableHead>
                <TableHead className="text-lg">
                  {t('assessment.quality.table.headers.answer')}
                  <TooltipInfo id="tooltip-points-info">
                    {t('assessment.quality.table.tooltip.title')}<br />
                    {t('assessment.quality.table.tooltip.high')}<br />
                    {t('assessment.quality.table.tooltip.medium')}<br />
                    {t('assessment.quality.table.tooltip.low')}<br />
                    {t('assessment.quality.table.tooltip.notSufficient')}
                  </TooltipInfo>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {QUALITY_DIMENSIONS.map((dimension, index) => (
                <TableRow key={dimension.id} className={index % 2 === 0 ? "bg-white" : "bg-[var(--light-blue)]"}>
                  <TableCell className="text-base font-bold text-[var(--primary-color)]">
                    <span id={`quality-el-${dimension.id}`}>{t(`qualityDimensions.dimension${dimension.id}.element`)}</span>
                  </TableCell>
                  <TableCell className="text-base">{t(`qualityDimensions.dimension${dimension.id}.definition`)}</TableCell>
                  <TableCell id={`quality-crit-${dimension.id}`} className="text-base">
                    {dimension.criteria.map((_, idx) => (
                      <React.Fragment key={idx}>
                        {idx + 1}. {t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}
                        <br /> <br />
                      </React.Fragment>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={qualityScores[dimension.id]?.toString() || "0"}
                      onValueChange={(value) => handleScoreChange(dimension.id, parseInt(value))}
                    >
                      <SelectTrigger 
                        className="w-full shadow-sm transition-all hover:border-[var(--secondary-color)]" 
                        aria-labelledby={`quality-el-${dimension.id} quality-crit-${dimension.id}`}
                        style={{ fontSize: '1rem' }}
                      >
                        <SelectValue 
                          placeholder={t('assessment.quality.table.options.select')} 
                          className="text-base"
                          style={{ fontSize: '1rem' }}
                        />
                      </SelectTrigger>
                      {dimension.id === "3" ? (
                        <SelectContent 
                          position="popper"
                          sideOffset={5}
                          align="start"
                        >
                          <SelectItem 
                            value="0"
                            className="text-base py-3"
                            style={{ fontSize: '1rem' }}
                          >
                            <span style={{ fontSize: '1rem' }}>0 - {t('assessment.quality.scoreText.notSufficient')}</span>
                          </SelectItem>
                          <SelectItem 
                            value="1"
                            className="text-base py-3"
                            style={{ fontSize: '1rem' }}
                          >
                            <span style={{ fontSize: '1rem' }}>1 - {t('assessment.quality.scoreText.low')}</span>
                          </SelectItem>
                          <SelectItem 
                            value="3"
                            className="text-base py-3"
                            style={{ fontSize: '1rem' }}
                          >
                            <span style={{ fontSize: '1rem' }}>3 - {t('assessment.quality.scoreText.high')}</span>
                          </SelectItem>
                        </SelectContent>
                      ) : (
                        <SelectContent 
                          position="popper"
                          sideOffset={5}
                          align="start"
                        >
                          <SelectItem 
                            value="0"
                            className="text-base py-3"
                            style={{ fontSize: '1rem' }}
                          >
                            <span style={{ fontSize: '1rem' }}>0 - {t('assessment.quality.scoreText.notSufficient')}</span>
                          </SelectItem>
                          <SelectItem 
                            value="1"
                            className="text-base py-3"
                            style={{ fontSize: '1rem' }}
                          >
                            <span style={{ fontSize: '1rem' }}>1 - {t('assessment.quality.scoreText.low')}</span>
                          </SelectItem>
                          <SelectItem 
                            value="2"
                            className="text-base py-3"
                            style={{ fontSize: '1rem' }}
                          >
                            <span style={{ fontSize: '1rem' }}>2 - {t('assessment.quality.scoreText.medium')}</span>
                          </SelectItem>
                          <SelectItem 
                            value="3"
                            className="text-base py-3"
                            style={{ fontSize: '1rem' }}
                          >
                            <span style={{ fontSize: '1rem' }}>3 - {t('assessment.quality.scoreText.high')}</span>
                          </SelectItem>
                        </SelectContent>
                      )}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div 
          className="section-header font-bold mt-8 mb-4 text-xl"
          id="quality-summary-title"
        >
          {t('assessment.quality.summary.title')}
        </div>
        
        <div 
          ref={resultRef}
          tabIndex={-1}
          aria-labelledby="quality-summary-title"
          className="transition-all"
        >
          {showResult && qualitySummary}
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 bg-[var(--light-blue)]/30 p-4 rounded-lg">
            <div>
              <span className="text-lg">
                {t('assessment.quality.summary.totalScore')} <span className="font-bold text-[var(--primary-color)]">
                  {t('assessment.quality.summary.scoreDisplay', { score: totalScore, maxScore: 15 })}
                </span>
              </span>
            </div>
          </div>
          
          {showResult && qualityPass !== null && (
            <div className="mt-5 transform transition-all text-center">
              <ResultCard result={qualityPass ? 'pass' : 'fail'}>
                <span className="block text-center">{qualityPass ? t('assessment.quality.summary.pass') : t('assessment.quality.summary.fail')}</span>
              </ResultCard>
            </div>
          )}
          
          {showResult && qualityInterpretation && (
            <div className="mt-4 italic bg-[var(--light-blue)]/50 p-4 rounded-lg shadow-sm" role="status" aria-live="polite">
              {qualityInterpretation}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="text-center gap-3">
        {!showResult ? (
          <Button 
            onClick={handleEvaluate}
            aria-label={t('assessment.quality.actions.evaluate')}
            className="transform transition-transform hover:scale-105 px-6 py-2.5 text-lg"
          >
            {t('assessment.quality.actions.evaluate')}
          </Button>
        ) : (
          <Button 
            onClick={handleContinue}
            aria-label={t('assessment.quality.actions.continue')}
            className="transform transition-transform hover:scale-105 px-6 py-2.5 text-lg"
          >
            {t('assessment.quality.actions.continue')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QualityDimensions;