# inread-vast-video

Main file: app.js

This component waiting for js Window.postMessage() to arrive from some Ad unit. This message should contain Vast ID. Afterwards VAST file is fetched from the server. Afterwards HTML5 video is inserted into the page and set by the data from VAST file.
