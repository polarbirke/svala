# Svala

Svala is a tool to quickly generate CSS utility classes and design tokens.

- **No JavaScript**. Svala is written in Sass (specifically, SCSS), not JavaScript. While you still need a pipeline to compile Sass to CSS, configuration and usage are done entirely in Sass.
- **Highly customisable**. Svala is designed to adapt to your way of working, not the other way around. You can generate verbose classes like `.margin-left` or use shorthand like `.ml`, define prefixes (or "namespaces") like `.yolo-flex` or use hierarchical scales to get output like `.u-grey-100, .u-grey-200, .u-grey-300, …`.
- **Responsive**. It should go without saying, but yes: Svala handles your breakpoints and generates classes for responsive use, e.g. `.hidden@desktop` or `.lg:hidden` – it's up to you how you configure it. 
- **Small footprint**. There is no default output – Svala only generates what you configure. Grow your utility classes with the requirements of your project and keep your CSS lean and clean.

If you have not heard of utility classes or design tokens before, there are plenty of fantastic articles about them online – use your search engine of choice! You can also read ["CSS and Scalability"](http://mrmrs.io/writing/2016/03/24/scalable-css/) by Adam Morse, the creator of [Tachyons](https://tachyons.io/). This is the article that literally rewired our brain when it was published.    

## Installation

Get Svala from npm by running 

```
npm install svala
```

in your terminal. Use `yarn add svala` if you prefer Yarn.

## Requirements

Svala is written in Sass, so you need Sass to run it. It doesn't matter if you love Gulp, use node-sass on the command line or if Webpack is your jam. Anything that can compile Sass to CSS will work. Here's [a tutorial for one way to do it](https://webdesign.tutsplus.com/tutorials/watch-and-compile-sass-in-five-quick-steps--cms-28275). 

## Usage

### Overview

If you're thinking about utility classes, you're probably familiar with CSS ruleset terminology. Svala uses both well-defined terms like _selector_, _property_ and _value_, as well as a few others:

- **base selector** (or _token_): The base name for your selector. Typically, you will use the CSS property you want to control for this, e.g. `margin` or `border`.
- **axis**: Svala introduces a concept called _axes_ (plural, long 'e' 😉). An axis can be used to enhance a base selector with directional input, e.g. `margin-left` or `border-right`.
- **item**: Svala also allows you to define an additional set of items to iterate over, e.g. a size scale for visual hierarchy or a set of different values like `auto`, `hidden`, `scroll`.
- **state**: If you need to factor pseudo-classes into your utilities, Svala has you covered. Use _states_ to generate class variants for `:hover`, `:focus` and others.
- **breakpoint**: All your classes can be scoped to your project's breakpoints and cater to your responsive needs.
- **prefix** and **postfix**: You can add extra bits to the beginning and/or end of your selectors by using _prefixes_ and _postfixes_. Use this to namespace your utility classes with `.u-`, for example.

Let's look at actual selectors:

```
.margin-left-300@tablet { … }
```

"margin" is the _base selector_, which is enhanced with "left" as an _axis_ and "300" as an _item_ from a size scale. It should only apply to "tablet" or greater (assuming a mobile-first approach with _breakpoints_). 

Here is a second example:

```
.u-overflow-x-hidden { … }
```

This selector uses a _prefix_ ".u-", the _base selector_ "overflow" and was enhanced with "x" as _axis_ and "hidden" from a set of _items_.

### Output settings

The first thing you'll want to do  with Svala is to adjust the output to your liking. There are a few options at your disposal:

Option | Value | Default | Description
------ | ---- | ------- | -----------
breakpoints | map | null | Your project's breakpoints. Configure them as a map with ('name': 'media query') pairs like ('tablet': 'min-width: 768px'). The name will be added to your class selector.
prefix | string | 'u-' | An optional prefix for all your utility classes. Use it to avoid collisions ("namespace") with third-party CSS or distinguish utility classes from "regular" ones. You can also reset it by setting it to an empty string: `''`.
postfix | string | '' | An optional postfix for all your utility classes. Use it for the same reasons as you would a prefix, or leave it empty.   
axis-modifier-divider | string | '-' | The character joining your base selector and any axis, e.g. `.u-margin-left` or `.u-float-right`. Any valid characters are allowed, as is `''`.    
item-modifier-divider | string | '-' | The character joining your selector and any items, e.g. `.u-overflow-hidden` for a value item or `.u-grey-200` for a scale item. Any valid characters are allowed, as is `''`. 
state-modifier-divider| string | '\\@' | The character joining your selector and any state, e.g. `.u-border@hover`. Note that special characters like `:` or `@` that are commonly used for this purpose have to be escaped with a double backslash.   
breakpoint-modifier-divider| string | '\\@' | The character joining your selector and any breakpoint name, e.g. `.u-hidden@desktop`. 
stateful-mode | 'leading' or 'trailing' | 'trailing' | Define where states (e.g. 'hover' or 'visited') are added to selectors: prepended before the selector (but after both prefix and breakpoint, if applicable) or appended after axis and items.   
responsive-mode | 'leading' or 'trailing' | 'trailing' |  Define where breakpoint names (e.g. 'tablet' or 'medium') are added to selectors: prepended before the selector (but after the prefix, if applicable) or appended after axis, items and state.

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
    'axis-modifier-divider': '',
    'responsive-mode': 'leading',
    'stateful-mode': 'leading',
    'prefix': ''
);

$svala-options: map-merge($svala-default-options, $my-options);
```

Here we're adding a set of breakpoints and tell Svala to output classes with leading _breakpoint_ and _state_ information (a style popularized by Tailwind CSS) like `.lg:border` or even `.lg:hover:border-bottom`. 

### Generate your utility classes

Svala uses nested Sass [maps](https://sass-lang.com/documentation/values/maps) and [lists](https://sass-lang.com/documentation/values/lists) for configuration. The following parameters can be configured:

Parameter | Type | Default | Description
property | string | none | **Required**. Must be a valid CSS property.
value | string | null | The value that should be applied to the property. One of either value or items are required.
axes | map or list | null | A list of axes. Must be valid CSS directions or axes.
items | map or list | null | A set of items. If items and value are defined, value is ignored.
states | list | null | A list of pseudo-classes. Must be included in the supported pseudo-classes.  
responsive | boolean | false | Determines whether to generate responsive class variants. Svala will use the breakpoints from the global config. 
important | boolean | false | Determines whether `!important` should be added. Use with care.

Start with importing the generator from the package:

```
// This is an exmaple, your path to Svala may need to  
// be different, depending on your folder structure 
@import "node_modules/svala/generator";
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

Now all that is left to do is to call the generator with your config:

```
@generator($config);
```

If you didn't change Svala's default options, this will create the following CSS output:

```
.u-border {
    border: 1px solid black;
}
```

Let's look at a second example and pass the config directly this time: 

```
@generator((
    'border': (
        'property': 'border',
        'axes': ('top', 'right', 'bottom', 'left'),
        'value': '1px solid black'
    )
));
```

With Svala's default options, this will result in 

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

#### Axes

#### Items

#### States

Svala supports a subset of [all possible pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) for use as states:

```
'active', 'checked', 'disabled', 'empty', 'first', 'first-child', 'first-of-type', 'focus', 'focus-visible', 'focus-within', 'hover', 'invalid', 'last-child', 'last-of-type', 'link', 'only-child', 'only-of-type', 'optional', 'required', 'target', 'target-within', 'valid', 'visited'
```
