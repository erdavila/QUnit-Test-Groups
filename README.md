QUnit Test Groups
=================

**QUnit Test Groups** helps to organize [QUnit](http://qunitjs.com/) tests by
providing a means to group them and define a hierarchy of tests groups. Then the
hierarchy can be automatically rendered as an HTML outline with links to run
single test files or groups of tests.

To better understand, [see it in action]
	(http://erdavila.github.com/QUnit-Test-Groups/example/index.html) with the
	content in the [example](/erdavila/QUnit-Test-Groups/tree/gh-pages/example)
	directory. It includes the files:
* [tests-groups.js](/erdavila/QUnit-Test-Groups/blob/gh-pages/example/tests-groups.js),
	where the hierarchy of tests is defined;
* [index.html](/erdavila/QUnit-Test-Groups/blob/gh-pages/example/index.html),
	which automatically renders the outline of tests according to the hierarchy
	defined in `tests-groups.js`;
* [tests.html](/erdavila/QUnit-Test-Groups/blob/gh-pages/example/tests.html),
	a single HTML which can run any test file or group of tests;
* other `*.js` files, where all tests are defined.


## How to use QUnit Test Groups
To use QUnit Test Groups, follow the steps below. We suggest that you check how
the instructions were applied in the [example test set]
(https://github.com/erdavila/QUnit-Test-Groups/tree/gh-pages/example).

### Step 1 - Split your tests in different files
Your tests must be split in multiple .js files according to any criteria you
want to use. Just have in mind that all the tests in a single file will be run
together (QUnit Test Groups does not provide any means to run only one test from
a .js file containing multiple files). If it is desirable, your .js files can be
organized in different directories.

In the [example](https://github.com/erdavila/QUnit-Test-Groups/tree/gh-pages/example),
these files are named `test-*.js`

### Step 2 - Group and define the hierarchy for your tests
In an new .js file, define groups for your test files. Groups can also contain
other groups.

#### References for test files 
A test file is referenced this way:
``` javascript
{ name: "Component X - function a()", file: "test-X-a.js" }
```
Such a reference can be stored in a variable and reused in different groups (See
`testsUtils` in the [example]
(https://github.com/erdavila/QUnit-Test-Groups/blob/gh-pages/example/tests-groups.js#L11)).

#### Definitions of test groups 
A test group is defined this way:
``` javascript
var aTestGroup = new TestGroup("Component X", [
    item0,
    item1,
    ...
    itemN,
]);
```
where each _itemX_ is either a test file reference or another test group.
A group can also be referenced in multiple other groups (See `testsComponentX`
in the [example]
(https://github.com/erdavila/QUnit-Test-Groups/blob/gh-pages/example/tests-groups.js#L17)).

#### Set the root test group
Having defined all test groups, there must be a test group from which all test
files and other groups can be reached. This is the root test group, and must be
present to QUnit Test Groups this way:
``` javascript
TestGroups.root(rootTestGroup);
```

Check the file [test-groups.js]
(https://github.com/erdavila/QUnit-Test-Groups/blob/gh-pages/example/tests-groups.js)
in the example to see a complete hierarchy defined.

### Step 3 - Create a page where the tests will be run
Create an HTML file to run the tests, containing references for JavaScript files
in the following order:

1. [jQuery](http://jquery.com/): jquery-x.y.z.js
2. [QUnit](http://qunitjs.com/): qunit.js
3. [QUnit Test Groups](https://github.com/erdavila/QUnit-Test-Groups): qunit-testgroups.js
4. the file where you defined the hierarchy of tests.

Also include an element with id "qunit".

The resulting file should look like this:
``` html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Tests for My Project</title>
</head>
<body>
    <div id="qunit"></div>
    <script src="libs/jquery-1.7.2.min.js"></script>
    <script src="libs/qunit.js"></script>
    <script src="libs/qunit-testgroups.js"></script>
    <script src="tests-groups.js"></script>
</body>
```
If you open this file in a browser, all tests must be run.

In the example, this file is called "[tests.html]
(https://github.com/erdavila/QUnit-Test-Groups/blob/gh-pages/example/tests.html)"

### Step 4 - Create an index for your tests
Create an HTML file to display an outline to select which tests will be run.
This file must include references to JavaScript files of jUnit, QUnit Test
Groups and the file where you defined the hierarchy of tests. QUnit is not
needed.

The outline element is obtained by calling the function `TestGroups.outline()`,
passing as argument the name of the HTML file where the tests will be run (i.e.
the file that you defined in the previous step). Insert the outline element
wherever you want in your page.

In the example, this file is called "[index.html]
(https://github.com/erdavila/QUnit-Test-Groups/blob/gh-pages/example/index.html)".
Note how jQuery is used to insert the outline element in `document.body`.

### That's done!
Opening your test index file in a browser, you should see an outline
representing the hierarchy you defined for your tests. Click on an item, all
tests below it **in the hierarchy** must run in the page that runs tests.

## Adding tests
If you are adding tests only to existing files, then there is nothing special to
be done.

If you think the new tests should go into a new .js file (according to the
criteria you chose), then you should enter a reference for it in the hierarchy
in the file you created in step 2. Maybe you will want to define a new test
group or even review your entire hierarchy.
