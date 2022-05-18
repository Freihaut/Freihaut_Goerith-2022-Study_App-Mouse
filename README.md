## Study-App

This repository contains the Study-App that was used for a longitudinal study about the relationship between emotional
states and computer mouse usage.

### Study-App Description

After installation, the Study-App logged participants computer mouse usage as well as their emotional state ratings  
in frequent intervals of about 60 minutes. Computer mouse usage is logged in two conditions: (1) During participants
self-directed computer use and (2) in a standardized point-and-click task. Emotional states are measured using
two self-report questions asking about valence and arousal.

The Study-App is configured to handle the study process automatically. After installation, it automatically starts
a tutorial. After finishing the tutorial, the Study-App sleeps for an hour before starting a data collection (logging
the self-directed mouse usage and opening a window with the point-and-click task and the self-report items). The
Study-App automatically starts after the computer is restarted. The study duration is 14 days. After this limit,
the Study-App notifies participants about the end of the study and does not collect any data anymore.

The use of the Study-App required a login, which was sent to participants after agreeing to participate. All data is
saved anonymously.

### Technical Information

The Study-App is an [electron.js](https://www.electronjs.org/) desktop app and uses [React.js](https://reactjs.org/) for 
building the user interface. We used [Electron Forge](https://www.electronforge.io/) as the boilerplate to build the app
as well as [Electron Builder](https://www.electron.build/) to package the app as an .exe for windows or .dmg for Mac.

The backend for saving our data is [Firebase](https://firebase.google.com/). If the participant is not online, the Study-App
saves all data locally and pushes the data into the database once the participant is online again.

### Contact

For questions regarding the Study-App, contact: paul.freihaut@psychologie.uni-freiburg.de

