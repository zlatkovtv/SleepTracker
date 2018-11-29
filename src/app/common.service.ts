import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SleepData } from './sleep-data';

@Injectable({
	providedIn: 'root'
})
export class CommonService {

	constructor(private http: HttpClient) { }

	getSleepData(subjectNames: String, subjectBirthdate: Date): Observable<SleepData[]> {
		subjectNames = subjectNames.replace(" ", "%20");

		return this.http.get<SleepData[]>(`api/sleepData/${subjectNames}/${this.formatDate(subjectBirthdate)}`);
	}

	formatDate(d) {
		var month = '' + (d.getMonth() + 1);
		var day = '' + d.getDate();
		var year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [year, month, day].join('-');
	}
}
