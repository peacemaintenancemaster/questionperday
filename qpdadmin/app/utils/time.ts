export const convertUTCto24Hour = (utcString: string) => {
	const date = new Date(utcString);
	// UTC 시간에 9시간을 더해서 KST로 변환
	const hours = (date.getUTCHours() + 9) % 24;
	const minutes = date.getUTCMinutes();

	return {
		hours,
		minutes,
	};
};
