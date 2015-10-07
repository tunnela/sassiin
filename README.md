# Sassiin
The CSS authoring framework for rapid web development. Sassiin takes advantage of the latest features of Sass and therefore only supports Sass 3.4 and up.

## Easy Installation

### Install with [Bower](http://bower.io/)

I you have not installed Bower yet, follow the [instructions](http://bower.io/#install-bower) on Bower website.

If this is the first time you use Bower, you might want to create project specific manifest file bower.json. Change to your project directory and run the following command:

```shell
bower init
```

You can install Sassiin by running the following command:

```shell
bower install sassiin --save
```

### Import Sassiin

Last step is to import _sassiin.scss in every file that requires Sassiin, usually in your project's main Sass file:

```scss
@import "path-to-sassiin/sassiin"
```

## TODO

- Describe functions and mixins by adding @description annotation to them
- Documentation
- Tests
