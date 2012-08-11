var LOAD_WAIT_TIMEOUT = 100;

module("ScriptLoader");

asyncTest("ScriptLoader.load()", 1, function() {
	var check = function() {
		strictEqual(window.ScriptLoader_load_test_LOADED, true);
		start();
		delete window.ScriptLoader_load_test_LOADED;
		ScriptLoader.reset();
	};
	setTimeout(check, LOAD_WAIT_TIMEOUT);
	
	var url = "ScriptLoader_load-test.js";
	ScriptLoader.load(url);
});

asyncTest("ScriptLoader.load(): order", 5, function() {
	var check = function() {
		equal(window.ScriptLoader_load_order_test, 4);
		start();
		delete window.ScriptLoader_load_order_test;
		ScriptLoader.reset();
	};
	setTimeout(check, 100);
	window.ScriptLoader_load_order_test = 0;
	
	ScriptLoader.load("ScriptLoader_load-order-0-test.js");
	ScriptLoader.load("ScriptLoader_load-order-1-test.js");
	ScriptLoader.load("ScriptLoader_load-order-2-test.js");
	ScriptLoader.load("ScriptLoader_load-order-3-test.js");
});

asyncTest("ScriptLoader.load(): missing file", 2, function() {
	var msg = "this test is known to fail in Firefox and IE with file:// URLs :-(";
	ok(true, msg);
	
	var check = function() {
		equal(window.ScriptLoader_load_missing_test, 2, msg);
		start();
		delete window.ScriptLoader_load_missing_test;
		ScriptLoader.reset();
	};
	setTimeout(check, 100);
	window.ScriptLoader_load_missing_test = 0;
	
	ScriptLoader.load("ScriptLoader_load-missing-first-test.js");
	ScriptLoader.load("MISSING.js");
	ScriptLoader.load("ScriptLoader_load-missing-last-test.js");
});

test("ScriptLoader.createScriptElement()", 2, function() {
	var url = "url";
	var result = ScriptLoader.createScriptElement(url);
	
	equal(result instanceof HTMLScriptElement, true);
	equal(result.getAttribute("src"), url);
});


module("TestGroups");

test("TestGroups.root(TestGroup)", 1, function() {
	var testGroup = new TestGroup("name", []);
	
	delete TestGroups._root;
	TestGroups.root(testGroup);
	
	deepEqual(TestGroups._root, testGroup);
});

test("TestGroups.root(not TestGroup)", 2, function() {
	var notTestGroup = null;
	
	delete TestGroups._root;
	
	var func = function() {
		TestGroups.root(notTestGroup);
	};
	
	throws(func, TypeError);
	
	equal(typeof TestGroups._root, "undefined");
});

test("TestGroups.root({...})", 12, function() {
	var testGroup = {
		name : "Root Group",
		tests : [
			{ name : "Test name", file : "test-file.js" },
			{ name : "Sub-group", tests : [
				{ name : "Other Test name", file : "test-file-other.js" },
			]},
		],
	};
	delete TestGroups._root;
	
	TestGroups.root(testGroup);
	
	ok(TestGroups._root instanceof TestGroup);
	equal(TestGroups._root.name, testGroup.name);
	equal(TestGroups._root.items.length, testGroup.tests.length);
	ok(TestGroups._root.items[0] instanceof TestFile);
	equal(TestGroups._root.items[0].name, testGroup.tests[0].name);
	equal(TestGroups._root.items[0].file, testGroup.tests[0].file);
	ok(TestGroups._root.items[1] instanceof TestGroup);
	equal(TestGroups._root.items[1].name, testGroup.tests[1].name);
	equal(TestGroups._root.items[1].items.length, testGroup.tests[1].tests.length);
	ok(TestGroups._root.items[1].items[0] instanceof TestFile);
	equal(TestGroups._root.items[1].items[0].name, testGroup.tests[1].tests[0].name);
	equal(TestGroups._root.items[1].items[0].file, testGroup.tests[1].tests[0].file);
});

test("TestGroups.isTestFile(TestFile)", 1, function() {
	var item = new TestFile("name", "file");
	var result = TestGroups.isTestFile(item);
	equal(result, true);
});

