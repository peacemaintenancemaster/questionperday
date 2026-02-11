export const parseStyleString = (style: string) => {
	const styleObj: Record<string, string> = {};
	const rules = style.split(';').filter(Boolean);

	const kebabToCamelCase = (str: string) =>
		str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

	rules.forEach(rule => {
		const [property, value] = rule.split(':').map(s => s.trim());
		if (property && value) {
			const camelCaseProperty = kebabToCamelCase(property);
			styleObj[camelCaseProperty] = value;
		}
	});
	return styleObj;
};
