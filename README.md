## Study-App

This repository contains the study-app that was used for a longitudinal study about the relationship between stress and 
computer mouse usage.

### Study-App Description

The study-app needs to be installed by participants and logs participants computer mouse usage as well as their stress 
level in frequent intervals of about 60 minutes. The computer mouse positional data on the screen
is logged every 20 milliseconds for 5 minutes prior to each measurement interval. Each interval includes
a standardized point-and-click task before participants are  asked to rate their valence and arousal on self-report scales.

Before the start of the measurement intervals, the study-app preceeds with a tutorial about the study-app.
The study duration is 14 days. The study-app will notify participants about the study end and will stop data measurement.

### Technical Information

The study-app is an [electron.js](https://www.electronjs.org/) desktop app and uses [React.js](https://reactjs.org/) for 
building the user interface. We used [Electron Forge](https://www.electronforge.io/) as the boilerplate to build the app
as well as [Electron Builder](https://www.electron.build/) to package the app as an .exe for windows or .dmg for Mac.

The backend for saving our data is [Firebase](https://firebase.google.com/). If the participant is not online, the study-app
saves all data locally and pushes the data into the database once the participant is online again.

