import { useTranslation } from 'react-i18next';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '../ui/Table';
import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const License = ({ currentYear }: { currentYear: number }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle id="license-title">
          {t('license.title')}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p>
          {t('license.intro')}
        </p>
        
        <div>
          <Table aria-labelledby="license-title">
            <caption className="sr-only">{t('license.title')}</caption>
            <TableHeader>
              <TableRow>
                <TableHead 
                  scope="col"
                >
                  {t('license.table.headers.section')}
                </TableHead>
                <TableHead 
                  scope="col"
                >
                  {t('license.table.headers.details')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  {t('license.table.termsSection')}
                </TableCell>
                <TableCell>
                  <div>
                    <p>{t('license.table.termsDetails.part1')}</p>
                    <p dangerouslySetInnerHTML={{__html: t('license.table.termsDetails.part2')}}/>
                    <p>{t('license.table.termsDetails.part3')}</p>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {t('license.table.privacySection')}
                </TableCell>
                <TableCell>
                  <p>{t('license.table.privacyDetails')}</p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {t('license.table.licenseSection')}
                </TableCell>
                <TableCell className="p-4">
                  <div>
                    {/* Use updated translation key with double curly braces */}
                    <p className="font-medium">
                      {t('license.table.licenseDetails.copyright', { year: currentYear })}
                    </p>
                    <p>{t('license.table.licenseDetails.part1')}</p>
                    <p>{t('license.table.licenseDetails.part2')}</p>
                    <p>{t('license.table.licenseDetails.part3')}</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default License;