import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

export function useQueryParser<T extends Record<string, any>>() {
	const [searchParams, setSearchParams] = useSearchParams();

	const params = useMemo(() => {
		const result = {} as Partial<T>;

		Array.from(searchParams.keys()).forEach(key => {
			const value = searchParams.get(key);
			if (value === null) return;

			if (value === 'true' || value === 'false') {
				result[key as keyof T] = (value === 'true') as any;
			} else if (!isNaN(Number(value)) && value !== '') {
				result[key as keyof T] = Number(value) as any;
			} else {
				result[key as keyof T] = value as any;
			}
		});

		return result;
	}, [searchParams]);

	const setParams = (newParams: Partial<T>) => {
		const newSearchParams = new URLSearchParams(searchParams);

		Object.entries(newParams).forEach(([key, value]) => {
			if (value === undefined || value === null) {
				newSearchParams.delete(key);
			} else {
				newSearchParams.set(key, String(value));
			}
		});

		setSearchParams(newSearchParams, { replace: false });
	};

	return [params, setParams] as const;
}
