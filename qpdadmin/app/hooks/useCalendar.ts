import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	startOfMonth,
	startOfWeek,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

export function useCalendar() {
	const [searchParams, setSearchParams] = useSearchParams();

	const [currentSelectedDate, setCurrentSelectedDate] = useState(() => {
		const dateAt = searchParams.get('dateAt');
		return dateAt ? new Date(dateAt) : new Date();
	});

	useEffect(() => {
		const dateAt = searchParams.get('dateAt');

		if (dateAt) {
			setCurrentSelectedDate(new Date(dateAt));
		}
	}, [searchParams]);

	const displayedDate = currentSelectedDate || new Date();
	const currentMonth = format(new Date(), 'yyyy년 MM월', { locale: ko });
	const displayedMonth = format(displayedDate, 'yyyy년 MM월', { locale: ko });
	const isCurrentMonth = currentMonth === displayedMonth;

	const startOfCurrentMonth = startOfMonth(currentSelectedDate);
	const endOfCurrentMonth = endOfMonth(currentSelectedDate);

	const startOfGrid = startOfWeek(startOfCurrentMonth, { locale: ko });
	const endOfGrid = endOfWeek(endOfCurrentMonth, { locale: ko });
	const gridDays = eachDayOfInterval({ start: startOfGrid, end: endOfGrid });

	function onClickDay(date: Date): void;
	function onClickDay(date: Date, type: 'override'): void;
	function onClickDay(date: Date, type?: 'override'): void {
		setCurrentSelectedDate(date);
		if (type === 'override') return;
		searchParams.set('dateAt', format(date, 'yyyy-MM-dd'));
		setSearchParams(searchParams);
	}

	function onClickMonth(params: number): void;
	function onClickMonth(params: number, overrideDate: Date): void;
	function onClickMonth(params: number, overrideDate?: Date): void {
		const baseDate = overrideDate || currentSelectedDate;
		const newDate = new Date(baseDate);

		newDate.setMonth(newDate.getMonth() + params);
		setCurrentSelectedDate(newDate);

		if (!!overrideDate) return;
		searchParams.set('dateAt', format(newDate, 'yyyy-MM-dd'));
		setSearchParams(searchParams);
	}

	function onClickToday() {
		setCurrentSelectedDate(new Date());
		searchParams.set('dateAt', format(new Date(), 'yyyy-MM-dd'));
		setSearchParams(searchParams);
	}

	const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

	return {
		onClickDay,
		onClickMonth,
		onClickToday,
		isCurrentMonth,
		weekDays,
		gridDays,
		startOfCurrentMonth,
		endOfCurrentMonth,
		currentSelectedDate,
	};
}
