import { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

export const useAnswerDownload = () => {
	const cardRef = useRef<HTMLDivElement | null>(null);

	const download = useCallback(() => {
		// Double rAF to ensure DOM has rendered the new text
		requestAnimationFrame(() => {
			requestAnimationFrame(async () => {
				const el = cardRef.current;
				if (!el) return;

				const canvas = await html2canvas(el, {
					scale: 6,
					useCORS: true,
					allowTaint: false,
					backgroundColor: null,
					logging: false,
					imageTimeout: 15000,
				});

				canvas.toBlob(
					blob => {
						if (blob) {
							const fileName = `qpd-answer-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.png`;
							saveAs(blob, fileName);
						}
					},
					'image/png',
					1.0,
				);
			});
		});
	}, []);

	return { cardRef, download };
};
