let count = 0; // Global counter.

export const getCount = (): number => {
	return count;
};

export const incrementCount = (): number => {
	count++;
	return count;
};
