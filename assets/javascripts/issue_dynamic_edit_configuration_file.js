/*
 * CONFIGURATION FILE
 * More info on https://github.com/Ilogeek/redmine_issue_dynamic_edit
 */

/*
 * _CONF_FORCE_HTTPS (boolean)
 * Will force AJAX call performed by the plugin to be done with https protocol
 * Use this value if you encounter some difficulties with "Mixed content" issues
 * Allowed values : false (default), true
 */
var _CONF_FORCE_HTTPS = false;

/*
 * _CONF_DISPLAY_EDIT_ICON (string)
 * Choose if hovering the details block will display all the pencil icons next to editable values or if the user has to hover every value to check if (s)he can edit it
 * Allowed values : single (default), block
 */
var _CONF_DISPLAY_EDIT_ICON = "single";

/*
 * _CONF_LISTENER_TYPE_VALUE (string)
 * Choose which action will trigger the apparition of the edition block
 * Allowed values : click (default), dblclick, none
 */
var _CONF_LISTENER_TYPE_VALUE = "click";

/*
 * _CONF_LISTENER_TYPE_ICON (string)
 * If different from _CONF_LISTENER_TYPE_VALUE, the action set below will trigger
 * the apparition of the edition block if it comes from the pencil icon.
 * Allowed values : click (default), dblclick, none
 */
var _CONF_LISTENER_TYPE_ICON = "click";

/*
 * _CONF_LISTENER_TARGET (string)
 * Choose which area will trigger the apparition of the edition block
 * "value" will target the value of the attribute (+ pencil), "iconEdit" will only target the pencil icon, "label" will trigger the label attribute
 * "all" will target the whole line (label + value + pencil)
 * Allowed values : value (default), iconEdit, label, all
 */
var _CONF_LISTENER_TARGET = "value";

/*
 * _CONF_EXCLUDED_FIELD_ID (string array)
 * Choose which fields to exclude. They won't have the edit block and pencil
 * You have to take element (input, select, textarea ...) class attribute from edit form at the bottom of the page
 * Custom fields have an unique ID and this ID must be prefixed by "custom_field_values_". Eg : "custom_field_values_4" is an allowed value
 * Allowed values : array of any ID selector (css). Eg : ["status", "priority", "category", "assigned_to", "done_ratio", "start_date", "custom_field_values_4"]
 */
var _CONF_EXCLUDED_FIELD_ID = [];

/*
 * _CONF_CHECK_ISSUE_UPDATE_CONFLICT (boolean)
 * Choose if you allow current user to override all modifications performed by other users while editing the issue
 * true : will check issue update conflict and prevent current user to update the issue without refreshing the page
 * false : user will be able to update the issue no matter other modification performed (will override modification made by other)
 */
var _CONF_CHECK_ISSUE_UPDATE_CONFLICT = true;
