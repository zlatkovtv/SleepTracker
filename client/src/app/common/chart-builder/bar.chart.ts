import { AbstractChart } from './abstract.chart';
import { Chart } from 'chart.js';

export class BarChart implements AbstractChart {
	buildChart(target: string, data: object, text: string) {
		var element = document.getElementById(target);
        new Chart(element, {
			type: 'bar',
			data: data,
			options: {
				legend: { display: false },
				title: {
					display: true,
					text: text
				},
				scales: {
					yAxes: [{
							 display: true,
							 stacked: true,
							 ticks: {
								 min: 0, // minimum value
							 }
					}]
				 }
			}
		});
	}
}