import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
} from '../ui/Card';
// Removed old Dialog imports - using WET-BOEW modal pattern
import { ETHICS_PRINCIPLES, QUALITY_DIMENSIONS } from '../../types/assessment';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '../ui/Table';

interface OverallAssessmentProps {
  ethicsPass: boolean | null;
  qualityPass: boolean | null;
  totalQualityScore: number;
  part1MessageKey: string;
  qualityInterpretationKey: string;
  onReset: () => void;
  assessmentData: any;
  onReturnHome?: () => void;
}

const OverallAssessment: React.FC<OverallAssessmentProps> = ({
  ethicsPass,
  qualityPass,
  totalQualityScore,
  part1MessageKey,
  qualityInterpretationKey,
  onReset,
  assessmentData,
  onReturnHome
}) => {
  const { t } = useTranslation();
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const [exportFormat, setExportFormat] = React.useState<'text' | 'csv' | 'pdf' | 'word'>('text');
  const [exportContent, setExportContent] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const resultSummaryRef = useRef<HTMLDivElement>(null);
  
  const overallPass = ethicsPass && qualityPass;
  
  let resultClass = '';
  let resultText = t('assessment.overall.summary.fail');
  
  if (overallPass) {
    resultClass = 'wb-inv-result wb-inv-result-pass';
    resultText = t('assessment.overall.summary.pass');
  } else if (ethicsPass && !qualityPass) {
    resultClass = 'wb-inv-result wb-inv-result-fail';
    resultText = t('assessment.overall.summary.fail');
  } else {
    resultClass = 'wb-inv-result wb-inv-result-fail';
    resultText = t('assessment.overall.summary.fail');
  }

  // Focus on the summary when component mounts
  useEffect(() => {
    if (resultSummaryRef.current) {
      resultSummaryRef.current.focus();
    }
  }, []);

  const handleExport = () => {
    generateExportContent();
    setExportDialogOpen(true);
  };

  const generateExportContent = () => {
    const date = new Date().toISOString().split('T')[0];
    const part1Message = part1MessageKey ? t(part1MessageKey) : '';
    const qualityInterpretation = qualityInterpretationKey ? t(qualityInterpretationKey) : '';
    const part1ResultText = `${t('assessment.overall.export.ethicsAssessment')}: ${ethicsPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')}\n${t('assessment.overall.export.message')}: ${part1Message}\n`;
    const qualityResultText = `${t('assessment.overall.export.qualityAssessment')}: ${qualityPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')} (${t('assessment.overall.export.score')}: ${totalQualityScore}/15)\n${t('assessment.overall.export.interpretation')}: ${qualityInterpretation}\n`;
    const overallResultText = `${t('assessment.overall.export.result')}: ${overallPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')}\n`;
    
    // Generate overall assessment message
    const overallMessage = overallPass 
      ? t('assessment.overall.messages.bothPass')
      : ethicsPass && !qualityPass
        ? t('assessment.overall.messages.ethicsPassQualityFail')
        : !ethicsPass && qualityPass
          ? t('assessment.overall.messages.ethicsFailQualityPass')
          : t('assessment.overall.messages.bothFail');
    
    let content = '';
    
    if (exportFormat === 'text') {
      content = `${t('mainContent.tabs.assessment')} - ${t('assessment.overall.title')}\n`;
      content += `${t('assessment.overall.export.date')}: ${date}\n\n`;
      content += `${t('assessment.overall.export.overallResult')}: ${overallPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')}\n`;
      content += `${t('assessment.overall.export.overallMessage')}: ${overallMessage}\n\n`;
      content += `${t('assessment.overall.export.ethicsPrinciples')}\n`;
      content += part1ResultText + "\n";
      content += `${t('assessment.overall.export.ethicsPrinciplesList')}:\n`;
      for (const [id, answer] of Object.entries(assessmentData.ethicsPrinciples)) {
        const principle = ETHICS_PRINCIPLES.find(p => p.id === id);
        if (principle) {
          const translatedAnswer = answer === "Yes" 
            ? t('assessment.ethics.table.answers.yes') 
            : answer === "No" 
              ? t('assessment.ethics.table.answers.no') 
              : answer || t('assessment.overall.export.notEvaluated');
          content += `- ${t(`ethicsPrinciples.principle${principle.id}.element`)}: ${translatedAnswer}\n`;
        }
      }
      content += `\n${t('assessment.overall.export.qualityDimensions')}\n`;
      content += qualityResultText + "\n";
      content += `${t('assessment.overall.export.qualityDimensionsList')}:\n`;
      
      // Use QUALITY_DIMENSIONS to ensure all dimensions are included with detailed criteria
      for (const dimension of QUALITY_DIMENSIONS) {
        const score = assessmentData.qualityDimensions[dimension.id] || 0;
        const assessment = getQualityScoreText(Number(score));
        content += `- ${t(`qualityDimensions.dimension${dimension.id}.element`)}: ${score}/3 - ${assessment}\n`;
        
        // Add detailed criteria satisfaction
        const criteriaSatisfied: any[] = [];
        for (let i = 0; i < dimension.criteria.length; i++) {
          if (dimension.id === "3") {
            criteriaSatisfied.push(score === 3 || (score >= 1 && i < score));
          } else {
            criteriaSatisfied.push(i < score);
          }
        }
        
        content += `  ${t('assessment.overall.export.criteriaDetails')}:\n`;
        dimension.criteria.forEach((_, idx) => {
          const status = criteriaSatisfied[idx] ? t('assessment.overall.export.criteriaStatus.satisfied') : t('assessment.overall.export.criteriaStatus.notSatisfied');
          content += `    ${idx + 1}. ${t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}: ${status}\n`;
        });
        content += '\n';
      }
      
      content += overallResultText;
    }
    else if (exportFormat === 'csv') {
      // CSV format with detailed criteria information
      content = `${t('mainContent.tabs.assessment')} - ${t('assessment.overall.title')}\r\n\r\n`;
      content += `${t('assessment.overall.export.summaryHeader')}\r\n`;
      content += `${t('assessment.overall.export.category')},${t('assessment.overall.export.result')}\r\n`;
      content += `${t('assessment.overall.export.date')},${date}\r\n`;
      content += `${t('assessment.overall.export.overallResult')},${overallPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')}\r\n`;
      content += `${t('assessment.overall.export.overallMessage')},"${overallMessage.replace(/"/g, '""')}"\r\n`;
      content += `${t('assessment.overall.export.ethicsAssessment')},${ethicsPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')}\r\n`;
      content += `${t('assessment.overall.export.message')},"${part1Message.replace(/"/g, '""')}"\r\n`;
      content += `${t('assessment.overall.export.qualityAssessment')},${qualityPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')}\r\n`;
      content += `${t('assessment.overall.export.interpretation')},"${qualityInterpretation.replace(/"/g, '""')}"\r\n`;
      content += `${t('assessment.overall.export.score')},${totalQualityScore}/15\r\n\r\n`;
      content += `${t('assessment.overall.export.ethicsPrinciples')}\r\n`;
      content += `${t('assessment.overall.export.ethicsPrinciple')},${t('assessment.overall.export.evaluation')}\r\n`;
      
      for (const principle of ETHICS_PRINCIPLES) {
        const answer = assessmentData.ethicsPrinciples[principle.id];
        const translatedAnswer = answer === "Yes" 
          ? t('assessment.ethics.table.answers.yes') 
          : answer === "No" 
            ? t('assessment.ethics.table.answers.no') 
            : answer || t('assessment.overall.export.notEvaluated');
        content += `"${t(`ethicsPrinciples.principle${principle.id}.element`)}","${translatedAnswer}"\r\n`;
      }
      
      content += "\r\n";
      content += `${t('assessment.overall.export.qualityDimensions')}\r\n`;
      content += `${t('assessment.overall.export.qualityDimension')},${t('assessment.overall.export.scoreHeader')},${t('assessment.overall.export.assessment')},${t('assessment.overall.export.criteriaDetails')}\r\n`;
      
      for (const dimension of QUALITY_DIMENSIONS) {
        const score = assessmentData.qualityDimensions[dimension.id] || 0;
        const assessment = getQualityScoreText(Number(score));
        
        // Calculate criteria satisfaction
        const criteriaSatisfied: any[] = [];
        for (let i = 0; i < dimension.criteria.length; i++) {
          if (dimension.id === "3") {
            criteriaSatisfied.push(score === 3 || (score >= 1 && i < score));
          } else {
            criteriaSatisfied.push(i < score);
          }
        }
        
        // Create criteria details string
        const criteriaDetails = dimension.criteria.map((_, idx) => {
          const status = criteriaSatisfied[idx] ? t('assessment.overall.export.criteriaStatus.satisfied') : t('assessment.overall.export.criteriaStatus.notSatisfied');
          return `${idx + 1}. ${t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}: ${status}`;
        }).join('; ');
        
        content += `"${t(`qualityDimensions.dimension${dimension.id}.element`)}",${score}/3,"${assessment}","${criteriaDetails.replace(/"/g, '""')}"\r\n`;
      }
    }
    
    setExportContent(content);
  };
  
  const generatePDFExport = async () => {
    setIsGenerating(true);
    try {
      // Dynamically import jsPDF
      const { default: jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = margin;
      
      // Title
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${t('mainContent.tabs.assessment')} - ${t('assessment.overall.title')}`, margin, yPosition);
      yPosition += 15;
      
      // Date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const date = new Date().toISOString().split('T')[0];
      pdf.text(`${t('assessment.overall.export.date')}: ${date}`, margin, yPosition);
      yPosition += 20;
      
      // Overall Result
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${t('assessment.overall.export.overallResult')}: ${overallPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')}`, margin, yPosition);
      yPosition += 15;
      
      // Overall Message
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const overallMessage = overallPass 
        ? t('assessment.overall.messages.bothPass')
        : ethicsPass && !qualityPass
          ? t('assessment.overall.messages.ethicsPassQualityFail')
          : !ethicsPass && qualityPass
            ? t('assessment.overall.messages.ethicsFailQualityPass')
            : t('assessment.overall.messages.bothFail');
      
      const splitMessage = pdf.splitTextToSize(overallMessage, pageWidth - 2 * margin);
      pdf.text(splitMessage, margin, yPosition);
      yPosition += splitMessage.length * 5 + 10;
      
      // Ethics Principles Section
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(t('assessment.overall.export.ethicsPrinciples'), margin, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const part1Message = part1MessageKey ? t(part1MessageKey) : '';
      const ethicsResult = `${t('assessment.overall.export.ethicsAssessment')}: ${ethicsPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')}`;
      pdf.text(ethicsResult, margin, yPosition);
      yPosition += 8;
      
      const splitPart1Message = pdf.splitTextToSize(part1Message, pageWidth - 2 * margin);
      pdf.text(splitPart1Message, margin, yPosition);
      yPosition += splitPart1Message.length * 5 + 10;
      
      // Quality Dimensions Section
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(t('assessment.overall.export.qualityDimensions'), margin, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const qualityInterpretation = qualityInterpretationKey ? t(qualityInterpretationKey) : '';
      const qualityResult = `${t('assessment.overall.export.qualityAssessment')}: ${qualityPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')} (${t('assessment.overall.export.score')}: ${totalQualityScore}/15)`;
      pdf.text(qualityResult, margin, yPosition);
      yPosition += 8;
      
      const splitQualityMessage = pdf.splitTextToSize(qualityInterpretation, pageWidth - 2 * margin);
      pdf.text(splitQualityMessage, margin, yPosition);
      yPosition += splitQualityMessage.length * 5 + 10;
      
      // Quality Dimensions Details
      for (const dimension of QUALITY_DIMENSIONS) {
        if (yPosition > 240) {
          pdf.addPage();
          yPosition = margin;
        }
        
        const score = assessmentData.qualityDimensions[dimension.id] || 0;
        const assessment = getQualityScoreText(Number(score));
        
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${t(`qualityDimensions.dimension${dimension.id}.element`)}: ${score}/3 - ${assessment}`, margin, yPosition);
        yPosition += 8;
        
        pdf.setFont('helvetica', 'normal');
        dimension.criteria.forEach((_, idx) => {
          const criteriaSatisfied = dimension.id === "3" ? (score === 3 || (score >= 1 && idx < score)) : (idx < score);
          const status = criteriaSatisfied ? t('assessment.overall.export.criteriaStatus.satisfied') : t('assessment.overall.export.criteriaStatus.notSatisfied');
          const criteriaText = `  ${idx + 1}. ${t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}: ${status}`;
          const splitCriteria = pdf.splitTextToSize(criteriaText, pageWidth - 2 * margin);
          pdf.text(splitCriteria, margin, yPosition);
          yPosition += splitCriteria.length * 4;
        });
        yPosition += 5;
      }
      
      return pdf;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateWordExport = async () => {
    setIsGenerating(true);
    try {
      // Dynamically import docx
      const { Document, Paragraph, TextRun, AlignmentType, HeadingLevel } = await import('docx');
      
      const date = new Date().toISOString().split('T')[0];
      const part1Message = part1MessageKey ? t(part1MessageKey) : '';
      const qualityInterpretation = qualityInterpretationKey ? t(qualityInterpretationKey) : '';
      
      const overallMessage = overallPass 
        ? t('assessment.overall.messages.bothPass')
        : ethicsPass && !qualityPass
          ? t('assessment.overall.messages.ethicsPassQualityFail')
          : !ethicsPass && qualityPass
            ? t('assessment.overall.messages.ethicsFailQualityPass')
            : t('assessment.overall.messages.bothFail');

      const children = [
        // Title
        new Paragraph({
          children: [
            new TextRun({
              text: `${t('mainContent.tabs.assessment')} - ${t('assessment.overall.title')}`,
              bold: true,
              size: 32,
            }),
          ],
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),
        
        // Date
        new Paragraph({
          children: [
            new TextRun({
              text: `${t('assessment.overall.export.date')}: ${date}`,
              size: 24,
            }),
          ],
          spacing: { after: 200 },
        }),
        
        // Overall Result
        new Paragraph({
          children: [
            new TextRun({
              text: `${t('assessment.overall.export.overallResult')}: `,
              bold: true,
              size: 28,
            }),
            new TextRun({
              text: overallPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail'),
              bold: true,
              size: 28,
              color: overallPass ? "00AA00" : "AA0000",
            }),
          ],
          spacing: { after: 200 },
        }),
        
        // Overall Message
        new Paragraph({
          children: [
            new TextRun({
              text: overallMessage,
              size: 22,
            }),
          ],
          spacing: { after: 300 },
        }),
        
        // Ethics Principles Section
        new Paragraph({
          children: [
            new TextRun({
              text: t('assessment.overall.export.ethicsPrinciples'),
              bold: true,
              size: 26,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: `${t('assessment.overall.export.ethicsAssessment')}: ${ethicsPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')}`,
              size: 22,
            }),
          ],
          spacing: { after: 100 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: part1Message,
              size: 22,
            }),
          ],
          spacing: { after: 300 },
        }),
        
        // Quality Dimensions Section
        new Paragraph({
          children: [
            new TextRun({
              text: t('assessment.overall.export.qualityDimensions'),
              bold: true,
              size: 26,
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: `${t('assessment.overall.export.qualityAssessment')}: ${qualityPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')} (${t('assessment.overall.export.score')}: ${totalQualityScore}/15)`,
              size: 22,
            }),
          ],
          spacing: { after: 100 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: qualityInterpretation,
              size: 22,
            }),
          ],
          spacing: { after: 300 },
        }),
      ];

      // Add quality dimensions details
      QUALITY_DIMENSIONS.forEach(dimension => {
        const score = assessmentData.qualityDimensions[dimension.id] || 0;
        const assessment = getQualityScoreText(Number(score));
        
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${t(`qualityDimensions.dimension${dimension.id}.element`)}: ${score}/3 - ${assessment}`,
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 100 },
          })
        );
        
        dimension.criteria.forEach((_, idx) => {
          const criteriaSatisfied = dimension.id === "3" ? (score === 3 || (score >= 1 && idx < score)) : (idx < score);
          const status = criteriaSatisfied ? t('assessment.overall.export.criteriaStatus.satisfied') : t('assessment.overall.export.criteriaStatus.notSatisfied');
          
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `  ${idx + 1}. ${t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}: `,
                  size: 20,
                }),
                new TextRun({
                  text: status,
                  size: 20,
                  bold: true,
                  color: criteriaSatisfied ? "00AA00" : "AA0000",
                }),
              ],
              spacing: { after: 50 },
            })
          );
        });
        
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "", size: 20 })],
            spacing: { after: 200 },
          })
        );
      });

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: children,
          },
        ],
      });

      return doc;
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Use useEffect to update the export content whenever the format changes
  useEffect(() => {
    if (exportDialogOpen) {
      generateExportContent();
    }
  }, [exportFormat, exportDialogOpen]);
  
  const getQualityScoreText = (score: number) => {
    if (score === 0) return t('assessment.quality.scoreText.notSufficient');
    if (score === 1) return t('assessment.quality.scoreText.low');
    if (score === 2) return t('assessment.quality.scoreText.medium');
    if (score === 3) return t('assessment.quality.scoreText.high');
    return "";
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportContent)
      .then(() => {
        // Show success message or animation
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  
  const handleDownload = async () => {
    const date = new Date().toISOString().split('T')[0];
    let fileName = `data-quality-assessment-${date}`;
    
    if (exportFormat === "text") {
      fileName += ".txt";
      const blob = new Blob([exportContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } else if (exportFormat === "csv") {
      fileName += ".csv";
      // Add UTF-8 BOM for proper encoding of French characters
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + exportContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } else if (exportFormat === "pdf") {
      fileName += ".pdf";
      const pdf = await generatePDFExport();
      pdf.save(fileName);
    } else if (exportFormat === "word") {
      fileName += ".docx";
      const doc = await generateWordExport();
      // Dynamically import Packer for Word export
      const { Packer } = await import('docx');
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }
  };
  
  const renderEthicsPrinciplesSummary = () => {
    return (
      <div className="mb-8">
        <h3 id="ethics-summary-title" className="h3 mrgn-bttm-md text-primary">
          {t('assessment.ethics.title')}
        </h3>
        
        <div className={`wb-inv-result ${ethicsPass ? 'wb-inv-result-pass' : 'wb-inv-result-fail'} mrgn-bttm-md`} role="status">
          <span className={`glyphicon ${ethicsPass ? 'glyphicon-ok-sign text-success' : 'glyphicon-remove-sign text-danger'}`} aria-hidden="true"></span>
          <div className="wb-inv-result-content">
            <strong>{ethicsPass ? t('assessment.ethics.results.pass') : t('assessment.ethics.results.fail')}</strong>
          </div>
        </div>
        
        <div className="wb-inv-message wb-inv-message-info mrgn-bttm-md">
          <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
          <div className="wb-inv-message-content" dangerouslySetInnerHTML={{__html: part1MessageKey ? t(part1MessageKey) : ''}} />
        </div>
        
        <div className="rounded-lg overflow-hidden shadow-md">
          <Table aria-labelledby="ethics-summary-title">
            <caption className="sr-only">{t('assessment.ethics.table.caption')}</caption>
            <TableHeader className="text-lg">
              <TableRow>
                <TableHead scope="col" className="bg-[var(--primary-color)]">{t('assessment.ethics.table.headers.elements')}</TableHead>
                <TableHead scope="col" className="bg-[var(--primary-color)]">{t('assessment.ethics.table.headers.answer')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ETHICS_PRINCIPLES.map((principle, index) => (
                <TableRow key={principle.id} className={index % 2 === 1 ? "bg-[var(--light-blue)]" : "bg-white"}>
                  <TableCell className="font-medium"><strong className="text-[var(--primary-color)] text-base">{t(`ethicsPrinciples.principle${principle.id}.element`)}</strong></TableCell>
                  <TableCell className="text-base">
                    {assessmentData.ethicsPrinciples[principle.id] 
                      ? assessmentData.ethicsPrinciples[principle.id] === "Yes"
                        ? t('assessment.ethics.table.answers.yes')
                        : assessmentData.ethicsPrinciples[principle.id] === "No"
                          ? t('assessment.ethics.table.answers.no')
                          : assessmentData.ethicsPrinciples[principle.id] 
                      : t('assessment.overall.export.notEvaluated')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };
  
  const renderQualityDimensionsSummary = () => {
    return (
      <div className="mb-8">
        <h3 id="quality-summary-title" className="h3 mrgn-bttm-md text-primary">
          {t('assessment.quality.title')}
        </h3>
        
        <div className={`wb-inv-result ${qualityPass ? 'wb-inv-result-pass' : 'wb-inv-result-fail'} mrgn-bttm-md`} role="status">
          <span className={`glyphicon ${qualityPass ? 'glyphicon-ok-sign text-success' : 'glyphicon-remove-sign text-danger'}`} aria-hidden="true"></span>
          <div className="wb-inv-result-content">
            <strong>{qualityPass ? t('assessment.quality.summary.pass') : t('assessment.quality.summary.fail')}</strong>
            <span>{t('assessment.quality.summary.totalScore')} {totalQualityScore}/15</span>
          </div>
        </div>
        
        <div className="wb-inv-message wb-inv-message-info mrgn-bttm-md">
          <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
          <div className="wb-inv-message-content" dangerouslySetInnerHTML={{__html: qualityInterpretationKey ? t(qualityInterpretationKey) : ''}} />
        </div>
        
        <div className="rounded-lg overflow-hidden shadow-md">
          <Table aria-labelledby="quality-summary-title">
            <caption className="sr-only">{t('assessment.quality.table.caption')}</caption>
            <TableHeader className="text-lg">
              <TableRow>
                <TableHead scope="col" className="bg-[var(--primary-color)]">{t('assessment.quality.table.headers.elements')}</TableHead>
                <TableHead scope="col" className="bg-[var(--primary-color)] text-center">{t('assessment.quality.summary.tableHeaders.score')}</TableHead>
                <TableHead scope="col" className="bg-[var(--primary-color)]">{t('assessment.overall.criteriaSatisfied')}</TableHead>  
              </TableRow>
            </TableHeader>
            <TableBody>
              {QUALITY_DIMENSIONS.map((dimension, index) => {
                const score = assessmentData.qualityDimensions[dimension.id] || 0;
                
                // Calculate which criteria were satisfied based on the score
                const criteriaSatisfied: any[] = [];
                for (let i = 0; i < dimension.criteria.length; i++) {
                  if (dimension.id === "3") {
                    // Special case for Accessibility and clarity: if score is 3, both criteria are satisfied
                    criteriaSatisfied.push(score === 3 || (score >= 1 && i < score));
                  } else {
                    // Standard case: score equals number of criteria satisfied
                    criteriaSatisfied.push(i < score);
                  }
                }
                
                return (
                  <TableRow key={dimension.id} className={index % 2 === 1 ? "bg-[var(--light-blue)]" : "bg-white"}>
                    <TableCell className="font-medium"><strong className="text-[var(--primary-color)] text-base">{t(`qualityDimensions.dimension${dimension.id}.element`)}</strong></TableCell>
                    <TableCell className="text-start font-semibold text-base">{score}/3</TableCell>
                    <TableCell className="text-base">
                      <div className="space-y-1">
                        {dimension.criteria.map((_, idx) => (
                          <div key={idx} className={`text-sm font-semibold ${criteriaSatisfied[idx] ? 'text-success' : 'text-danger'}`}>
                            {criteriaSatisfied[idx] ? '✓' : '✗'} {t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}
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
      </div>
    );
  };

  return (
    <Card className="panel panel-default">
      <CardHeader>
        <CardTitle id="overall-assessment-title" className="text-2xl">
          {t('assessment.overall.title')}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div 
          ref={resultSummaryRef}
          tabIndex={-1}
          className="mb-6"
          aria-labelledby="overall-assessment-title"
        >
          <div className={`${resultClass} mrgn-bttm-md`} role="alert">
            <span className={`glyphicon ${overallPass ? 'glyphicon-ok-sign text-success' : 'glyphicon-remove-sign text-danger'}`} aria-hidden="true"></span>
            <div className="wb-inv-result-content overall-message">
              <strong>{resultText}</strong>
            </div>
          </div>
          
          <div className="wb-inv-message wb-inv-message-info mrgn-tp-md mrgn-bttm-md">
            <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
            <div className="wb-inv-message-content" dangerouslySetInnerHTML={{
              __html: overallPass 
                ? t('assessment.overall.messages.bothPass')
                : ethicsPass && !qualityPass
                  ? t('assessment.overall.messages.ethicsPassQualityFail')
                  : !ethicsPass && qualityPass
                    ? t('assessment.overall.messages.ethicsFailQualityPass')
                    : t('assessment.overall.messages.bothFail')
            }} />
          </div>
          
          {renderEthicsPrinciplesSummary()}
          {renderQualityDimensionsSummary()}
          
          <div className="text-center mrgn-tp-lg">
            <div className="center-block" style={{maxWidth: '600px'}}>
              <Button 
                onClick={handleExport}
                size="sm"
                className="mrgn-rght-sm mrgn-bttm-sm"
                aria-label={t('assessment.overall.export.buttons.export')}
              >
                <span className="glyphicon glyphicon-export mrgn-rght-sm" aria-hidden="true"></span>
                {t('assessment.overall.export.buttons.export')}
              </Button>
              
              <Button 
                onClick={onReset}
                variant="secondary"
                size="sm"
                className="mrgn-rght-sm mrgn-bttm-sm"
                aria-label={t('assessment.overall.actions.reset')}
              >
                <span className="glyphicon glyphicon-repeat mrgn-rght-sm" aria-hidden="true"></span>
                {t('assessment.overall.actions.reset')}
              </Button>
              
              {onReturnHome && (
                <Button 
                  onClick={onReturnHome}
                  variant="outline"
                  size="sm"
                  className="mrgn-bttm-sm"
                  aria-label={t('assessment.overall.actions.home')}
                >
                  <span className="glyphicon glyphicon-home mrgn-rght-sm" aria-hidden="true"></span>
                  {t('assessment.overall.actions.home')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* WET-BOEW Export Modal */}
      {exportDialogOpen && (
        <>
          <div 
            className="modal-backdrop in"
            onClick={() => setExportDialogOpen(false)}
            style={{ 
              zIndex: 1040,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          />
          
          <div
            className="modal in"
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1050,
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'auto',
              backgroundColor: 'transparent'
            }}
            tabIndex={-1}
            role="dialog"
            aria-labelledby="export-modal-title"
            aria-hidden="false"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setExportDialogOpen(false);
              }
            }}
          >
            <div className="modal-dialog modal-lg" role="document" style={{ margin: '20px' }}>
              <div 
                className="modal-content"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxShadow: '0 3px 9px rgba(0, 0, 0, 0.5)'
                }}
              >
                {/* Modal Header */}
                <div className="modal-header">
                  <button
                    type="button"
                    className="close"
                    onClick={() => setExportDialogOpen(false)}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 className="modal-title" id="export-modal-title">
                    <span className="glyphicon glyphicon-export text-primary mrgn-rght-sm" aria-hidden="true"></span>
                    {t('assessment.overall.export.title')}
                  </h4>
                </div>
                
                {/* Modal Body */}
                <div className="modal-body">
                  <div className="form-group">
                    <label className="control-label" htmlFor="export-format-select">
                      {t('assessment.overall.export.formatLabel')}
                    </label>
                    <select 
                      id="export-format-select"
                      value={exportFormat} 
                      onChange={(e) => setExportFormat(e.target.value as 'text' | 'csv' | 'pdf' | 'word')}
                      className="form-control"
                    >
                      <option value="text">{t('assessment.overall.export.formats.text')}</option>
                      <option value="csv">{t('assessment.overall.export.formats.csv')}</option>
                      <option value="pdf">{t('assessment.overall.export.formats.pdf')}</option>
                      <option value="word">{t('assessment.overall.export.formats.word')}</option>
                    </select>
                  </div>
                  
                  {(exportFormat === 'text' || exportFormat === 'csv') && (
                    <div className="form-group">
                      <label className="control-label" htmlFor="export-preview">
                        {t('assessment.overall.export.preview', 'Preview')}
                      </label>
                      <textarea 
                        id="export-preview"
                        value={exportContent}
                        readOnly
                        className="form-control"
                        rows={15}
                        style={{ 
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                  )}
                  
                  {(exportFormat === 'pdf' || exportFormat === 'word') && (
                    <div className="wb-inv-message wb-inv-message-info">
                      <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                      <div className="wb-inv-message-content">
                        {exportFormat === 'pdf' 
                          ? t('assessment.overall.export.pdfPreview', 'PDF will be generated when you click Download.')
                          : t('assessment.overall.export.wordPreview', 'Word document will be generated when you click Download.')
                        }
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Modal Footer */}
                <div className="modal-footer">
                  <Button 
                    onClick={handleCopyToClipboard}
                    variant="secondary"
                    size="lg"
                    disabled={exportFormat === 'pdf' || exportFormat === 'word'}
                  >
                    <span className="glyphicon glyphicon-copy mrgn-rght-sm" aria-hidden="true"></span>
                    {t('assessment.overall.export.buttons.copy')}
                  </Button>
                  <Button 
                    onClick={handleDownload}
                    variant="primary"
                    size="lg"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <span className="glyphicon glyphicon-refresh glyphicon-spin mrgn-rght-sm" aria-hidden="true"></span>
                        {t('assessment.overall.export.generating', 'Generating...')}
                      </>
                    ) : (
                      <>
                        <span className="glyphicon glyphicon-download mrgn-rght-sm" aria-hidden="true"></span>
                        {t('assessment.overall.export.buttons.download')}
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => setExportDialogOpen(false)}
                    variant="secondary"
                    size="lg"
                  >
                    <span className="glyphicon glyphicon-remove mrgn-rght-sm" aria-hidden="true"></span>
                    {t('assessment.overall.export.buttons.close')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default OverallAssessment;