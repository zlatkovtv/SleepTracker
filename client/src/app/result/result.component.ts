import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../common.service';
import { User } from '../user';
import { SleepData } from '../sleep-data';
import * as jsPDF from 'jspdf';
import * as $ from 'jquery'
import { AbstractChart } from '../common/chart-builder/abstract.chart';
import { BarChart } from '../common/chart-builder/bar.chart';
import { PieChart } from '../common/chart-builder/pie.chart';

@Component({
	selector: 'app-result',
	templateUrl: './result.component.html',
	styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
	user: User;
	chartBuilder: AbstractChart;

	constructor(private route: ActivatedRoute, private router: Router, private commonService: CommonService) { }

	ngOnInit() {
		//const id = this.route.snapshot.paramMap.get('id');
		this.user = this.commonService.getUser();
		if(this.user == null) {
			this.router.navigate(["/home"]);
			return;
		}
		
		this.buildSleepData(this.user.SleepData);
	}

	buildSleepData(sleepData: SleepData[]) {
		var minutesAsleep = 0;
		var minutesAwake = 0;
		var minutesRem = 0;
		var minutesLight = 0;
		var minutesDeep = 0;

		sleepData.forEach(element => {
			minutesAsleep += element.MinutesAsleep;
			minutesAwake += element.MinutesAwake;
			minutesRem += element.MinutesRemSleep;
			minutesLight += element.MinutesLightSleep;
			minutesDeep += element.MinutesDeepSleep;
		});

		var data1 = {
			labels: ["Minutes asleep", "Minutes awake"],
			datasets: [{
				label: "Minutes",
				backgroundColor: ["#3e95cd", "#8e5ea2"],
				data: [minutesAsleep, minutesAwake]
			}]
		};

		var data2 = {
			labels: sleepData.map(a => new Date(a.StartTime).getDate().toString()),
			datasets: [
				{
					backgroundColor: sleepData.map(a => "#3e95cd"),
					label: "Awakenings",
					data: sleepData.map(a => a.NumberOfAwakenings)
				}
			]
		};

		var data3 = {
			labels: ["Minutes REM sleep", "Minutes light sleep", "Minutes deep sleep"],
			datasets: [{
				label: "Minutes",
				backgroundColor: ["#3e95cd", "#8e5ea2", "#5e4ea2"],
				data: [minutesRem, minutesLight, minutesDeep]
			}],
			scales: {
				yAxes: [{
						 display: true,
						 stacked: true,
						 ticks: {
							 min: 0, // minimum value
						 }
				}]
			 }
		};

		this.buildChart('chart1', 'pie', data1, 'Total minutes asleep/minutes awake');
		this.buildChart('chart2', 'bar', data2, 'Number of awakenings per day');
		this.buildChart('chart3', 'pie', data3, 'Total minutes of each type of sleep');
	}

	buildChart(target: string, type: string, data: object, text: string) {
		switch (type) {
			case 'bar':
				this.chartBuilder = new BarChart();
				break;
			case 'pie':
				this.chartBuilder = new PieChart();
				break;
		}

		this.chartBuilder.buildChart(target, data, text);
	}

	searchAgain() {
		this.router.navigate(["/home"]);
	}

	saveAsPdf() {
		var elements = ["chart1", "chart2", "chart3"];
		var doc = new jsPDF('portrait');
		doc.setFontSize(20);
		doc.text(15, 15, this.user.FirstName + " " + this.user.LastName);
		doc.text(15, 30, this.user.BirthDate.toDateString());

		for(var i = 0; i < elements.length; i++) {
			var canvas = document.getElementById(elements[i]);
			var canvasImg = (canvas as any).toDataURL("image/jpeg", 1.0);
			doc.addImage(canvasImg, 'JPEG', 30, (90 * i + 40), 150, 75 );
		}

		doc.save('canvas.pdf');
	}

	sendEmail() {

	}

	showEmailModal() {
		$('#modal-center').modal('show');
	}
}
