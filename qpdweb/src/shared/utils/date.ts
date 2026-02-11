/* eslint-disable no-unused-vars */
import { match } from 'ts-pattern';

export class UTDate {
	constructor(private _date: Date) {}

	getDayOfWeek(): number {
		return this._date.getDay();
	}

	getDayOfWeekString(): string {
		const days = ['일', '월', '화', '수', '목', '금', '토'];
		return days[this.getDayOfWeek()];
	}

	getHoursByDay(): number {
		return match(this.getDayOfWeek())
			.with(5, () => 72)
			.with(6, () => 48)
			.otherwise(() => 24);
	}
}
