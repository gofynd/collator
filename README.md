# Collator

Collator is a multi - API testing suite to compare responses from different inputs on a single grid. Just pass the params list for rows and columns and get a UI for comparison across all the combinations of those params. This suite is especially useful for machine learning tasks where images or other visual data are needed to compare to take parameter decisions. Config and make templates for easy testing of your APIs.

## Usage:

* Users have to input url and fields either manually or using a saved template.
* If auth is required, a dialog box will appear to authenticate.
* Fields or params are fed in two parts:
    * Row: List of values that will be displayed vertically in the grid. It is under 'Image Urls' in below diagram, but could be any params list.
    * Columns: Dictionary of remaining params with list of values to be permuted. It is under 'Params' field in below diagram.
* Users can see the resulting grid before hitting all the apis.

![Alt text](/src/assets/color_segmentation_screenshot.jpg?raw=true "Title")

![Alt text](/src/assets/visual_similarity_screenshot.jpg?raw=true "Title")

* On hitting 'Query', all the combinations of params are formatted as payload to the api and requested to the server.
* One of the response is presented to the user. User can choose predefined fields like Images, Colors or Text to be displayed, or he can write his own method to format the resulting cell.
* On hitting 'Query and append', new rows will be appended.


## Further Improvements:

* Currently only images, colors and text is supported as display elements. More elements to be added.
* Button to save a request
* Button to minimize the form panel
* Adding response time and failure logs on cells


## Installation

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
