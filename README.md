AngularCoverup directive
===============

Create a div that covers the entire parent element with (usually) a spinner.

![AngularCoverup Directive Example](https://github.com/marneborn/angular-coverup/blob/master/examples/images/example1.png)

This directive creates a background that completely covers the parent element.
The contents of the mng-coverup directive are, by default, centered on the background.
The size of both the mng-coverup contents and the container are watched. The placement is adjusted as needed.

Whether or not the coverup is shown is done using any of ng-if, ng-show, ng-hide, or ng-switch.

Basic usage is by creating a mng-coverup element:
```html
<mng-coverup ng-show="showSpinner">
    <img src="spinner.gif" />Loading
</mng-coverup>
```
Or by adding the mng-cover attribute:
```html
<div mng-coverup ng-show="showSpinner">
    <img src="spinner.gif" />Loading
</div>
```

The style of the background can be changed in your css by using the mngCoverupBackground class.
For example:
```css
.mngCoverupBackground {
	background-color: red;
	opacity : 1;
}
```

In order to change just one coverup, add a class to the directive element
```html
<mng-coverup ng-show="showSpinner" class="solidRedCoverup">
    <img src="spinner.gif" />Solid Red!!!
</mng-coverup>
```
```css
.solidRedCoverup .mngCoverupBackground {
	background-color: red;
	opacity : 1;
}
```

The style of the contents can be controlled by adjusting the mngCoverupContents class in your style sheet.
For example:
```html
<mng-coverup ng-show="showSpinner" class="clearWithBlueBorder">
    <img src="spinner.gif" />Solid Red!!!
</mng-coverup>
```
```css
.clearWithBlueBorder .mngCoverupBackground {
	opacity : 0;
}
.clearWithBlueBorder .mngCoverupContent {
	border  : 1px solid blue;
}
```
