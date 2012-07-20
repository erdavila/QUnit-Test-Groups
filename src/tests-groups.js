var testA1 = { url : "test-A1.js", name : "A1" };
var testA2 = { url : "test-A2.js", name : "A2" };
var testB1 = { url : "test-B1.js", name : "B1" };
var testB2 = { url : "test-B2.js", name : "B2" };

var testsA = new TestGroup("Tests A", [
	testA1,
	testA2,
]);

var testsB = new TestGroup("Tests B", [
	testB1,
	testB2,
]);

var tests2 = new TestGroup("Tests 2", [
	testA2,
	testB2,
]);

var allTests = new TestGroup("All Tests", [
	testsA,
	testsB,
	testA1,
	tests2,
]);
