var testsComponentXIntegration = {
	name: "Component X - integration tests",
	file: "test-X-integration.js",
};

var testsComponentYIntegration = {
	name: "Component Y - integration tests",
	file: "test-Y-integration.js",
};

var testsUtils = {
	name: "Utils",
	file: "test-utils.js",
};

var testsIntegration = { 
	name:"Integration Tests", tests: [
		testsComponentXIntegration,
		testsComponentYIntegration,
	]
};

var allTests = {
	name: "All Tests", tests: [
		{ name: "Component X", tests:[
			{ name: "Component X - function a()", file: "test-X-a.js"},
			{ name: "Component X - function b()", file: "test-X-b.js"},
			{ name: "Component X - function c()", file: "test-X-c.js"},
			{ name: "Component X - function d()", file: "test-X-d.js"},
			testsComponentXIntegration,
			testsUtils,
		]},
		{ name: "Component Y", tests: [
			{ name: "Component Y - function i()", file: "test-Y-i.js"},
			{ name: "Component Y - function j()", file: "test-Y-j.js"},
			{ name: "Component Y - function k()", file: "test-Y-k.js"},
			testsComponentYIntegration,
		]},
		testsIntegration,
		testsUtils,
	]
};

TestGroups.root(allTests);
