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
			item = new TestFile(item.name, item.url);
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
		ScriptLoader.load(testFile.url);
	}
};


function TestFile(name, url) {
	if(typeof name != "string") {
		throw new TypeError("Name should be string");
	}
	if(typeof url != "string") {
		throw new TypeError("URL should be string");
	}
	this.name = name;
	this.url = url;
}


function TestFilesList() {
	this.testFiles = [];
	this.length = this.testFiles.length;
	this.urls = {};
}

TestFilesList.prototype.push = function(testFile) {
	var url = testFile.url;
	if(url in this.urls) {
		console.log("Already added to TestFilesList:", url);
		return false;
	} else {
		this.testFiles.push(testFile);
		this.length = this.testFiles.length;
		this.urls[url] = testFile;
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
