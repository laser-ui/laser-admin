import type { AppChartProps } from './types';
import type { ECharts } from 'echarts/core';

import { useStorage } from '@laser-pro/storage';
import { useAsync, useEventCallback, useIsomorphicLayoutEffect, useResize } from '@laser-ui/hooks';
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
import { useImperativeHandle, useRef } from 'react';

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

export function AppChart(props: AppChartProps): React.ReactElement | null {
  const {
    ref,
    theme: _theme,
    autoResize = true,
    autoResizeDebounce = 100,

    ...restProps
  } = props;

  const async = useAsync();

  const containerRef = useRef<HTMLDivElement>(null);
  const elRef = useRef<HTMLDivElement>(null);

  const optionSaved = useRef<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const clearTid = useRef(() => {});

  const themeStorage = useStorage(...STORAGE.theme);
  const languageStorage = useStorage(...STORAGE.language);

  const theme = _theme ?? themeStorage.value;

  const instanceRef = useRef<ECharts | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (elRef.current) {
      const chart = echarts.init(
        elRef.current,
        JSON.parse(
          JSON.stringify(theme === 'light' ? chartThemes.light : merge(JSON.parse(JSON.stringify(chartThemes.light)), chartThemes.dark)),
        ),
        { renderer: 'svg', locale: languageStorage.value === 'zh-CN' ? 'ZH' : 'EN' },
      );
      if (optionSaved.current) {
        chart.setOption(optionSaved.current);
      }
      instanceRef.current = chart;
      return () => {
        optionSaved.current = chart.getOption();
        chart.dispose();
        instanceRef.current = null;
      };
    }
  }, [languageStorage.value, theme]);

  useResize(
    containerRef,
    () => {
      clearTid.current();
      const cb = () => {
        if (instanceRef.current) {
          instanceRef.current.resize();
        }
      };
      if (autoResizeDebounce === 0) {
        cb();
      } else {
        clearTid.current = async.setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          clearTid.current = () => {};
          cb();
        }, autoResizeDebounce);
      }
    },
    undefined,
    autoResize === false,
  );

  const setOption = useEventCallback((base: any, update?: any) => {
    if (instanceRef.current) {
      if (instanceRef.current.getOption()) {
        instanceRef.current.setOption(update ?? base);
      } else {
        instanceRef.current.setOption({ ...base, ...update });
      }
    } else {
      optionSaved.current = { ...base, ...update };
    }
  });
  useImperativeHandle(ref, () => ({ setOption }), [setOption]);

  return (
    <div
      {...restProps}
      ref={(instance) => {
        containerRef.current = instance;
        return () => {
          containerRef.current = null;
        };
      }}
      style={{
        ...restProps.style,
        position: restProps.style?.position ?? 'relative',
      }}
    >
      <div
        ref={(instance) => {
          elRef.current = instance;
          return () => {
            elRef.current = null;
          };
        }}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />
    </div>
  );
}
