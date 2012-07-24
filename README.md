QUnit Test Groups
=================

**QUnit Test Groups** helps to organize [QUnit](http://qunitjs.com/) tests by
providing a means to group them and define a hierarchy of tests groups. Then the
hierarchy can be automatically rendered as an HTML outline with links to run
single test files or groups of tests.

To better understand, [see it in action](http://erdavila.github.com/QUnit-Test-Groups/example/index.html)
	with the content in the [example](/erdavila/QUnit-Test-Groups/tree/gh-pages/example)
	directory. It includes the files:
* [tests-groups.js](/erdavila/QUnit-Test-Groups/blob/gh-pages/example/tests-groups.js),
	where the hierarchy of tests is defined;
* [index.html](/erdavila/QUnit-Test-Groups/blob/gh-pages/example/index.html),
	which automatically renders the outline of tests according to the hierarchy
	defined in `tests-groups.js`;
* [tests.html](/erdavila/QUnit-Test-Groups/blob/gh-pages/example/tests.html),
	a single HTML which can run any test file or group of tests;
* other `*.js` files, where all tests are defined.