test("TestGroups.isTestFile(undefined)", 1, function() {
	var item = undefined;
	var result = TestGroups.isTestFile(item);
	equal(result, false);
});

test("TestGroups.isTestFile(null)", 1, function() {
	var item = null;
	var result = TestGroups.isTestFile(item);
	equal(result, false);
});

test("TestGroups.isTestFile(\"string\")", 1, function() {
	var item = "string";
	var result = TestGroups.isTestFile(item);
	equal(result, false);
});

test("TestGroups.isTestFile({})", 1, function() {
	var item = {};
	var result = TestGroups.isTestFile(item);
	equal(result, false);
});

test("TestGroups.isTestGroup(TestGroup)", 1, function() {
	var item = new TestGroup("name", []);
	var result = TestGroups.isTestGroup(item);
	equal(result, true);
});

test("TestGroups.isTestGroup(undefined)", 1, function() {
	var item = undefined;
	var result = TestGroups.isTestGroup(item);
	equal(result, false);
});

test("TestGroups.isTestGroup(null)", 1, function() {
	var item = null;
	var result = TestGroups.isTestGroup(item);
	equal(result, false);
});

test("TestGroups.isTestGroup(\"string\")", 1, function() {
	var item = "string";
	var result = TestGroups.isTestGroup(item);
	equal(result, false);
});

test("TestGroups.isTestGroup({})", 1, function() {
	var item = {};
	var result = TestGroups.isTestGroup(item);
	equal(result, false);
});

test("TestGroups.outline()", 2, function() {
	var baseUrl = "base-url";
	var outline = "outline";
	
	TestGroups._root = {
		outline : function(bUrl) {
			equal(bUrl, baseUrl);
			return outline;
		},
	};
	
	var result = TestGroups.outline(baseUrl);
	equal(result, outline);
});


module("TestGroups._loadAndRunTestByUrlArg", {
	setup : function() {
		this.recorded_extractGroupFilterArg = TestGroups._extractGroupFilterArg;
	},
	teardown : function() {
		TestGroups._extractGroupFilterArg = this.recorded_extractGroupFilterArg;
	},
	makeGroupFixture : function () {
		var fixture = {};
		fixture.testFile0 = new TestFile("name0", "file0");
		fixture.testFile1 = new TestFile("name1", "file1");
		fixture.testFile2 = { name: "name2", file: "file2" };
		fixture.subGroup = new TestGroup("sub-group", [
			fixture.testFile1,
		]);
		fixture.rootGroup = new TestGroup("group", [
			fixture.testFile0,
			fixture.subGroup,
			fixture.testFile2,
		]);
		
		for(var name in fixture) {
			var item = fixture[name];
			item.loadAndRun = function() {
				ok(false, "loadAndRun() should not be called on " + this.name);
			};
		}
		
		return fixture;
	},
});

test("TestGroups._loadAndRunTestByUrlArg(): URL arg is root group", 2, function() {
	var fixture = this.makeGroupFixture();
	
	TestGroups._extractGroupFilterArg = function() {
		ok(true);
		return fixture.rootGroup.name;
	};
	fixture.rootGroup.loadAndRun = function() {
		ok(true);
	};
	
	TestGroups._root = fixture.rootGroup;
	
	TestGroups._loadAndRunTestByUrlArg();
});

test("TestGroups._loadAndRunTestByUrlArg(): URL arg is sub-group", 2, function() {
	var fixture = this.makeGroupFixture();
	
	TestGroups._extractGroupFilterArg = function() {
		ok(true);
		return fixture.subGroup.name;
	};
	fixture.subGroup.loadAndRun = function() {
		ok(true);
	};
	
	TestGroups._root = fixture.rootGroup;
	
	TestGroups._loadAndRunTestByUrlArg();
});

test("TestGroups._loadAndRunTestByUrlArg(): URL arg is test", 2, function() {
	var fixture = this.makeGroupFixture();
	
	TestGroups._extractGroupFilterArg = function() {
		ok(true);
		return fixture.testFile1.name;
	};
	fixture.testFile1.loadAndRun = function() {
		ok(true);
	};
	
	TestGroups._root = fixture.rootGroup;
	
	TestGroups._loadAndRunTestByUrlArg();
});

