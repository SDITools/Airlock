# Airlock FAQ

### When should I consider using Airlock?
If you have a very basic Google Analytics implementation, meaning you have just copied and pasted the Google Analytics code snippet, Airlock is not needed.  You can just replace the classic code (ga.js) with the new Universal Analytics code (analytics.js).

### Can Airlock send data to both a Google Analytics classic profile and a new Universal Analytics profile?
No, Airlock will only convert your classic Google Analytics code (_gaq.push) to the new Universal Analytics code.

### How are custom variables handled?
Custom variables will be converted to the new custom dimensions.  The same number is used, so be sure to create the custom dimensions exactly as they are currently being used as custom variables.

### How do I implement custom metrics?
Custom metrics did not exist in classic Google Analytics, so there is no conversion between the old and new code.  To implement custom metrics, use the code outlined by Google at https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets.

### Does Airlock support multiple trackers?
Yes, Airlock supports the use of multiple trackers.  No special configuration is needed.

### Are there any configurations I need to make in Airlock?
No.  Airlock will simply convert any classic Google Analytics requests that use _gaq.push to the new Universal Analytics methods.

### Can I use Airlock and still have the classic (ga.js) code on the page?
No.  Airlock redefines the _gaq.push method and will convert any additional custom Google Analytics tracking code.

### What additional custom Google Analytics tracking code will Airlock convert automatically?
By simply including Airlock on your site the following Google Analytics tracking methods will automatically be converted to Universal Analytics tracking code:
  * Custom Events
  * Ecommerce
  * Custom Variables
  * Virtual Pageviews
  * Social Interactions
  * User Timings
  * Cross Domain Tracking
  * Subdirectory Tracking
  * Sampling
  * Enhanced Link Attribution

### Can I use Airlock with Google Tag Manager?
Yes, you can use Airlock with Google Tag Manager.  See the Airlock implementation guide for more details.  However, it should only be used with a Google Analytics tag.  If you have need to add the Universal Analytics tag to take advantage of some of the new features, such as custom dimensions and custom metrics, it is recommended that you remove the Google Analytics tag and change all rules to set the correct Universal Analytics values.

### Does Airlock work with mobile apps?
No, Airlock does not work with native mobile apps.  It will work for any JavaScript-based implementation of Google Analytics.

### Should I include the analytics.js file in addition to Airlock?
No, only the Airlock file needs to be included on your page(s).  Airlock will include the analytics.js file for you.

### Can I use Airlock if my site is implemented with Urchin code?
No, Airlock only supports converting classic Google Analytics code that uses the _gaq.push method.

