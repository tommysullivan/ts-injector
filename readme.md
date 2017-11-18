private-devops-ts-injector
==========================

Dependency Injection for Typescript. This library uses a generator at compile time to produce type
metadata that is lost during the traditional typescript compile. The runtime Reflector and Injector
libraries then consume that metadata as well as native runtime reflection capabilities in order to
implement constructor injection without a need for additional repetitive annotations or string based
type names.

Possible Future Features
------------------------

* Support Factories
* Support Choosing an Implementation of Interface when multiple exist
* Support most general instantiation hook that could work for either above special cases
* Support lifecycles - singleton (one per injector) vs. normal (create instances every time)
* Support Proxying Object creation until objects are needed