test("TestGroups._loadAndRunTestByUrlArg(): URL arg is unknown test", 1, function() {
	var fixture = this.makeGroupFixture();
	
	TestGroups._extractGroupFilterArg = function() {
		ok(true);
		return "unknown";
	};
	
	TestGroups._root = fixture.rootGroup;
	
	TestGroups._loadAndRunTestByUrlArg();
});

test("TestGroups._loadAndRunTestByUrlArg(): no URL arg", 2, function() {
	var fixture = this.makeGroupFixture();
	
	TestGroups._extractGroupFilterArg = function() {
		ok(true);
		return undefined;
	};
	fixture.rootGroup.loadAndRun = function() {
		ok(true);
	};
	
	TestGroups._root = fixture.rootGroup;
	
	TestGroups._loadAndRunTestByUrlArg();
});


module("TestFile");

test("TestFile()", 2, function() {
	var name = "name";
	var file = "file";
	var testFile = new TestFile(name, file);
	equal(testFile.name, name);
	equal(testFile.file, file);
});

test("TestFile(): invalid name type", 1, function() {
	var name = 7;
	var file = "file";
	var func = function() {
		new TestFile(name, file);
	};
	throws(func, TypeError);
});

test("TestFile(): invalid file type", 1, function() {
	var name = "name";
	var file = 7;
	var func = function() {
		new TestFile(name, file);
	};
	throws(func, TypeError);
});

test("TestFile.asInstance(TestFile)", 2, function() {
	var testFile = new TestFile("name", "file");
	
	var result = TestFile.asInstance(testFile);
	
	ok(result instanceof TestFile);
	equal(result, testFile);
});

test("TestFile.asInstance({...})", 3, function() {
	var testFile = {
		name: "name",
		file: "file",
	};
	
	var result = TestFile.asInstance(testFile);
	
	ok(result instanceof TestFile);
	equal(result.name, testFile.name);
	equal(result.file, testFile.file);
});

test("TestFile.asInstance({...}): invalid name attribute", 1, function() {
	var testFile = {
		name: null,
		file: "file",
	};
	
	var func = function() {
		TestFile.asInstance(testFile);
	};
	throws(func, TypeError);
});

test("TestFile.asInstance({...}): invalid file attribute", 1, function() {
	var testFile = {
		name: "name",
		file: null,
	};
	
	var func = function() {
		TestFile.asInstance(testFile);
	};
	throws(func, TypeError);
});

test("TestFile.asInstance(null)", 1, function() {
	var testFile = null;
	
	var func = function() {
		TestFile.asInstance(testFile);
	};
	throws(func, TypeError);
});

asyncTest("TestFile.loadAndRun()", 1, function() {
	var check = function() {
		strictEqual(window.TestFile_loadAndRun_test_LOADED, true);
		delete window.TestFile_loadAndRun_test_LOADED;
		start();
	};
	setTimeout(check, LOAD_WAIT_TIMEOUT);
	
	var testFile = new TestFile("name", "TestFile_loadAndRun-test.js");
	testFile.loadAndRun();
});


module("TestFilesList");

test("TestFilesList()", 1, function() {
	var testFilesList = new TestFilesList();
	equal(testFilesList.length, 0);
});

test("TestFilesList.push(): new", 6, function() {
	var testFilesList = new TestFilesList();
	
	var testFile0 = new TestFile("name0", "file0");
	var result = testFilesList.push(testFile0);
	equal(result, true);
	equal(testFilesList.length, 1);
	deepEqual(testFilesList.get(0), testFile0);
	
	var testFile1 = new TestFile("name1", "file1");
	result = testFilesList.push(testFile1);
	equal(result, true);
	equal(testFilesList.length, 2);
	deepEqual(testFilesList.get(1), testFile1);
});

test("TestFilesList.push(): repeated file", 6, function() {
	var testFilesList = new TestFilesList();
	var sameFile = "same-file";
	
	var testFile0 = new TestFile("name0", sameFile);
	var result = testFilesList.push(testFile0);
	equal(result, true);
	equal(testFilesList.length, 1);
	deepEqual(testFilesList.get(0), testFile0);
	
	var testFile1 = new TestFile("name1", sameFile);
	result = testFilesList.push(testFile1);
	equal(result, false);
	equal(testFilesList.length, 1);
	deepEqual(testFilesList.get(0), testFile0);
});

