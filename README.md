# Airlock

(c) 2013 by [Search Discovery](http://searchdiscovery.com)

airlock.js may be freely distributed under the [MIT license](http://opensource.org/licenses/MIT).

For all details and documentation: http://www.searchdiscovery.com/airlock

## Description
Airlock is a JavaScript library that automatically turns your asynchronous Google Analytics calls into Universal Analytics calls, lifting the burden of having to re-tag your entire site when upgrading to Universal Analytics.

## Basic Installation

### Before You Start
In order to utilize Airlock you must first upgrade your classic Google Analytics property to Universal Analytics. In your Google Analytics admin panel under the "Property" column you will see an option for "Universal Analytics Upgrade." Select the "Transfer" button to complete the upgrade request.

It may take up to 48 hours to complete the upgrade to Universal Analytics. **Do not install Airlock until this upgrade is complete**. After your upgrade is complete, your classic Google Analytics code will continue to send data to your property reports. Install Airlock to receive the full benefits of Universal Analytics.

### Get Airlock

#### Using Bower
If you have the [Bower](http://bower.io/) package manager installed on your system, you can install Airlock from the command line.

    bower install airlock --save

This command will clone the latest version of Airlock into your Bower components directory and will specify Airlock as a dependency in your `bower.json` file, if you have created one.

#### Manually
Download and extract the [latest zip package](https://github.com/SDITools/Airlock/archive/master.zip) from Github and copy `airlock.js` and `airlock.min.js` into your project, then include them using the method specified below that is appropriate for your analytics installation.

### How to Implement Airlock on Your Site
Once your property has been successfully transferred to Universal Analytics, it is time to deploy the code on your site.

#### Implement Airlock With On-Page Code
To upgrade a vanilla Google Analytics installation on a site not using a tag management system, simply replace the standard Google Analytics asynchronous script include with a reference to your local Airlock file.

```html
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-XXXXX-X']);
  _gaq.push(['_trackPageview']);

  // Remove this:
  // (function() {
  // var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  // ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  // var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  // })();
</script>
<!-- and add this: -->
<script type="text/javascript" src="[INSERT YOUR PATH]/airlock.min.js"></script>
```

That’s it! Everything else (even the inclusion of the new Universal Analytics JavaScript file) is handled by Airlock.

#### Implement Airlock With Adobe Dynamic Tag Management
First, you must prevent Adobe DTM from including the Google Analytics JavaScript file automatically. After clicking the property on which you would like to install Airlock, select the Google Analytics tool from your installed tools by clicking on the gear.

Under the "General" section, check the box marked "Google Analytics page code is already present." This will ensure that DTM does not include the ga.js file on the page.

Next, create a new page load rule that will fire on every page. Set the rule to fire at the bottom of the page. (If you already have a rule that does this, you do not need to add a new rule, you can just add the code to the existing rule). In the "JavaScript/Third Party Tags" section, navigate to the "Sequential JavaScript" tab and click the "Add New Script" button.

Paste the Airlock code into the code editor, check the "Execute Globally" box, and click the "Save Code" button. Click the "Save Rule" button, then approve and publish the update. That's it. Airlock will handle everything from this point forward, including the inclusion of the new Universal Analytics code.

#### Implement Airlock With Google Tag Manager
In your Google Tag Manager account container, create a new tag. Select "Custom HTML Tag" as the tag type. Add the Airlock JavaScript code to the HTML input box (since GTM is expecting HTML here, be sure to use a `<script>` tag referencing your local Airlock, or paste the Airlock code enclosed within `<script>` tags).

Click the "Add Rule To Fire Tag" button and select the "All Pages" rule.

Click "Save" and then save again. Preview, test, and publish your update. That's it!

## Advanced Options

When loaded onto the page, Airlock checks for the presence of an `_airlock` object in the global namespace. If Airlock finds the object, it will be used to configure your Airlock setup.

```javascript
var _airlock = {
  // your settings
};
```

### Load UA Debug Script: `_airlock.debug`
Universal Analytics has a debug version of analytics.js that outputs verbose logging to the console. To load this version instead of the default, set `_airlock.debug = true;`.

### Custom Namespacing for UA: `_airlock.gaNamespace`
Universal Analytics allows implementors to choose a custom namespace for the Universal Analytics library (it defaults to `ga`). To choose a custom namespace, set `_airlock.gaNamespace = 'yourCustomNamespace';`.

### Custom Dimension Mapping: `_airlock.dimensionMap`
By default, Airlock will map GA custom variable slot numbers to UA dimension numbers, thus `_gaq.push(['_setCustomVar', 2, 'name', 'value']);` will translate to `ga("set", "dimension2", "value");`

If you need to override this default behaviour, you can map slot numbers or custom variable names to dimension numbers using the `_airlock.dimensionMap` property:

```javascript
_airlock.dimensionMap = {
  "2": 1 // customVar in slot 2 will map to "dimension1"
  'varName': 2 // customVar with name "varName" will map to "dimension2"
}
```

### Prevent Airlock Auto-Init: `_airlock.autoInit`
By default, Airlock will initialize itself automatically. If you need to prevent this in order to initialize at a later time, simply set `_airlock.autoInit = false;`, then call `Airlock.initialize()` when ready.

### Prevent UA Autoload: `_airlock.loadUA`
In most situations, implementors will want to let Airlock load Universal Analytics. In special cases, however, users may want to load the Universal Analytics library on their own.

If `analytics.js` is loaded prior to Airlock, Airlock will not load UA again.  However, if you need to load Airlock before UA is loaded and want to intialize `analytics.js` yourself, you can set `_airlock.loadUA = false;`.

### Expose The Airlock Object: `_airlock.expose`
By default the Airlock object is not exposed to the global namespace (unless autoInit is disabled). If you need to access the Airlock object, set `_airlock.expose = true;`.

### Adding/Modifying GA->UA Translations: `_airlock.conversions`
Airlock needs no modification to work seamlessly with the great majority of GA installs. However, if you need to add or modify a procedure for translating a particular type of `_gaq.push()` call, you can do this by creating and setting conversion procedures on the `_airlock.conversions` object.

When Airlock receives `_gaq.push()` calls, it grabs the first argument and checks `Airlock.conversions` to see if there is a conversion procedure matching that key. Any procedures set on `_airlock.conversions` will override default conversion procedures on `Airlock.conversions`. Thus, if you want to override the default behavior of `_gaq.push(['_trackSocial'/*, ...*/]); calls, you would set a `_trackSocial` property on `_airlock.conversions`.

#### Conversion Procedure Formats
Conversion procedures can be functions or template objects.

##### Conversion Functions
Functions receive `_gaq.push()` arguments indexed > 0. If an array is returned, `ga()` will be called using the array members as its arguments.

##### Conversion Templates
Conversion template objects contain an input and an output array.  The input array contains the keys by which `_gaq.push()` arguments are indexed. The output array is a template of the arguments that will be passed to `ga();`. This array's members can either be plain strings, template strings (`"dimension[[slot]]"`, which will be output the word "dimension" concatenated with the value of the `slot` input key), or a function, which will receive as an argument an object containing the indexed input variables, and whose return value will be the value of the output index at which the function was declared.

### AMD Support
Airlock is AMD compatible.
