import type { AppChartProps } from './types';
import type { ECharts } from 'echarts/core';

import { RCharts } from '@laser-pro/rcharts';
import { useStorage } from '@laser-pro/storage';
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts';
import {
  DataZoomComponent,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';
import { merge } from 'lodash';
import { forwardRef, useCallback } from 'react';

import chartThemes from './themes.json';
import { STORAGE } from '../../configs/storage';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  DataZoomComponent,
  LegendComponent,
  ToolboxComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  SVGRenderer,
]);

export const AppChart = forwardRef<ECharts, AppChartProps>((props, ref): JSX.Element | null => {
  const {
    theme: _theme,

    ...restProps
  } = props;

  const themeStorage = useStorage(...STORAGE.theme);
  const languageStorage = useStorage(...STORAGE.language);

  const theme = _theme ?? themeStorage.value;

  const chartInit = useCallback(
    (el: HTMLDivElement) =>
      echarts.init(
        el,
        JSON.parse(
          JSON.stringify(theme === 'light' ? chartThemes.light : merge(JSON.parse(JSON.stringify(chartThemes.light)), chartThemes.dark)),
        ),
        { renderer: 'svg', locale: languageStorage.value === 'zh-CN' ? 'ZH' : 'EN' },
      ),
    [languageStorage.value, theme],
  );

  return <RCharts {...restProps} ref={ref} init={chartInit} autoResize autoResizeDebounce={100} />;
});
