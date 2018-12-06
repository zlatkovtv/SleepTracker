import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service'
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { User } from '../user';
import { Router } from '@angular/router';

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

	user: User;

	constructor(private commonService: CommonService, private router: Router) {
		//TODO get cached object
		this.user = new User("Chris", "Pratt", new Date());
	}

	getSleepData() {
		if (!this.user.FirstName || !this.user.LastName || this.user.BirthDate === null) {
			alert("Empty inputs");
			return;
		}

		this.commonService.getSleepData(this.user)
			.subscribe(
				(data) => this.onSuccess(data),
				(error) => this.handleError(error)
			);
	}

	onSuccess(user: User) {
		if (user === null) {
			alert("No data for this name and birth date.");
		}

		this.commonService.setUser(User.createNewUser(user));
		this.router.navigate(["/result"]);
	}

	handleError(error: any) {
		alert('No data found for this subject.')
	}
}
