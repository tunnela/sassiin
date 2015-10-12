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

## Usage Instructions

### Media Queries

Todo

### Breakpoints

Todo

### Variables

There are few reasons why I decided to add a variable system to Sassiin. Firstly, I wanted to circumvent problems caused by global variables. Secondly, I wanted to have an option to define variables generated on call-time by one or more mutator functions. Thirdly, I wanted to make the use of a variable, media query aware.

#### Media Query Awereness

Let's see an example of how variables are media query aware in Sassiin.

```scss
@include breakpoint(small, 640);
@include breakpoint(medium, 1280);
@include breakpoint(large, 1920);
@include breakpoint-group(devices, small medium large);

@include set((
	default-font-size: 16px,
	default-line-height: 28px
));

@include set(default-line-height, 24px, scope(small));

body {
  @include on(devices) {
    font-size: get(default-font-size);
    line-height: get(default-line-height);
  }
}
```

The result is as follows:

```css
@media (min-width: 0em) {
  body {
    font-size: 16px;
    line-height: 24px; 
  } 
}

@media (min-width: 40em) {
  body {
    font-size: 16px;
    line-height: 28px; 
  } 
}

@media (min-width: 80em) {
  body {
    font-size: 16px;
    line-height: 28px; 
  } 
}
```

As you can see, the line height is different for small devices just like we wanted.

#### Mutator Function

The reason why people use Sass is that it allows you to create reusable stylesheets that are customizable with variables. Sass is pretty flexible but there is a one little problem. I'm quite sure that I'm not the only one adding my variables inside a map. The reason why I'm doing this is to keep the global scope clean. Let's say that I wanted to create three variables, one for primary color, one for darker version of it and one more to control the amount of the brightness reduction. Now how do we do this with Sass maps?

```scss
$vars: (
  primary-color: red
);

$vars: map-merge($vars, (
  primary-color-darken-amount: 5%
));

$vars: map-merge($vars, (
  primary-color-darker: darken(
    map-get($vars, primary-color), 
    map-get($vars, primary-color-darken-amount)
  )
));

@debug map-get($vars, primary-color-darker);
```

There goes the readability... Now let's see how this is done with Sassiin using functions as mutator functions:

```scss
@include set((
  primary-color: red,
  primary-color-darken-amount: 5%,
  primary-color-darker: "@darken" ("@get" primary-color) ("@get" primary-color-darken-amount)
));

@debug get(primary-color-darker);
```

Pretty neat huh?

### Handlers

Sassiin's handler system allows you to attach handler functions on CSS declarations. Let's have an example. First, let's make a handler function which adds common browser prefixes to each processed property:

```scss
@function h-prefix($property, $values) {
  $declarations: ();

  @each $prefix in webkit, moz, ms, o {
	$declarations: append($declarations, ("-#{$prefix}-#{$property}": $values));
  }
  @return prepend-declaration($declarations);
}
```

The next step is to register the handler:

```scss
@include post-declaration-handler(h-prefix, 
  box-sizing transform transition border-radius 
  animation box-shadow transform-origin
);
```

The code tells Sassiin to only attach the handler on the given list of properties. Sassiin handlers are called by using *_* mixin:

```scss
@include _(box-shadow, 7px 7px 5px 0px rgba(50, 50, 50, 0.75));
```

The generated CSS will look as follows:

```css
-o-box-shadow: 7px 7px 5px 0px rgba(50, 50, 50, 0.75);
-ms-box-shadow: 7px 7px 5px 0px rgba(50, 50, 50, 0.75);
-moz-box-shadow: 7px 7px 5px 0px rgba(50, 50, 50, 0.75);
-webkit-box-shadow: 7px 7px 5px 0px rgba(50, 50, 50, 0.75);
box-shadow: 7px 7px 5px 0px rgba(50, 50, 50, 0.75);
```

### Placeholders

Sassiin's placeholder system is quite awesome. That's because Sassiin let's you create media query aware placeholders. As an example, let's first create a placeholder which hides element visually:

```scss
@mixin p-visually-hidden {
  @include placeholder(visually-hidden) {
    border: 0 none;
    clip: rect(0px, 0px, 0px, 0px);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
  @include extend(visually-hidden);
}
```

As you can see placeholder is a simple mixin that uses *placeholder* and *extend* mixins. Now let's see how the placeholder is used.

```scss
.hidden-heading {
  @include p-visually-hidden;

  @include mq(max-width 500) {
    @include p-visually-hidden;
  }
}

.hidden-element {
  @include mq(max-width 500) {
    @include p-visually-hidden;
  }
}

.hidden-link {
  @include p-visually-hidden;
}
```

What Sassiin does is that it automagically extends the correct placeholder based on the unique ID generated for each media query. The result is as follows:

```css
.hidden-heading,
.hidden-link {
  border: 0 none;
  clip: rect(0px, 0px, 0px, 0px);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

@media (max-width: 31.25em) {
  .hidden-heading,
  .hidden-element {
	border: 0 none;
	clip: rect(0px, 0px, 0px, 0px);
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	width: 1px;
  }
}
```

## TODO

- Describe functions and mixins by adding @description annotation to them
- Documentation
- Tests
