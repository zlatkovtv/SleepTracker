import { Chart } from 'chart.js';

export interface AbstractChart {
    buildChart(target: string, data: object, text: string);
}

export * from './pie.chart';
export * from './bar.chart';
