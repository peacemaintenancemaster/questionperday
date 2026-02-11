import { type RefObject, useEffect, useRef } from 'react';

export const useOutsideClick = <T extends HTMLElement | null>(
	ref: RefObject<T>,
	callback: () => void,
): void => {
	useEffect(() => {
		const onClickOutside = (event: MouseEvent): void => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				callback();
			}
		};

		document.addEventListener('mousedown', onClickOutside);
		return (): void => {
			document.removeEventListener('mousedown', onClickOutside);
		};
	}, [ref, callback]);
};
