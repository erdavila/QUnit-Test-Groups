/*
Copyright (c) 2012 Eduardo R. D'Avila (https://github.com/erdavila)

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


function TestGroup(name, items) {
	if(typeof name != "string") {
		throw new TypeError("Name should be string");
	}
	if(! $.isArray(items)) {
		throw new TypeError("items should be array");
	}
	this.name = name;
	this.items = [];
	for(var i = 0; i < items.length; i++) {
		var item = items[i];
		if(!TestGroup.isTestGroup(item)  &&  !TestGroup.isTestFile(item)) {
			item = new TestFile(item.name, item.file);
		}
		this.items.push(item);
	}
}

TestGroup.isTestFile = function(item) {
	var result = (typeof item == "object")
	         &&  (item != null)
	         &&  (item.constructor == TestFile);
	return result;
};

TestGroup.isTestGroup = function(item) {
	var result = (typeof item == "object")
	         &&  (item != null)
	         &&  (item.constructor == TestGroup);
	return result;
};

TestGroup._loadAndRunTestByUrlArg = function(rootTestGroup) {
	var name = this._extractGroupFilterArg();
	var test;
	if(name) {
		if(rootTestGroup.name == name) {
			test = rootTestGroup;
		} else {
			test = rootTestGroup.searchByName(name);
		}
	} else {
		test = rootTestGroup;
	}
	if(test) {
		test.loadAndRun();
	}
};

TestGroup.rootTestGroup = TestGroup._loadAndRunTestByUrlArg;

TestGroup._extractGroupFilterArg = function() {
	var m = document.location.search.match(/[\?&]groupfilter=([^&]*)/);
	return m
	     ? unescape(m[1])
	     : undefined;
};

TestGroup._makeOutlineLink = function(name, baseUrl) {
	var link = $("<a/>");
	link.attr("href", baseUrl + "?groupfilter=" + escape(name));
	link.text(name);
	return link;
};

TestGroup.prototype.getAllTestFiles = function() {
	var testFilesList = new TestFilesList();
	this.addTestFilesToList(testFilesList);
	return testFilesList.asArray();
};

TestGroup.prototype.addTestFilesToList = function(list) {
	for(var i = 0; i < this.items.length; i++) {
		var item = this.items[i];
		if(TestGroup.isTestGroup(item)) {
			item.addTestFilesToList(list);
		} else {
			list.push(item);
		}
	}
};

TestGroup.prototype.loadAndRun = function() {
	var testFiles = this.getAllTestFiles();
	for(var i = 0; i < testFiles.length; i++) {
		var testFile = testFiles[i];
		testFile.loadAndRun();
	}
};

TestGroup.prototype.searchByName = function(name) {
	for(var i = 0; i < this.items.length; i++) {
		var item = this.items[i];
		if(item.name == name) {
			return item;
		}
		if(TestGroup.isTestGroup(item)) {
			var test = item.searchByName(name);
			if(test) {
				return test;
			}
		}
	}
};

TestGroup.prototype.outline = function(baseUrl) {
	var item = this._outlineItem(baseUrl);
	var outline = $("<ul>/");
	outline.append(item);
	return outline;
};

TestGroup.prototype._outlineItem = function(baseUrl) {
	var item = $("<li/>");
	
	var link = TestGroup._makeOutlineLink(this.name, baseUrl);
	item.append(link);
	
	var itemsList = this._outlineItemsList(baseUrl);
	item.append(itemsList);
	
	return item;
};

TestGroup.prototype._outlineItemsList = function(baseUrl) {
	var list = $("<ul/>");
	for(var i = 0; i < this.items.length; i++) {
		var item = this.items[i];
		var listItem = item._outlineItem(baseUrl);
		list.append(listItem);
	}
	return list;
};


function TestFile(name, file) {
	if(typeof name != "string") {
		throw new TypeError("Name argument should be string");
	}
	if(typeof file != "string") {
		throw new TypeError("File argument should be string");
	}
	this.name = name;
	this.file = file;
}

TestFile.prototype.loadAndRun = function() {
	ScriptLoader.load(this.file);
};

TestFile.prototype._outlineItem = function(baseUrl) {
	var item = $("<li/>");
	
	var link = TestGroup._makeOutlineLink(this.name, baseUrl);
	item.append(link);
	
	return item;
};


function TestFilesList() {
	this.testFiles = [];
	this.length = this.testFiles.length;
	this.files = {};
}

TestFilesList.prototype.push = function(testFile) {
	var file = testFile.file;
	if(file in this.files) {
		console.log("Already added to TestFilesList:", file);
		return false;
	} else {
		this.testFiles.push(testFile);
		this.length = this.testFiles.length;
		this.files[file] = testFile;
		return true;
	}
};

TestFilesList.prototype.asArray = function() {
	var array = $.makeArray(this.testFiles);
	return array;
};

TestFilesList.prototype.get = function(index) {
	var testFile = this.testFiles[index];
	return testFile;
};


ScriptLoader = {
	load : function(url) {
		var scriptElement = this.createScriptElement(url);
		document.head.appendChild(scriptElement);
	},
	createScriptElement : function(url) {
		var scriptElement = document.createElement('script');
		scriptElement.src = url;
		return scriptElement;
	},
};
