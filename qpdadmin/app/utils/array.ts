export const isTruthElement = (...params: unknown[]) => {
	if (!Array.isArray(params)) return;

	return params.every(el => !!el);
};
