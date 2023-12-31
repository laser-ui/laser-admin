import { Card } from '@laser-ui/components';
import { useTranslation } from 'react-i18next';

import { barOptions, lineOptions, nightingaleOptions, pieOptions, scatterOptions, stackedBarOptions, stackedLineOptions } from './options';
import { AppChart, AppRouteHeader } from '../../../components';

import styles from './ECharts.module.scss';

export default function ECharts() {
  const { t } = useTranslation();

  return (
    <>
      <AppRouteHeader>
        <AppRouteHeader.Breadcrumb
          list={[
            { id: '/dashboard', title: t('Dashboard', { ns: 'title' }) },
            { id: '/dashboard/echarts', title: t('ECharts', { ns: 'title' }) },
          ]}
        />
        <AppRouteHeader.Header />
      </AppRouteHeader>
      <div className={styles['app-echarts']}>
        <div className="row g-2">
          {[lineOptions, stackedLineOptions, barOptions, stackedBarOptions, pieOptions, nightingaleOptions, scatterOptions].map(
            (option, index) => (
              <div key={index} className="col-12 col-xxl-6">
                <Card>
                  <Card.Content>
                    <AppChart
                      ref={(chart) => {
                        if (chart) {
                          chart.setOption(option);
                        }
                      }}
                      style={{ height: 320 }}
                    />
                  </Card.Content>
                </Card>
              </div>
            ),
          )}
        </div>
      </div>
    </>
  );
}
