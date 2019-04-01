# gas-library-pixela

WARNING: THIS IS VERY ALPHA VERSION. SO API COULD CAHNGE. 

AND I DON'T KNOW GOOGLE APPS SCRIPT LIBRARY CALL LIMITATION. IF QUOTED, THIS LIBRARY CAN'T CALL.

[gas-library-pixela](https://github.com/noissefnoc/gas-library-pixela) is unofficial [pixe.la](https://pixe.la) API client for [Google Apps Script](https://developers.google.com/apps-script/).

By using this script you can

* provide simple GUI application for non-developers
    * create user/graph/pixel/webhook with Google form or Google Spreadsheet
    * manage user/graph/pixel/webhook ledger with Google Spreadsheet
* ease to recording and posting to pixela
    * write records on the Google Spreadsheet and post pixela automatically
* and so on.


## Prepare to use

### Copy to your Google Apps Script project

You can copy this library to your Google Apps Script project from [GitHub Release](https://github.com/noissefnoc/gas-library-pixela/releases)(Pixela.gs file).

### Step to add library to your Google Apps Script project

1. Select `Resources > Libraries...`.
2. Paste in the project key of the library ( Project ID: `1lYZA6IF2D62qUb3prkWH4UX5zLEaqy1VrbU2jOwHM3hdjkl7gG3nh33Y` ) into the `Add a Library` text box.
3. Click `Add` to the library to your project.
4. Click the `Version` dropdown and select a version of this library.
5. Click `Save` to save the libraries you have added and close the dialog box.

Google Apps Script provides other features (such as Changing default Identifier) that I wrote before, please see [Managing a Libraries - Google Apps Script](https://developers.google.com/apps-script/guides/libraries#managing_libraries) for more detail.


## Synopsis

NOTE: Following usages omit expection handling. But Pixela methods raise exception from Google Apps Script `UrlFetchApp()` and `JSON.parse()` function when HTTP request failed. So you add exeption handling code to following codes as necessary. 

### Create user (just one time)

First, create pixe.la user.

```
var pixela = Pixela.create(USERNAME, TOKEN);
var reponse = pixela.createUser();

if (!response.isSuccess) {
    Logger.log("request failed: " + response.message);
    return;
}
```

After you create pixe.la user, I recommend to save `USERNAME` and `TOKEN` to the Google Apps Script [Properties](https://developers.google.com/apps-script/guides/properties).

For example, you save `USERNAME` and `TOKEN` to script properties. Then you can call those following code.

```
var username = PropertiesService.getScriptProperties().getProperty("USERNAME");
var token    = PropertiesService.getScriptProperties().getProperty("TOKEN");
```
You can hide your `USERNAME` and `TOKEN` on the code for security matters.

### Create graph (just one time)

Second, create graph.

```
var pixela = Pixela.create(USERNAME, TOKEN);
var reponse = pixela.createGraph(GRAPH_ID GRAPH_NAME UNIT TYPE COLOR, TIMEZONE, SELF_SUFFICIENT);

if (!response.isSuccess) {
    Logger.log("request failed: " + response.message);
    return;
}
```

NOTE: some arguments are limited following values. (I'm sorry that I don't write validation code.) 

* `TYPE` : `int` or `float`
* `COLOR` : `shibafu`, `momiji`, `sora`, `ichou`, `ajisai` or `kuro`
* `TIMEZONE` : default is `UTC`

And then you can see graph page.

If your username is `foo` and graph name is `bar`, graph page url will be `https://pixe.la/v1/users/foo/graphs/bar`.

### Record quantity to graph

And last, this is daily work for recording quantity to graph.

You can also modify quantity same command. (because pixe.la `put-pixel` API create pixel when pixel has not create yet.)

```
var pixela = Pixela.create(USERNAME, TOKEN);
var reponse = pixela.updatePixel(GRAPH_ID, DATE, QUANTITY, [OPTIONAL_DATA]);

if (!response.isSuccess) {
    Logger.log("request failed: " + response.message);
    return;
}
```

NOTE: some arguments are limited following values. (I'm sorry that I don't write validation code.)

* `DATE` : format is yyyyMMdd
* `OPTIONAL_DATA` : format is json up to 10KB (you can pass to argument by Javascript object.)


## License

This program is distributed under the MIT License. see LICENSE for more information.


## Author

[noissefnoc](noissefnoc@gmail.com)
