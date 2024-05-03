import { Typography } from '@mui/material';
import React, { Fragment, memo } from 'react';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { AxisDomain } from 'recharts/types/util/types';

import styles from './styles.module.scss';

interface Props {
  data: { x: number; y: number }[];
  xAxisDomain: AxisDomain;
  xAxisTickCount: number;
  yAxisDomain: AxisDomain;
  yAxisTickCount: number;
  lines: {
    x: number;
    y: number;
    type: 'success' | 'danger' | 'error';
  }[];
  leftTopLabel?: string;
  leftBottomLabel?: string;
  rightTopLabel?: string;
  rightBottomLabel?: string;
}

const Component: React.FC<Props> = ({
  data,
  xAxisDomain,
  xAxisTickCount,
  yAxisDomain,
  yAxisTickCount,
  lines,
  leftTopLabel,
  leftBottomLabel,
  rightTopLabel,
  rightBottomLabel,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.container__labels}>
        <div>
          <Typography
            color="var(--text-3-color-50)"
            fontSize="8px"
            fontWeight="300"
            mb="4px"
            ml="45px"
          >
            {leftTopLabel}
          </Typography>
          <Typography color="var(--text-3-color-50)" fontSize="8px" fontWeight="300" ml="45px">
            {leftBottomLabel}
          </Typography>
        </div>
        <div>
          <Typography
            align="right"
            color="var(--text-3-color-50)"
            fontSize="8px"
            fontWeight="300"
            mb="4px"
          >
            {rightTopLabel}
          </Typography>
          <Typography align="right" color="var(--text-3-color-50)" fontSize="8px" fontWeight="300">
            {rightBottomLabel}
          </Typography>
        </div>
      </div>
      <ResponsiveContainer height={183} width="100%">
        <RechartsBarChart barCategoryGap="0" data={data}>
          <CartesianGrid stroke="var(--gray-1-color)" strokeWidth="1px" vertical={false} />
          <XAxis
            allowDataOverflow
            axisLine={{ stroke: 'var(--gray-10-color)', strokeWidth: '6px' }}
            dataKey="x"
            domain={xAxisDomain}
            tick={{
              fontSize: '10px',
              fontWeight: '300',
              fill: 'var(--gray-2-color)',
            }}
            tickCount={xAxisTickCount}
            tickMargin={14}
            tickSize={0}
            type="number"
          />
          <YAxis
            allowDataOverflow
            axisLine={{ stroke: 'var(--gray-1-color)', strokeWidth: '1px' }}
            dataKey="y"
            domain={yAxisDomain}
            tick={{ fontSize: '10px', fontWeight: '300', fill: 'var(--gray-2-color)' }}
            tickCount={yAxisTickCount}
            tickMargin={14}
            tickSize={0}
            type="number"
            width={40}
          />
          <Bar dataKey="y" fill="var(--main-1-color)" />
          {lines.map((line, index) => (
            <Fragment key={index}>
              <ReferenceDot
                fill={
                  line.type === 'success'
                    ? 'var(--success-color)'
                    : line.type === 'danger'
                      ? 'var(--danger-color)'
                      : 'var(--error-color)'
                }
                r={3.5}
                strokeWidth="0"
                x={line.x}
                y={0}
              />
              <ReferenceDot
                fill={
                  line.type === 'success'
                    ? 'var(--success-color)'
                    : line.type === 'danger'
                      ? 'var(--danger-color)'
                      : 'var(--error-color)'
                }
                r={3.5}
                strokeWidth="0"
                x={line.x}
                y={line.y}
              />
              <ReferenceLine
                segment={[
                  { x: line.x, y: 0 },
                  { x: line.x, y: line.y },
                ]}
                stroke={
                  line.type === 'success'
                    ? 'var(--success-color)'
                    : line.type === 'danger'
                      ? 'var(--danger-color)'
                      : 'var(--error-color)'
                }
                strokeDasharray="2 2"
              />
            </Fragment>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChart = memo(Component);
