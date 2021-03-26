# Svala

Svala is a tool to quickly generate CSS utility classes.

- **No JavaScript**. Svala is written in Sass (SCSS), not JavaScript. While you need a pipeline to compile Sass to CSS, configuration is done in Sass.
- **Highly customisable**. Svala is designed to adapt to your way of working, not the other way around. You can generate verbose classes like `.margin-left` or use shorthand like `.ml`, define prefixes (or "namespaces") like `.yolo-flex` and `.u-hidden` or use hierarchical scales to get output like `.grey-100, .grey-200, .grey-300, …`.
- **Responsive**. Svala can take your breakpoints and generate classes for responsive use. You can pick your breakpoint names, choose if you want them in a trailing (e.g. `.hidden@desktop`) or leading position (e.g. `.lg:hidden`) and pick their separator (e.g. `@` or `:`).
- **Small footprint**. There is no default output – Svala generates what you configure. Grow your utility classes with the requirements of your project and keep your CSS lean and clean.

If you have not heard of utility classes before, there are plenty of fantastic articles about them online – use your search engine of choice! 

Here are two recommendations: 
- watch ["In Defense of Utility-First CSS"](https://www.youtube.com/watch?v=R50q4NES6Iw), an excellent talk by Sarah Dayan at dotCSS 2019
- read ["CSS and Scalability"](http://mrmrs.io/writing/2016/03/24/scalable-css/) by Adam Morse, the creator of [Tachyons](https://tachyons.io/) (this is the article that rewired our brain when it was published)

## Installation

Get Svala from npm by running 

```
npm install svala
```

in your terminal. Use `yarn add svala` if you prefer Yarn.

## Requirements

Svala is written in Sass, which means you need a way to compile it to CSS. It doesn't matter if you love Gulp, use node-sass on the command line or if Webpack is your jam. Anything that can compile Sass to CSS will work. Here's [a tutorial for one way to do it](https://webdesign.tutsplus.com/tutorials/watch-and-compile-sass-in-five-quick-steps--cms-28275). 

## Usage

### Overview

If you're thinking about utility classes, you're probably familiar with [CSS ruleset terminology](https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax#css_rulesets). Svala uses well-defined terms like _selector_, _property_ and _value_, as well as a few others:

- **base selector** (or _token_): The base name for your selector. Typically, you will use the CSS property you want to control for this, e.g. `margin` or `border`.
- **axis**: Svala introduces a concept called _axes_ (plural, long 'e' 😉). An axis can be used to enhance a base selector with directional input, e.g. `margin-left` or `border-right`.
- **value**: Values are the bread and butter of utility classes. Svala allows you to define a list or map of values to iterate over, e.g. a size scale for visual hierarchy or a set of different values like `auto`, `hidden`, `scroll`. Value names are appended to the base selector (or axis, if applicable).
- **state**: If you need to factor pseudo-classes into your utilities, Svala has you covered. Use _states_ to generate class variants for `:hover`, `:focus`, `:checked` and others.
- **breakpoint**: All your classes can be scoped to your project's breakpoints and cater to your responsive needs.
- **prefix** and **postfix**: You can add extra bits to the beginning and/or end of your selectors by using _prefixes_ and _postfixes_. Use this to namespace your utility classes with `.u-`, for example.

Let's look at a practical example:

```
.margin-left-300@tablet { … }
```

"margin" is the _base selector_, which is enhanced with "left" as an _axis_ and "300" as the _value_ from a size scale. It should apply to the _breakpoint_ named "tablet".

The configuration for this single class could look like this:

```
$example1-config: (
    'margin': (
        'property': 'margin',
        'axes': left,
        'values': (
            '300': '0.75rem' 
        )
    )
);
```

Here is a second example:

```
.u-overflow-x-hidden { … }
```

This selector uses a _prefix_ ".u-", the _base selector_ "overflow" and was extended with the _axis_ "x" and the _value_ "hidden".

```
// Please refer to the section about "Output settings" to
// learn how to configure prefixes!

$example2-config: (
    'overflow': (
        'property': 'overflow',
        'axes': x,
        'values': hidden
    )
);
```

### Output settings

The first thing you'll want to do  with Svala is to adjust the output to your liking. There are a few options at your disposal:

Option | Value | Default | Description
------ | ----- | ------- | -----------
breakpoints | map | null | Your project's breakpoints. Configure them as a map with ('name': 'media query') pairs like ('tablet': 'min-width: 768px'). The name will be added to your class selector.
prefix | string | 'u-' | An optional prefix for all your utility classes. Use it to avoid collisions ("namespace") with third-party CSS or distinguish utility classes from "regular" ones. You can also reset it by setting it to an empty string: `''`.
postfix | string | '' | An optional postfix for all your utility classes. Use it for the same reasons as you would a prefix, or leave it empty.   
axis-modifier-divider | string | '-' | The character joining your base selector and any axis, e.g. `.u-margin-left` or `.u-float-right`. Any valid characters are allowed, as is `''`.    
value-modifier-divider | string | '-' | The character joining your selector and any values, e.g. `.u-overflow-hidden` for a named value or `.u-grey-200` for a scale item. Any valid characters are allowed, as is `''`. 
state-modifier-divider| string | '\\@' | The character joining your selector and any state, e.g. `.u-border@hover`. Note that special characters like `:` or `@` that are commonly used for this purpose have to be escaped with a double backslash.   
breakpoint-modifier-divider| string | '\\@' | The character joining your selector and any breakpoint name, e.g. `.u-hidden@desktop`. 
stateful-mode | 'leading' or 'trailing' | 'trailing' | Define where states (e.g. 'hover' or 'visited') are added to selectors: prepended before the selector (but after both prefix and breakpoint, if applicable) or appended after axis and values.   
responsive-mode | 'leading' or 'trailing' | 'trailing' |  Define where breakpoint names (e.g. 'tablet' or 'medium') are added to selectors: prepended before the selector (but after the prefix, if applicable) or appended after axis, values and state.

Create a variable called `$svala-options` and use a map to set your preferences and merge those with Svala's defaults:

```
$breakpoints-map: (
    'md': 'min-width: 768px',
    'lg': 'min-width: 1280px'
);

$my-options: (
    'breakpoints': $breakpoints-map,
    'breakpoint-modifier-divider': '\\:',
    'state-modifier-divider': '\\:',
    'responsive-mode': 'leading',
    'stateful-mode': 'leading',
    'prefix': ''
);

$svala-options: map-merge($svala-default-options, $my-options);
```

Here we're adding a set of breakpoints and tell Svala to output classes without a prefix, but with leading _breakpoint_ and _state_ information (a style popularized by Tailwind CSS) like `.lg:border` or even `.lg:hover:border-bottom`. 

### Generate your utility classes

Svala uses nested Sass [maps](https://sass-lang.com/documentation/values/maps) and [lists](https://sass-lang.com/documentation/values/lists) for configuration. The following parameters can be configured:

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
property | string | none | **Required**. Must be a valid CSS property.
values | string or map or list | null | The value that should be applied to the property. Can be a single value passed as string, a list of named values or a map with key,value pairs.
axes | map or list | null | A list of axes. Must be valid CSS directions or axes.
states | list | null | A list of pseudo-classes. Must be included in the supported pseudo-classes.  
responsive | boolean | false | Determines whether to generate responsive class variants. Svala will use the breakpoints from the global config. 
important | boolean | false | Determines whether `!important` should be added. Use with care.

Start with importing the generator from the package:

```
// This is an exmaple, your path to Svala may need to  
// be different, depending on your folder structure 
@import "node_modules/svala/scss/generator";
```

You can pass a config map to the Svala generator directly or create a variable and pass that. Here we're doing the latter:

```
$config: (
    'border': (
        'property': 'border',
        'value': '1px solid black'
    )
);
```

This assigns a map to `$config`. The _key_ of the only map entry, 'border', is your base selector and its value – a nested map – holds the rest of the settings for this particular class. 

Now all that is left to do is to call the generator mixin with your config:

```
@include generator($config);
```

If you didn't change Svala's default options, this will create the following CSS output:

```
.u-border {
    border: 1px solid black;
}
```

Let's look at a second example and pass the config directly this time:

```
@include generator((
    'position-absolute': (
        'property': 'position',
        'value': 'absolute'
    )
));
```

With Svala's default options, this will result in:

```
.u-position-absolute {
    position: absolute;
}
```

#### Axes

There are many CSS properties that can affect a specific direction. This includes the `-top`, `-right`, `-bottom`, `-left` modifiers for properties like `margin`, `padding` or `border` as well as `-x` and `-y` modifiers for `overflow` or `overscroll-behavior`. Finally, there are the newer [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties) like `block-start` or `inline-end` that enable us to create layouts that adhere to any writing mode and not just left-to-right / top-to-bottom. In Svala, these modifiers are called _axes_.

Let's look at an example:

```
@include generator((
    'border': (
        'property': 'border',
        'axes': top right bottom left,
        'value': '1px solid black'
    )
));
```

With Svala's default options, this will result in:

```
.u-border {
    border: 1px solid black;
}

.u-border-top {
    border-top: 1px solid black;
}

.u-border-right {
    border-right: 1px solid black;
}

.u-border-bottom {
    border-bottom: 1px solid black;
}

.u-border-left {
    border-left: 1px solid black;
}
```

You can also customize the axes output to your liking. The example above defines a Sass list as the value for the _axes_ key.
If you switch to a Sass map, you can change the _name_ of the axis (the part that ends up in the selector) and also pass multiple values per axis.

Here's an example with both advanced use cases:

```
@include generator((
    'property': 'margin',
    'value': '1rem',
    'axes': (
        't': 'top',
        'r': 'right',
        'b': 'bottom',
        'l': 'left',
        'h': ('right', 'left'),
        'v': ('top', 'bottom')
));
```

will generate (with default settings):

```
.u-margin {
    margin: 1rem;
}

.u-margin-t {
    margin-top: 1rem;
}

.u-margin-r {
    margin-right: 1rem;
}

.u-margin-b {
    margin-bottom: 1rem;
}

.u-margin-l {
    margin-left: 1rem;
}

.u-margin-h {
    margin-right: 1rem;
    margin-left: 1rem;
}

.u-margin-v {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
```

#### Values

#### States

Svala supports a subset of [all possible pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) for use as states:

```
'active', 'checked', 'disabled', 'empty', 'first', 'first-child', 'first-of-type', 'focus', 'focus-visible', 'focus-within', 'hover', 'invalid', 'last-child', 'last-of-type', 'link', 'only-child', 'only-of-type', 'optional', 'required', 'target', 'target-within', 'valid', 'visited'
```