test("TestFilesList.asArray()", 4, function() {
	var testFilesList = new TestFilesList();
	
	var testFile0 = new TestFile("name0", "file0");
	var testFile1 = new TestFile("name1", "file1");
	
	testFilesList.push(testFile0);
	testFilesList.push(testFile1);
	
	var array = testFilesList.asArray();
	ok($.isArray(array));
	equal(array.length, 2);
	deepEqual(array[0], testFile0);
	deepEqual(array[1], testFile1);
});


module("TestGroup");

test("TestGroup()", 17, function() {
	var name = "name";
	var items = [
		new TestFile("name1", "file1"),
		{ name: "sub-group", tests: [
			{ name: "name3", file: "file3" }
		]},
		new TestGroup("other", []),
		{ name: "name2", file: "file2" },
	];
	
	var testGroup = new TestGroup(name, items);
	
	equal(testGroup.name, name);
	equal(testGroup.items.length, items.length);
	
	ok(testGroup.items[0] instanceof TestFile);
	equal(testGroup.items[0].name, items[0].name);
	equal(testGroup.items[0].file, items[0].file);
	
	ok(testGroup.items[1] instanceof TestGroup);
	equal(testGroup.items[1].name, items[1].name);
	equal(testGroup.items[1].items.length, items[1].tests.length);
	ok(testGroup.items[1].items[0] instanceof TestFile);
	equal(testGroup.items[1].items[0].name, items[1].tests[0].name);
	equal(testGroup.items[1].items[0].file, items[1].tests[0].file);
	
	ok(testGroup.items[2] instanceof TestGroup);
	equal(testGroup.items[2].name, items[2].name);
	equal(testGroup.items[2].items, items[2].items);
	
	ok(testGroup.items[3] instanceof TestFile);
	equal(testGroup.items[3].name, items[3].name);
	equal(testGroup.items[3].file, items[3].file);
});

test("TestGroup(): invalid name type", 1, function() {
	var name = 7;
	var items = [];
	var func = function() {
		new TestGroup(name, items);
	};
	throws(func, TypeError);
});

test("TestGroup(): invalid items type", 1, function() {
	var name = "name";
	var items = "items";
	var func = function() {
		new TestGroup(name, items);
	};
	throws(func, TypeError);
});
	
test("TestGroup.asInstance(TestGroup)", 2, function() {
	var testGroup = new TestGroup("group-name", [
		{ name: "test-name", file: "test-file" },
	]);
	
	var result = TestGroup.asInstance(testGroup);
	
	ok(result instanceof TestGroup);
	equal(result, testGroup);
});

test("TestGroup.asInstance({...})", 12, function() {
	var testGroup = {
		name: "group-name",
		tests: [
			{ name: "test-name", file: "test-file" },
			{ name: "sub-group", tests: [
				{ name: "other-test-name", file: "other-test-file" },
			]}
		],
	};
	
	var result = TestGroup.asInstance(testGroup);
	
	ok(result instanceof TestGroup);
	equal(result.name, testGroup.name);
	equal(result.items.length, testGroup.tests.length);
	ok(result.items[0] instanceof TestFile);
	equal(result.items[0].name, testGroup.tests[0].name);
	equal(result.items[0].file, testGroup.tests[0].file);
	ok(result.items[1] instanceof TestGroup);
	equal(result.items[1].name, testGroup.tests[1].name);
	equal(result.items[1].items.length, testGroup.tests[1].tests.length);
	ok(result.items[1].items[0] instanceof TestFile);
	equal(result.items[1].items[0].name, testGroup.tests[1].tests[0].name);
	equal(result.items[1].items[0].file, testGroup.tests[1].tests[0].file);
});

test("TestGroup.asInstance({...}): invalid name attribute", 1, function() {
	var testGroup = {
		name: null,
		tests: [],
	};
	
	var func = function() {
		TestGroup.asInstance(testGroup);
	};
	throws(func, TypeError);
});

test("TestGroup.asInstance({...}): invalid tests attribute", 1, function() {
	var testGroup = {
		name: "name",
		tests: null,
	};
	
	var func = function() {
		TestGroup.asInstance(testGroup);
	};
	throws(func, TypeError);
});

