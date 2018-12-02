import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service'
import { AbstractChart, PieChart, BarChart } from './chart-builder/abstract.chart';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { SleepData } from '../sleep-data';
import * as jsPDF from 'jspdf';
import * as $ from 'jquery'

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	ngOnInit(): void {

	}

	options: DatepickerOptions = {
		minYear: 1910,
		maxYear: 2018,
		locale: enLocale,
		placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
	};

	subjectBirthdate: Date;
	subjectNames: String;

	chartBuilder: AbstractChart;

	hideSearchContainer: boolean = false;
	showResultContainer: boolean = false;

	constructor(private commonService: CommonService) {
		this.subjectBirthdate = new Date();
		this.subjectNames = "Chris Pratt";
	}

	searchAgain() {
		this.hideSearchContainer = false;
		this.showResultContainer = false;
	}

	saveAsPdf() {
		var elements = ["chart1", "chart2", "chart3"];
		var doc = new jsPDF('portrait');
		doc.setFontSize(20);
		doc.text(15, 15, this.subjectNames);
		doc.text(15, 30, this.subjectBirthdate.toDateString());

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

	getSleepData() {
		if (!this.subjectNames || this.subjectNames === "") {
			alert("Empty inputs");
			return;
		}

		this.commonService.getSleepData(this.subjectNames, this.subjectBirthdate)
			.subscribe(
				(data) => this.onSuccess(data),
				(error) => this.handleError(error)
			);
	}

	onSuccess(data: SleepData[]) {
		if (data.length === 0 || (Object.keys(data).length === 0 && data.constructor === Object)) {
			alert("No data for this name and birthdate.");
			return;
		}

		this.hideSearchContainer = true;
		this.showResultContainer = true;

		var minutesAsleep = 0;
		var minutesAwake = 0;
		var minutesRem = 0;
		var minutesLight = 0;
		var minutesDeep = 0;

		data.forEach(element => {
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
			labels: data.map(a => new Date(a.StartTime).getDate().toString()),
			datasets: [
				{
					backgroundColor: data.map(a => "#3e95cd"),
					label: "Awakenings",
					data: data.map(a => a.NumberOfAwakenings)
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

	handleError(error: any) {
		alert('No data found for this subject.')
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
}
