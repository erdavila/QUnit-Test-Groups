var testsComponentXIntegration = {
	name: "Component X - integration tests",
	url: "test-X-integration.js",
};

var testsComponentYIntegration = {
	name: "Component Y - integration tests",
	url: "test-Y-integration.js",
};

var testsUtils = {
	name: "Utils",
	url: "test-utils.js",
};


var testsComponentX = new TestGroup("Component X", [
	{ name: "Component X - function a()", url: "test-X-a.js"},
	{ name: "Component X - function b()", url: "test-X-b.js"},
	{ name: "Component X - function c()", url: "test-X-c.js"},
	{ name: "Component X - function d()", url: "test-X-d.js"},
	testsComponentXIntegration,
	testsUtils,
]);


var testsComponentY = new TestGroup("Component Y", [
	{ name: "Component Y - function i()", url: "test-Y-i.js"},
	{ name: "Component Y - function j()", url: "test-Y-j.js"},
	{ name: "Component Y - function k()", url: "test-Y-k.js"},
	testsComponentYIntegration,
]);


var testsIntegration = new TestGroup("Integration Tests", [
	testsComponentXIntegration,
	testsComponentYIntegration,
]);


var allTests = new TestGroup("All Tests", [
	testsComponentX,
	testsComponentY,
	testsIntegration,
	testsUtils,
]);
