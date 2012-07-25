module("ScriptLoader");

test("ScriptLoader.createScriptElement()", 2, function() {
	var url = "file:///url";
	var result = ScriptLoader.createScriptElement(url);
	
	equal(result.constructor, HTMLScriptElement);
	equal(result.src, url);
});

asyncTest("ScriptLoader.load()", 1, function() {
	var check = function() {
		strictEqual(window.ScriptLoader_load_test_LOADED, true);
		start();
	};
	setTimeout(check, 100);
	
	var url = "ScriptLoader_load-test.js";
	ScriptLoader.load(url);
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

asyncTest("TestFile.loadAndRun()", 1, function() {
	var check = function() {
		strictEqual(window.TestFile_loadAndRun_test_LOADED, true);
		start();
	};
	setTimeout(check, 100);
	
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

test("TestGroup()", 11, function() {
	var name = "name";
	var items = [
		new TestFile("name1", "file1"),
		new TestGroup("other", []),
		{ name: "name2", file: "file2" },
	];
	
	var testGroup = new TestGroup(name, items);
	
	equal(testGroup.name, name);
	equal(testGroup.items.length, items.length);
	
	ok(TestGroup.isTestFile(testGroup.items[0]));
	ok(TestGroup.isTestGroup(testGroup.items[1]));
	ok(TestGroup.isTestFile(testGroup.items[2]));
	
	equal(testGroup.items[0].name, items[0].name);
	equal(testGroup.items[1].name, items[1].name);
	equal(testGroup.items[2].name, items[2].name);
	
	equal(testGroup.items[0].file, items[0].file);
	equal(testGroup.items[1].items.length, items[1].items.length);
	equal(testGroup.items[2].file, items[2].file);
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

test("TestGroup.isTestFile(TestFile)", 1, function() {
	var item = new TestFile("name", "file");
	var result = TestGroup.isTestFile(item);
	equal(result, true);
});

test("TestGroup.isTestFile(undefined)", 1, function() {
	var item = undefined;
	var result = TestGroup.isTestFile(item);
	equal(result, false);
});

test("TestGroup.isTestFile(null)", 1, function() {
	var item = null;
	var result = TestGroup.isTestFile(item);
	equal(result, false);
});

test("TestGroup.isTestFile(\"string\")", 1, function() {
	var item = "string";
	var result = TestGroup.isTestFile(item);
	equal(result, false);
});

test("TestGroup.isTestFile({})", 1, function() {
	var item = {};
	var result = TestGroup.isTestFile(item);
	equal(result, false);
});

test("TestGroup.isTestGroup(TestGroup)", 1, function() {
	var item = new TestGroup("name", []);
	var result = TestGroup.isTestGroup(item);
	equal(result, true);
});

test("TestGroup.isTestGroup(undefined)", 1, function() {
	var item = undefined;
	var result = TestGroup.isTestGroup(item);
	equal(result, false);
});

test("TestGroup.isTestGroup(null)", 1, function() {
	var item = null;
	var result = TestGroup.isTestGroup(item);
	equal(result, false);
});

test("TestGroup.isTestGroup(\"string\")", 1, function() {
	var item = "string";
	var result = TestGroup.isTestGroup(item);
	equal(result, false);
});

test("TestGroup.isTestGroup({})", 1, function() {
	var item = {};
	var result = TestGroup.isTestGroup(item);
	equal(result, false);
});
	
test("TestGroup.rootTestGroup()", 1, function() {
	deepEqual(TestGroup.rootTestGroup, TestGroup._loadAndRunTestByUrlArg);
});

test("TestGroup.getAllTestFiles()", 10, function() {
	var testFile0 = new TestFile("file0", "file0");
	var testFile1 = new TestFile("file1", "file1");
	var testFile2 = { name: "file2", file: "file2" };
	
	var testGroup = new TestGroup("group", [
		testFile0,
		new TestGroup("sub-group", [
			testFile1,
		]),
		testFile2,
	]);
	
	var testFiles = testGroup.getAllTestFiles();
	equal(testFiles.length, 3);
	
	ok(TestGroup.isTestFile(testFiles[0]));
	ok(TestGroup.isTestFile(testFiles[1]));
	ok(TestGroup.isTestFile(testFiles[2]));
	
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
		start();
	};
	setTimeout(check, 100);
	
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


module("TestGroup._loadAndRunTestByUrlArg", {
	setup : function() {
		this.recorded_extractGroupFilterArg = TestGroup._extractGroupFilterArg;
	},
	teardown : function() {
		TestGroup._extractGroupFilterArg = this.recorded_extractGroupFilterArg;
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

test("TestGroup._loadAndRunTestByUrlArg(): URL arg is root group", 2, function() {
	var fixture = this.makeGroupFixture();
	
	TestGroup._extractGroupFilterArg = function() {
		ok(true);
		return fixture.rootGroup.name;
	};
	fixture.rootGroup.loadAndRun = function() {
		ok(true);
	};
	
	TestGroup._loadAndRunTestByUrlArg(fixture.rootGroup);
});

test("TestGroup._loadAndRunTestByUrlArg(): URL arg is sub-group", 2, function() {
	var fixture = this.makeGroupFixture();
	
	TestGroup._extractGroupFilterArg = function() {
		ok(true);
		return fixture.subGroup.name;
	};
	fixture.subGroup.loadAndRun = function() {
		ok(true);
	};
	
	TestGroup._loadAndRunTestByUrlArg(fixture.rootGroup);
});

test("TestGroup._loadAndRunTestByUrlArg(): URL arg is test", 2, function() {
	var fixture = this.makeGroupFixture();
	
	TestGroup._extractGroupFilterArg = function() {
		ok(true);
		return fixture.testFile1.name;
	};
	fixture.testFile1.loadAndRun = function() {
		ok(true);
	};
	
	TestGroup._loadAndRunTestByUrlArg(fixture.rootGroup);
});

test("TestGroup._loadAndRunTestByUrlArg(): URL arg is unknown test", 1, function() {
	var fixture = this.makeGroupFixture();
	
	TestGroup._extractGroupFilterArg = function() {
		ok(true);
		return "unknown";
	};
	
	TestGroup._loadAndRunTestByUrlArg(fixture.rootGroup);
});

test("TestGroup._loadAndRunTestByUrlArg(): no URL arg", 2, function() {
	var fixture = this.makeGroupFixture();
	
	TestGroup._extractGroupFilterArg = function() {
		ok(true);
		return undefined;
	};
	fixture.rootGroup.loadAndRun = function() {
		ok(true);
	};
	
	TestGroup._loadAndRunTestByUrlArg(fixture.rootGroup);
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
