import { useEffect, useState } from 'react';

export const useQuestionTimer = (timeAt: string) => {
	const [timeLeft, setTimeLeft] = useState<number>(0);

	useEffect(() => {
		const calculateTimeLeft = () => {
			const now = new Date();
			if (!timeAt) return 0;
			const [hours, minutes, seconds] = timeAt.split(':').map(Number);

			// 오늘 날짜에 timeAt 시간 설정
			const startTime = new Date(now);
			startTime.setHours(hours, minutes, seconds || 0, 0);

			// 만약 시작 시간이 현재보다 미래라면, 어제 날짜로 설정
			if (startTime.getTime() > now.getTime()) {
				startTime.setDate(startTime.getDate() - 1);
			}

			const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);

			const remainingMs = endTime.getTime() - now.getTime();
			return Math.max(0, Math.floor(remainingMs / 1000));
		};

		setTimeLeft(calculateTimeLeft());

		const timer = setInterval(() => {
			const newTimeLeft = calculateTimeLeft();
			setTimeLeft(newTimeLeft);

			if (newTimeLeft === 0) {
				clearInterval(timer);
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [timeAt]);

	const padZero = (num: number) => num.toString().padStart(2, '0');

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);

		return {
			hours: padZero(hours),
			minutes: padZero(minutes),
			seconds: padZero(secs),
		};
	};

	return { timeLeft, formattedTime: formatTime(timeLeft) };
};
