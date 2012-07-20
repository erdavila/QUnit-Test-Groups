function TestGroup(name, components) {
	this.name = name;
	this.components = [];
	for(var i = 0; i < components.length; i++) {
		var component = components[i];
		if(!TestGroup.isTestGroup(component)  &&  !TestGroup.isTestFile(component)) {
			component = new TestFile(component.name, component.url);
		}
		this.components.push(component);
	}
}

TestGroup.isTestFile = function(component) {
	var result = (component.constructor == TestFile);
	return result;
};

TestGroup.isTestGroup = function(component) {
	var result = (component.constructor == TestGroup);
	return result;
};

TestGroup.prototype.getAllTestFiles = function() {
	var testFilesList = new TestFilesList();
	
	for(var i = 0; i < this.components.length; i++) {
		var component = this.components[i];
		if(TestGroup.isTestFile(component)) {
			testFilesList.add(component);
		} else {
			var testFiles = component.getAllTestFiles();
			for(var j = 0; j < testFiles.length; j++) {
				var testFile = testFiles.get(j);
				testFilesList.add(testFile);
			}
		}
	}
	return testFilesList;
};

TestGroup.prototype.run = function() {
	var testFiles = this.getAllTestFiles();
	for(var i = 0; i < testFiles.length; i++) {
		var testFile = testFiles.get(i);
		ScriptLoader.load(testFile.url);
	}
};


function TestFile(name, url) {
	this.name = name;
	this.url = url;
}


function TestFilesList() {
	this.testFiles = [];
	this.length = this.testFiles.length;
	this.urls = {};
}

TestFilesList.prototype.add = function(testFile) {
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
