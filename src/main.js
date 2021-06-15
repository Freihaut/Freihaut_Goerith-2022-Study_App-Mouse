// core imports
const { app, BrowserWindow, Menu, Tray, ipcMain, screen, dialog } = require('electron');
const dataStorage = require("electron-json-storage");

// paths
const path = require('path');
const iconPath = path.join(__dirname, "Study-App-Icon.ico");

// check if the tutorial has finished
let tutorialHasFinished = false;

// primary instance lock (dont allow app to open a second time)
let mainWindow = null;
const gotTheLock = app.requestSingleInstanceLock();

// declare system tray variable
let tray = null;

// function to create the app window in which the app is shown
const createWindow = (appPage, data) => {

  // keep the window size in line with the scale Factor of the screen (always
  // show the electron browser window in the same scale on the screen)
  let factor = screen.getPrimaryDisplay().scaleFactor;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: Math.floor(800 / factor), //800
    height: Math.floor(775 / factor), // 775
    resizable: false,
    show: false,
    icon: iconPath,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  // do not show a menu in the app
  mainWindow.setMenu(null);

  // load the entrypoint index.html of the app
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // send a message to the page to load the correct component and show the main window after it finished loading
  // in the electron docs, ready-to-show is recommended for showing the main window, but IPC communication to the
  // main window does not work with "ready-to-show"

  mainWindow.webContents.on("did-finish-load", () => {
    // send the info about which page to render
    mainWindow.webContents.send("appPageToRender", appPage, data);
    // show the window
    mainWindow.showInactive();
    // set the zoom factor of the page (always show it the same, independent of the window zoom)
    mainWindow.webContents.setZoomFactor(1.0 / factor);
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // conditionally add event listeners to the Browser window instance
  if (appPage === "logger") {
    // after closing of a logger window, start the logging process again
    //TODO: Choose a time until the logger starts (90 minutes --> 85 silence + 5 min logging)
    mainWindow.on("closed", () => { startLogger(85 * 60 * 1000) })
  } else if (appPage === "tutorial") {
    // handle close events
    mainWindow.on("close", (ev) => {

      // show a Message box if the tutorial hasnt finished yet
      if (!tutorialHasFinished) {

        const message = dialog.showMessageBoxSync(
          mainWindow,
          {
            type: 'question',
            buttons: ['Studieneinführung weiterführen', 'Studieneinführung beenden'],
            title: 'Abbruch der Studieneinführung',
            message: 'Um die Studie zu beginnen, müssen Sie die Studieneinführung abschließen. Falls Sie dieses Fenster' +
              ' schließen, brechen Sie die Studieneinführung ab und beenden die Studien-App. Wollen Sie die Studieneinführung ' +
              'wirklich abbrechen und die Studien-App beenden?'
          });

        if (message === 1) {
          // if the user agrees to close the window
          app.exit();
        } else {
          ev.preventDefault();
        }
      } else {
        // start the logger if the tutorial window was closed because the participant finished the tutorial
        //TODO: Set a timer to start the logger after x minutes (90 minutes, 85 min silence + 5 min logging)
        startLogger(85 * 60 * 1000);
      }
    })
    // if the End Study Window is closed, close the study app
  } else if (appPage === "studyEnd") {
    mainWindow.on("close", (ev) => {
      app.quit();
    })
  }
};

// check if the app is running
if (!gotTheLock) {
  // if the app is already running, close the second window and focus the first window
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.on('ready', () => {

    // create a system Tray Icon when the app is opened
    tray = new Tray(iconPath); // insert iconPath if icon is selected
    // create a System Tray context menu
    const contextMenu = Menu.buildFromTemplate([
      // option to quit the app
      { label: "Studien-App beenden", click: () => { app.quit() } },
      // option to show the task tutorial again
      { label: "Studien-App Informationen anzeigen", click: () => { createWindow("reshowTut") } },
      // option to show the study information page
    ]);
    tray.setToolTip("Studien-App");
    tray.setContextMenu(contextMenu);
    tray.on("click", () => { tray.popUpContextMenu() })

    // Check if a file exists which indicates that the tutorial is finished and the study has started
    // -> if there is no such file (when the app is started for the first time), start the tutorial
    // -> if there is such a file (tutorial was finished), start the countdown timer for the logger

    // check if a json exists that indicates that the app has started
    dataStorage.has("started", function (error, hasKey) {
      // throw an error if the data reading fails
      if (error) throw error;
      // if the json exists, the user has finished the tutorial and is participating in the study
      if (hasKey) {
        // TODO: start the logger after 10 seconds (very shortly after the computer started with a short delay)
        startLogger(10 * 1000);
      } else {
        // if the json does not exist yet (user hasnt finished the tutorial), start the tutorial
        createWindow("tutorial");
      }
    })

  });

}

// From, the documents: The default electron behavior is to quit the app if all windows are closed unless, the
// window-all-closed event listener is called
app.on('window-all-closed', (event) => {
  // reset the mainWindow to null to prevent an error message that shows when the app is started but in the system tray
  // and the user clicks on the app symbol on the desktop
  mainWindow = null;
  // Do nothing: Program should still run with a app symbol in the system tray (from there, the app can be quit)
  event.preventDefault();
});

// In this file you can include the rest of your app's specific main process code.
// You can also put them in separate files and import them here.

// initialize a listener that closes the current browserWindow (listener is called from the renderer process)
ipcMain.on("close", () => {
  // close the current browser window
  BrowserWindow.getFocusedWindow().close();
})

// end of tutorial event
ipcMain.on("tutorialEnd", () => {
  // write a file to notify that the program has started
  dataStorage.set("started", { started: Date.now() }, function (error) {
    if (error) {
      // throw an error if the json save does not work (because the study wont work properly and show the tutorial again
      // on app restart
      throw error;
    } else {
      tutorialHasFinished = true;
      BrowserWindow.getFocusedWindow().close();
    }
  })
})


// start to log mouse data in the main process for xx minutes and trigger an create Logger window event after another
// xx minutes
const startLogger = (startTime) => {

  // check if the startTime of the Browser window creation is after the time limit of the study (30 days)
  dataStorage.get("started", (err, data) => {
    // get the time difference in days between the start of the current date and the study start date
    let timeDiff = Math.floor((Date.now() - data.started) / 1000 / 60 / 60 / 24);
    // if the start time is older than 30 days (length of the study), disable autostart and show the study end page
    if (timeDiff >= 30) {
      // show the study endPage
      createWindow("studyEnd");
    } else {
      // if the study is not finished yet, start the logger Process

      // initialize a variable to store the free logged mouse data
      let mousePositions = [];

      // set a timeout that starts logging the mouse positions after 5 seconds and then sets another timeout that ends
      // mouse logging after another 5 seconds and opens a browser window with the logger task
      setTimeout(() => {
        // start an interval that logs the cursor position every 20 milliseconds (or choose an alternative logging interval)
        // and push it into an array
        const logMousePosition = setInterval(() => {
          mousePositions.push(Object.assign({}, screen.getCursorScreenPoint(), { "time": Date.now() }));
        }, 20);
        // set another timeout that ends the cursor position logging and opens a browser window
        setTimeout(() => {
          clearInterval(logMousePosition);
          createWindow("logger", mousePositions)
        },
          // stop recording mouse position data and open the data logger window after 5 minutes (or choose an alternative
          // interval)
          // TODO: set interval to: minutes * 60 seconds * 1000 milliseconds
          5 * 60 * 1000)
      }, startTime);

    }
  });
}