test("TestGroup.asInstance(null)", 1, function() {
	var testGroup = null;
	
	var func = function() {
		TestGroup.asInstance(testGroup);
	};
	throws(func, TypeError);
});

test("TestGroup.getAllTestFiles()", 10, function() {
	var testFile0 = new TestFile("name0", "file0");
	var testFile1 = new TestFile("name1", "file1");
	var testFile2 = { name: "name2", file: "file2" };
	
	var testGroup = new TestGroup("group", [
		testFile0,
		new TestGroup("sub-group", [
			testFile1,
		]),
		testFile2,
	]);
	
	var testFiles = testGroup.getAllTestFiles();
	equal(testFiles.length, 3);
	
	ok(TestGroups.isTestFile(testFiles[0]));
	ok(TestGroups.isTestFile(testFiles[1]));
	ok(TestGroups.isTestFile(testFiles[2]));
	
	equal(testFiles[0].name, testFile0.name);
	equal(testFiles[1].name, testFile1.name);
	equal(testFiles[2].name, testFile2.name);
	
	equal(testFiles[0].file, testFile0.file);
	equal(testFiles[1].file, testFile1.file);
	equal(testFiles[2].file, testFile2.file);
});

asyncTest("TestGroup.loadAndRun()", 2, function() {
	var check = function() {
		strictEqual(window.TestGroup_loadAndRun_0_test_LOADED, true);
		strictEqual(window.TestGroup_loadAndRun_1_test_LOADED, true);
		delete window.TestGroup_loadAndRun_0_test_LOADED;
		delete window.TestGroup_loadAndRun_1_test_LOADED;
		start();
	};
	setTimeout(check, LOAD_WAIT_TIMEOUT);
	
	var testFile0 = new TestFile("name0", "TestGroup_loadAndRun-0-test.js");
	var testFile1 = new TestFile("name1", "TestGroup_loadAndRun-1-test.js");
	
	var testGroup = new TestGroup("group", [testFile0, testFile1]);
	testGroup.loadAndRun();
});

test("TestGroup.searchByName(): file near", 1, function() {
	var testFile0 = new TestFile("name0", "file0");
	var testFile1 = new TestFile("name1", "file1");
	var testFile2 = { name: "name2", file: "file2" };
	
	var testGroup = new TestGroup("group", [
		testFile0,
		new TestGroup("sub-group", [
			testFile1,
		]),
		testFile2,
	]);
	
	var test = testGroup.searchByName("name0");
	deepEqual(test, testFile0);
});

test("TestGroup.searchByName(): file farther", 1, function() {
	var testFile0 = new TestFile("name0", "file0");
	var testFile1 = new TestFile("name1", "file1");
	var testFile2 = { name: "name2", file: "file2" };
	
	var testGroup = new TestGroup("group", [
		testFile0,
		new TestGroup("sub-group", [
			testFile1,
		]),
		testFile2,
	]);
	
	var test = testGroup.searchByName(testFile1.name);
	deepEqual(test, testFile1);
});

test("TestGroup.searchByName(): group", 1, function() {
	var testFile0 = new TestFile("name0", "file0");
	var testFile1 = new TestFile("name1", "file1");
	var testFile2 = { name: "name2", file: "file2" };
	
	var subGroup = new TestGroup("sub-group", [
		testFile1,
	]);
	
	var testGroup = new TestGroup("group", [
		testFile0,
		subGroup,
		testFile2,
	]);
	
	var test = testGroup.searchByName("sub-group");
	deepEqual(test, subGroup);
});

test("TestGroup.searchByName(): not found", 1, function() {
	var testFile0 = new TestFile("name0", "file0");
	var testFile1 = new TestFile("name1", "file1");
	var testFile2 = { name: "name2", file: "file2" };
	
	var subGroup = new TestGroup("sub-group", [
		testFile1,
	]);
	
	var testGroup = new TestGroup("group", [
		testFile0,
		subGroup,
		testFile2,
	]);
	
	var test = testGroup.searchByName("not found");
	deepEqual(test, undefined);
});

