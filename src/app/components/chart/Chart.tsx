import type { AppChartProps } from './types';
import type { ECharts } from 'echarts/core';

import { useStorage } from '@laser-pro/storage';
import { useAsync, useResize } from '@laser-ui/hooks';
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
import { forwardRef, useCallback, useRef } from 'react';

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
    autoResize = true,
    autoResizeDebounce = 100,

    ...restProps
  } = props;

  const async = useAsync();

  const elRef = useRef<HTMLDivElement>(null);

  const dataRef = useRef<{
    clearTid?: () => void;
    option?: any;
  }>({});

  const themeStorage = useStorage(...STORAGE.theme);
  const languageStorage = useStorage(...STORAGE.language);

  const theme = _theme ?? themeStorage.value;

  const instanceRef = useRef<ECharts | null>(null);
  const chartRef = useCallback(
    (el: HTMLDivElement | null) => {
      const setRef = (instance: ECharts | null) => {
        if (typeof ref === 'function') {
          ref(instance);
        } else if (ref) {
          ref.current = instance;
        }
      };
      if (el) {
        instanceRef.current = echarts.init(
          el,
          JSON.parse(
            JSON.stringify(theme === 'light' ? chartThemes.light : merge(JSON.parse(JSON.stringify(chartThemes.light)), chartThemes.dark)),
          ),
          { renderer: 'svg', locale: languageStorage.value === 'zh-CN' ? 'ZH' : 'EN' },
        );
        setRef(instanceRef.current);
        if (dataRef.current.option) {
          instanceRef.current.setOption(dataRef.current.option);
        }
      } else if (instanceRef.current) {
        dataRef.current.option = instanceRef.current.getOption();
        instanceRef.current.dispose();
        instanceRef.current = null;
        setRef(null);
      }
    },
    [languageStorage.value, ref, theme],
  );

  useResize(
    elRef,
    () => {
      dataRef.current.clearTid?.();
      const cb = () => {
        if (instanceRef.current) {
          instanceRef.current.resize();
        }
      };
      if (autoResizeDebounce === 0) {
        cb();
      } else {
        dataRef.current.clearTid = async.setTimeout(() => {
          dataRef.current.clearTid = undefined;
          cb();
        }, autoResizeDebounce);
      }
    },
    undefined,
    autoResize === false,
  );

  return (
    <div
      {...restProps}
      ref={elRef}
      style={{
        ...restProps.style,
        position: restProps.style?.position ?? 'relative',
      }}
    >
      <div ref={chartRef} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}></div>
    </div>
  );
});
