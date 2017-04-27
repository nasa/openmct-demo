# Open MCT Live Demo

__NOTE__: This demo is available online at https://openmct-demo.herokuapp.com. This guide is intended for those wishing to setup and run the Open MCT demo locally. 

## Dependencies
The Open MCT demo depends on [node.js](https://nodejs.org/en/). Life is also easier with [git](https://git-scm.com/downloads), but it's not a requirement for installing and running the demo.

## Setup and Installation
Either download or clone the `openmct-demo` repository. Git is the preferred way of working with the Open MCT Demo repository, but it's not a requirement to get the demo running. If you're using git, the steps necessary to download and install the Open MCT demo are included below

```
git clone https://github.com/nasa/openmct-demo.git
cd openmct-demo
npm install
npm start
```

If you're not using git, you can download a [zip of the repository](https://github.com/nasa/openmct-demo/archive/master.zip) and after unzipping it and switching to the directory it was unzipped to, run `npm install` and `npm start`.

## Overview
This is a functional demo of the [Open MCT](https://github.com/nasa/openmct) mission operations framework using a combination of real and mock data. The real data is historical weather data taken from the REMS instrument on the Curiosity rover, which is kindly made available via a web service provided by the Centro de Astrobiología of the Spanish National Research Council, to whom we are eternally grateful http://cab.inta-csic.es/rems/wp-content/plugins/marsweather-widget/api.php

## Dependency on Open MCT Tutorials
This demo depends on the [Open MCT Tutorial](https://github.com/nasa/openmct-tutorial) project. The demo reuses the realtime and historical servers and their associated adapters, but uses a customized dictionary and spacecraft object. This dependency should be considered when making significant code changes to the tutorials.
