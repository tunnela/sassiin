# Sassiin
Sassiin is the CSS authoring framework for rapid web development. It is the only Sass framework that really takes advantage of all the latest features of Sass (3.4 and up). Sassiin's amazing breakpoint system combined with declaration handlers, call-time generated variables and media query aware placeholders takes the CSS development to the next level. Please give it a go and [let me know](#4-author) your thoughts!

## Contents

1. [Easy Installation](#1-easy-installation)
    1. [Install with Bower](#i-install-with-bower)
    2. [Import Sassiin](#ii-import-sassiin)
2. [Usage Instructions](#2-usage-instructions)
    1. [Media Queries](#i-media-queries)
    2. [Breakpoints](#ii-breakpoints)
    3. [Variables](#iii-variables)
        1. [No To Global Scope](#a-no-to-global-scope)
        2. [Custom Scope](#b-custom-scope)
        3. [Media Query Awareness](#c-media-query-awareness)
        4. [Mutator Function](#d-mutator-function)
    4. [Handlers](#iv-handlers)
    5. [Placeholders](#v-placeholders)
3. [TODO](#3-todo)
4. [Author](#4-author)
5. [License](#5-license)

## 1. Easy Installation

### i. Install with [Bower](http://bower.io/)

I you have not installed Bower yet, follow the [instructions](http://bower.io/#install-bower) on Bower website.

If this is the first time you use Bower, you might want to create project specific manifest file bower.json. Change to your project directory and run the following command:

```shell
bower init
```

You can install Sassiin by running the following command:

```shell
bower install sassiin --save
```

### ii. Import Sassiin

Last step is to import _sassiin.scss in every file that requires Sassiin, usually in your project's main Sass file:

```scss
@import "path-to-sassiin/sassiin"
```

## 2 Usage Instructions

### i. Media Queries

Media query generation is made easy in Sassiin. Let's say that we wanted to create a horizontal navigation menu which is hidden in small resolution devices and in print. The navigation menu also becomes vertical in medium resolution devices. This is how we would do it in Sassiin:

```scss
.navigation {
  @include mq(print _ (max-width 480)) {
    display: none;
  }

  &-item {
    display: inline-block;
    
    @include mq(width 480 640) {
      display: block;
    }
  }
}
```

Generated CSS will look as follows:

```css
@media print, (max-width: 30em) {
  .navigation {
    display: none; 
  } 
}

.navigation-item {
  display: inline-block; 
} 

@media (min-width: 30em) and (max-width: 40em) {
  .navigation-item {
    display: block; 
  } 
}
```

In Sassiin underscore character means "or". A string followed by two numbers is converted to min-max-range. Single number is converted to min-width and single string generated as is. As an example:

```scss
.navigation {
  @include mq(print 100 _ (max-width 480) (height 200 500)) {
    display: none;
  }
}
```

Results in:

```css
@media print and (min-width: 6.25em), (max-width: 30em) and (min-height: 12.5em) and (max-height: 31.25em) {
  .navigation {
    display: none; 
  } 
}
```

### ii. Breakpoints

Breakpoint system is one of the most important features of Sassiin. With it stylesheet development could not be any easier. There are two types of breakpoints; breakpoints with at least one dimension and breakpoints without any dimensions.

To be continued...

### iii. Variables

There are few reasons why I decided to add a variable system to Sassiin. Firstly, I wanted to circumvent problems caused by global variables. Secondly, I wanted to have an option to define variables generated on call-time by one or more mutator functions. Thirdly, I wanted to make the use of a variable, media query aware.

#### a. No To Global Scope

In Sassiin *get*-function is used to retrieve and *set*-mixin to store key-value-pairs. This is how we use them:

```scss
@include set(primary-color, red);
@debug get(primary-color); // @return red
```

You can also store multiple key-value-pairs at once:

```scss
@include set((
  primary-color: red, 
  secondary-color: green
));

@debug get(primary-color); // @return red
@debug get(secondary-color); // @return green
```

Also when you are retrieving a value with *get*-function and the value for given key is not found, you can define the returned default value. This is how you do it:

```scss
@debug get(random-key, "this is default value"); // @return this is default value
```

#### b. Custom Scope

Sassiin let's you define scope for key-value-pairs.

```scss
@include set(primary-color, red, theme2);
@include set(primary-color, blue, theme2);

@debug get(primary-color, $scope: theme1); // @return red
@debug get(primary-color, $scope: theme2); // @return blue
```

#### c. Media Query Awareness

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

#### d. Mutator Function

The reason why people use Sass is that it allows you to create reusable stylesheets that are customizable with variables. Sass is pretty flexible but there is a one little problem. I'm quite sure that I'm not the only one adding my variables inside a map. The reason why I'm doing this is to keep the global scope clean. Let's say that I wanted to create three variables, one for primary color, one for darker version of it and one more to control the amount of primary color's brightness reduction. Now how do we do this with Sass maps?

```scss
$vars: (
  primary-color: red,
  primary-color-darken-amount: 5%
);

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

### iv. Handlers

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

### v. Placeholders

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

## 3 TODO

- Describe functions and mixins by adding @description annotation to them
- Documentation
- Tests

## 4 Author

Lauri Tunnela is a young and passionate B.Eng from Finland. He does everything from embedded C development to front-end web development. Lauri loves to build tools that make software development fast and easy for everyone. He hopes you to use Sassiin as you see fit. Although, as its developer he would be more than happy to know where you've used it and what are your thoughts about it! For contact details see [Lauri's profile](/tunnela/).

## 5 License

Sassiin is licensed under The MIT License (MIT). 

Copyright (c) 2015 Lauri Tunnela