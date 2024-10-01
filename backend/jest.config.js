/ @type {import('ts-jest').JestConfigWithTsJest} */;
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/tests/**/*.spec.ts"],
	globals: {
		"ts-jest": {
			tsconfig: "tsconfig.json",
		},
	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
};
