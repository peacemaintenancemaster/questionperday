import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	startOfMonth,
	startOfWeek,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';

interface HasDateAt {
	dateAt?: string;
}

export const useCalendar = <T extends HasDateAt>(search: T) => {
	const [currentSelectedDate, setCurrentSelectedDate] = useState(() =>
		typeof search.dateAt === 'string' ? new Date(search.dateAt) : new Date(),
	);

	const displayedDate = currentSelectedDate;
	const currentMonth = format(new Date(), 'yyyy년 MM월', { locale: ko });
	const displayedMonth = format(displayedDate, 'yyyy년 MM월', { locale: ko });
	const isCurrentMonth = currentMonth === displayedMonth;

	const startOfCurrentMonth = startOfMonth(currentSelectedDate);
	const endOfCurrentMonth = endOfMonth(currentSelectedDate);

	const startOfGrid = startOfWeek(startOfCurrentMonth, { locale: ko });
	const endOfGrid = endOfWeek(endOfCurrentMonth, { locale: ko });
	const gridDays = eachDayOfInterval({ start: startOfGrid, end: endOfGrid });

	const onClickDay = (date: Date) => {
		setCurrentSelectedDate(date);
	};

	const onClickMonth = (params: number) => {
		const newDate = new Date(currentSelectedDate);

		newDate.setMonth(newDate.getMonth() + params);
		setCurrentSelectedDate(newDate);
	};

	const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

	return {
		onClickDay,
		onClickMonth,
		isCurrentMonth,
		weekDays,
		gridDays,
		startOfCurrentMonth,
		endOfCurrentMonth,
		currentSelectedDate,
	};
};
