Airlock v0.1.0
===============
(c) 2013 by Search Discovery <http://searchdiscovery.com/>

airlock.js may be freely distributed under the MIT license. http://opensource.org/licenses/MIT

For all details and documentation: http://www.searchdiscovery.com/airlock

DESCRIPTION
--------------
Airlock is a JavaScript library that automatically turns your asynchronous Google Analytics calls into Universal Analytics calls, lifting the burden of having to re-implement a site when upgrading to Universal Analytics.

BEFORE YOU START
------------------

In order to utilize Airlock you must upgrade your classic Google Analytics property to Universal Analytics. From the Admin panel under your Property column you will see an option for "Universal Analytics Upgrade".

If you do not see this option you have already upgraded to Universal Analytics or Google has done this for you automatically.

Select the Transfer button to complete the upgrade request. It will take up to 48 hours to complete the upgrade to Universal Analytics. **Do not** install Airlock until 
this upgrade is complete. After your upgrade is complete your classic Google
Analytics code will continue to send data to your property reports.

HOW TO IMPLEMENT AIRLOCK ON YOUR SITE
----------------------------------------
Once your property has been successfully transferred to Universal Analytics, it is time to deploy the code on your site.

IMPLEMENTING AIRLOCK WITH ON PAGE CODE
----------------------------------------
To upgrade a vanilla Google Analytics install where you are not using any tag management systems, you will replace the code to include the Google Analytics file with the Airlock code.

	<script type="text/javascript">
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-XXXXX-X']);
	_gaq.push(['_trackPageview']);

	(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
	</script>

Remove the function that includes the classic Google Analytics ga.js file and include the Airlock JavaScript file. We recommend that the Airlock code be placed in a separate file, which will be hosted on your servers.

	<script type="text/javascript">
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-XXXXX-X']);
	_gaq.push(['_trackPageview']);

	</script>
	<script type="text/javascript" src="[INSERT YOUR PATH]/airlock.min.js"></script>

The Airlock JavaScript file must be included on every page that has the classic
baseline Google Analytics code. That’s it! Everything else is handled from here,
even the inclusion of the new Universal Analytics JavaScript file.

IMPLEMENTING AIRLOCK WITH ADOBE DYNAMIC TAG MANAGEMENT
-------------------------------------------------------
First, you have to disable Adobe DTM from including the Google Analytics
JavaScript file automatically. After clicking the property you want to use Airlock
on, select the Google Analytics tool from your installed tools by clicking on the
gear.

Under the General section, check the box "Google Analytics page code is already present". This will ensure that the ga.js file does not get included on the page.


Next, create a new Page Load Rule that will fire on every page. Trigger the rule
at the bottom of the page. (If you already have a rule that does this, you do not
need to add a new rule, you can just add the code to the existing rule). In the
JavaScript/Third Party Tags section, click the Sequential JavaScript tab and click
the Add New Script button. 

Paste the Airlock code, check the box to execute globally, and click the Save
Code button. Click the Save Rule button, Approve and Publish the update. That's it. Airlock will handle everything from this point forward, including the inclusion of the new Universal Analytics code.

IMPLEMENTING AIRLOCK WITH GOOGLE TAG MANAGER
-----------------------------------------------
In your Google Tag Manager account container create a new tag. Select Custom HTML Tag as the Tag Type. Add the Airlock JavaScript code to the HTML input box, but as it is HTML be sure to enclose it with script tags.

Click the Add Rule to Fire Tag button and select the All pages Rule.

Click Save and click Save again. Preview, test and Publish your update. That's it.