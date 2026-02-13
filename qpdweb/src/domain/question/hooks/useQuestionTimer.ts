import { useEffect, useState } from 'react';

export const useQuestionTimer = (timeAt: string) => {
	const [timeLeft, setTimeLeft] = useState<number>(0);

	useEffect(() => {
		const calculateTimeLeft = () => {
			const now = new Date();
			if (!timeAt) return 0;

			let deadline: Date;

			// ISO 문자열 형식인지 확인 (예: "2026-02-13T12:00:00.000Z")
			if (timeAt.includes('T') || timeAt.includes('Z')) {
				// ISO 문자열 형식이면 그대로 사용
				deadline = new Date(timeAt);
			} else {
				// "HH:MM:SS" 형식이면 오늘 날짜에 시간 설정
				const [hours, minutes, seconds] = timeAt.split(':').map(Number);
				const startTime = new Date(now);
				startTime.setHours(hours, minutes, seconds || 0, 0);

				// 만약 시작 시간이 현재보다 미래라면, 어제 날짜로 설정
				if (startTime.getTime() > now.getTime()) {
					startTime.setDate(startTime.getDate() - 1);
				}

				deadline = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);
			}

			const remainingMs = deadline.getTime() - now.getTime();
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
