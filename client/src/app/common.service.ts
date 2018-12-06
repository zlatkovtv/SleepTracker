import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SleepData } from './sleep-data';
import { User } from './user';

@Injectable({
	providedIn: 'root'
})
export class CommonService {
	//global user object
	private user: User;

	constructor(private http: HttpClient) { }

	public getUser() {
		return this.user;
	}

	public setUser(user: User) {
		this.user = user;
	}

	getSleepData(user: User): Observable<User> {
		let body = user;
		const httpOptions = {
			headers: new HttpHeaders({
			  'Content-Type':  'application/json'
			})
		  };
		  
		return this.http.post<User>(`api/sleepData/`, body, httpOptions);
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