test("TestGroup.searchByName(): not found (same root)", 1, function() {
	var testFile0 = new TestFile("name0", "file0");
	var testFile1 = new TestFile("name1", "file1");
	var testFile2 = { name: "name2", file: "file2" };
	
	var subGroup = new TestGroup("sub-group", [
		testFile1,
	]);
	
	var testGroup = new TestGroup("group", [
		testFile0,
		subGroup,
		testFile2,
	]);
	
	var test = testGroup.searchByName("group");
	deepEqual(test, undefined);
});


module("Outline");

test("TestGroup._makeOutlineLink", 3, function() {
	var name = "some name";
	var baseUrl = "base-url";
	var link = TestGroup._makeOutlineLink(name, baseUrl);
	
	equal(link[0].tagName, "A");
	equal(link.attr("href"), baseUrl + "?groupfilter=" + escape(name));
	equal(link.text(), name);
});

test("TestGroup.outline", 4, function() {
	var baseUrl = "base-url";
	var item = $("<z/>");
	var itemElement = item[0];
	var testGroup = new TestGroup("name", []);
	testGroup._outlineItem = function(bUrl) {
		equal(bUrl, baseUrl);
		return itemElement;
	};
	
	var outline = testGroup.outline(baseUrl);
	
	var outlineElement = outline[0];
	equal(outlineElement.tagName, "UL");
	equal(outlineElement.childNodes.length, 1);
	deepEqual(outlineElement.childNodes[0], itemElement);
});

test("TestGroup._outlineItem", 7, function() {
	var baseUrl = "base-url";
	var name = "name";
	var linkElement = $("<x/>")[0];
	var old_makeOutlineLink = TestGroup._makeOutlineLink;
	TestGroup._makeOutlineLink = function(nm, bUrl) {
		equal(nm, name);
		equal(bUrl, baseUrl);
		return linkElement;
	};
	var testGroup = new TestGroup(name, []);
	var itemsListElement = $("<y/>")[0];
	testGroup._outlineItemsList = function(bUrl) {
		equal(bUrl, baseUrl);
		return itemsListElement;
	};
	
	try {
		var outlineItem = testGroup._outlineItem(baseUrl);
	} finally {
		TestGroup._makeOutlineLink = old_makeOutlineLink;
	}
	
	var outlineItemElement = outlineItem[0];
	equal(outlineItemElement.tagName, "LI");
	equal(outlineItemElement.childNodes.length, 2);
	deepEqual(outlineItemElement.childNodes[0], linkElement);
	deepEqual(outlineItemElement.childNodes[1], itemsListElement);
});

test("TestFile._outlineItem", 5, function() {
	var baseUrl = "base-url";
	var name = "name";
	var linkElement = $("<x/>")[0];
	var old_makeOutlineLink = TestGroup._makeOutlineLink;
	TestGroup._makeOutlineLink = function(nm, bUrl) {
		equal(nm, name);
		equal(bUrl, baseUrl);
		return linkElement;
	};
	var testFile = new TestFile(name, "file");
	
	try {
		var outlineItem = testFile._outlineItem(baseUrl);
	} finally {
		TestGroup._makeOutlineLink = old_makeOutlineLink;
	}
	
	var outlineItemElement = outlineItem[0];
	equal(outlineItemElement.tagName, "LI");
	equal(outlineItemElement.childNodes.length, 1);
	deepEqual(outlineItemElement.childNodes[0], linkElement);
});

test("TestGroup._outlineItemsList", 6, function() {
	var baseUrl = "base-url";
	var testGroup = new TestGroup("name", []);
	
	var outlineItem0 = $("<x/>")[0];
	var outlineItem1 = $("<y/>")[0];
	testGroup.items = [
		{
			_outlineItem : function(bUrl) {
				equal(bUrl, baseUrl);
				return outlineItem0;
			},
		},
		{
			_outlineItem : function(bUrl) {
				equal(bUrl, baseUrl);
				return outlineItem1;
			},
		},
	];
	
	var list = testGroup._outlineItemsList(baseUrl);
	
	var listElement = list[0];
	equal(listElement.tagName, "UL");
	equal(listElement.childNodes.length, 2);
	deepEqual(listElement.childNodes[0], outlineItem0);
	deepEqual(listElement.childNodes[1], outlineItem1);
});
