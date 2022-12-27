# ✨  redmine_issue_dynamic_edit

Add new elements on detailed issue page to **dynamically update issue's attributes and custom fields**, directly in the details block of the issue **without any page refresh** (*JIRA style*).


### 🔴  What info you should provide when opening an issue
>Please list your installed plugins and the Redmine version you use. Note that I can't fix every issue when you have conflict with an other plugin that also edit the page.
>
>This plugin use JS a lot. Check your JS console from your web browser ( [HowTo](https://webmasters.stackexchange.com/a/77337) ) and try again to reproduce your issue. You'll see some information about what goes wrong. 
>
>Copy and paste the result that appears in your console in the Github issue and expand all possible object (error data for example). With this data, we can look if there's a problem with the ajax call the plugin performs to update the issue or if there's any JS error.

### 🔎  Example

![Gif that represents dynamic edition of field from the detailled issue's view](/doc/edit.gif)

### 📦  Installation

* If you update the plugin, be sure to save your configuration modification (`assets/javascripts/issue_dynamic_edit_configuration_file.js`) in a safe place to set them back after the update 
* Clone repo into plugins directory : `git clone https://github.com/Ilogeek/redmine_issue_dynamic_edit.git` (be sure that the parent folder is called `redmine_issue_dynamic_edit`)
* Restart your Redmine instance

### ⚙  Configuration (new since v 0.6.6)

You can set some settings by editing the file `assets/javascripts/issue_dynamic_edit_configuration_file.js`. Inside this file you'll find different variable :
* **\_CONF\_FORCE\_HTTPS** : Will force AJAX call performed by the plugin to be done with https protocol. Use this value if you encounter some difficulties with "Mixed content" issues 
* **\_CONF\_DISPLAY\_EDIT\_ICON** : Choose if hovering the details block will display all the pencil icons next to editable values or if the user has to hover every value to check if (s)he can edit it. Allowed value : `single`, `block`
* **\_CONF\_LISTENER\_TYPE\_VALUE** : Choose which action will trigger the apparition of the edition block when fired from the current value. Allowed value : `none`, `click`, `dblclick`
* **\_CONF\_LISTENER\_TYPE\_ICON** : Choose which action will trigger the apparition of the edition block when fired from the pencil icon (by default: same as **\_CONF\_LISTENER\_TYPE\_VALUE**). Allowed value : `none`, `click`, `dblclick`
* **\_CONF\_LISTENER\_TARGET** : Choose which area will trigger the apparition of the edition block
* **\_CONF\_EXCLUDED\_FIELD\_ID** : Choose which fields to exclude. They won't have the edit block and pencil. Eg: `TitleInput`, `DescriptionInput`, `statusListDropdown` ...
* **\_CONF\_CHECK\_ISSUE\_UPDATE\_CONFLICT** : Choose if you allow current user to override all modifications performed by other users while editing the issue

### 🎨  Customization

Feel free to edit `assets/stylesheets/issue_dynamic_edit.css` to update the look of your fields depending on your current Redmine Theme. 

### 🆕  Changelog

* **v 0.9.2** : JSToolbar fixed (#100)
* **v 0.9.1** : Check version improved (avoiding update conflicts) : using [Redmine REST API](https://www.redmine.org/projects/redmine/wiki/rest_issues) and disabling check when tab is not focused (#97)
* **v 0.9.0** : JS rewritten to remove jQuery code
* **v 0.8.1** : fixed Github issue #89 : Issue version check (AJAX call) may give glitch while editing text + disable global event listener on ajaxSend
* **v 0.8.0** : Complete rework. Compatible with last Redmine version. New settings added : `_CONF_CHECK_ISSUE_UPDATE_CONFLICT` (#70 #88). Removed external lib (FontAwesome) (#74). Mobile style added (#87). Print style added (#84). Bug fix (#79, #85)
* **v 0.7.2** : New settings added into config file (`_CONF_DISPLAY_EDIT_ICON` and `_CONF_LISTENER_TYPE_ICON`) see Configuration part for more info ; new event `none` for `_CONF_LISTENER_TYPE_VALUE` disabling listener on value ; css fix
* **v 0.7.1** : Fixed incorrect DOM structure if user has read only access to the issue (#61 #64)
* **v 0.7.0** : Category filter by project added (#55) and prevent dialog closing when using fa-pencil selector (#59)
* **v 0.6.9** : Category field support (Github request #54)
* **v 0.6.8** : Checkboxes custom fields fixed (#53)
* **v 0.6.7** : fixed Github issue #46 : text field focus issue
* **v 0.6.6** : New configuration file + Multiple fixes (#30 #31 #35 #36 #37 #38 #41)
* **v 0.6.5** : Checklists plugin support (and all other plugins that compute fields when there's an issue update) (Github requests #26 and #28) + custom url support (Github request #29)
* **v 0.6.4** : version field with checkbox display is now supported, Target version and Assignee fields are also supported (Github request #24)
* **v 0.6.3** : fixed Github issue #22 : DatepickerFallback raised an error
* **v 0.6.2** : fixed Github issue #22 : long description is now supported (no more 414 errors)
* **v 0.6.1** : fixed Github issue #20
* **v 0.6.0** : **NOW WITH CUSTOM FIELDS SUPPORT** ! (Github #19)
* **v 0.5.0** : fixed Github issue #18 : textarea fixed (jstoolbar or ckeditor)
* **v 0.4.9** : fixed Github issue #17 : Datepicker fallback added for date fields
* **v 0.4.8** : fixed Github issues #15 and #16
* **v 0.4.7** : if error on dynamic update, put back old values in details block (fixed Github issue #8)
* **v 0.4.6** : description is now dynamically editable (edit field appears if there's already a description written) (Github request #14)
* **v 0.4.5** : fixed Github issue #13 : CSS display for custom attributes, added Title dynamic edition (Github request #14)
* **v 0.4.4** : fixed Github issues #6, #12 : User can't update status until all required field are filled for this step of the issue
* **v 0.4.3** : partially fixed Github issue #12 : Read only attributes can't be edited anymore. Dynamic refresh for read only attributes when status changes
* **v 0.4.2** : fixed Github issue #10 : History list updated after modification
* **v 0.4.1** : fixed Github issue #7 : update status list to follow Redmine workflow
* **v 0.4.0** : fixed Github issues #2, #4, #9. Edited dropdown display
* **v 0.3.0** : start date, due date, ratio and estimated time fields are now dynamically editable. Translation files added (en, fr). Log added in console when AJAX fails
* **v 0.2.0** : fixed "conflict" when trying to add a note after an update from dropdowns. New method used, REST API is not required anymore
* **v 0.1.0** : initial commit
