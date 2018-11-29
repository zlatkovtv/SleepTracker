import { AbstractChart } from './abstract.chart';
import { Chart } from 'chart.js';

export class PieChart implements AbstractChart {
    buildChart(target: string, data: object, text: string) {
        var element = document.getElementById(target);
        new Chart(element, {
            type: 'pie',
            data: data,
            options: {
                title: {
                    display: true,
                    text: text
                }
            }
        });
    }
}