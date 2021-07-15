// core imports
const { app, BrowserWindow, Menu, Tray, ipcMain, screen, dialog, Notification } = require('electron');
const dataStorage = require("electron-json-storage");

// paths
const path = require('path');

const macIcon = "Mac-App-Icon.png";
const macTrayIcon = "mac-tray-icon.png";

const macIconPath = path.join(__dirname, macIcon);
const macTrayIconPath = path.join(__dirname, macTrayIcon);


// check if the tutorial has finished
let tutorialHasFinished = false;

// primary instance lock (dont allow app to open a second time)
let mainWindow = null;
const gotTheLock = app.requestSingleInstanceLock();

// declare system tray variable
let tray = null;

// initialize an empty variable for logging the mousePositions (will be set to an interval later)
let logMousePosition;

// on mac, put the app in the autostart, on windows, the auto start is handled with a installer script
// (installer.nsh file) to remove remainders of the app from the windows system
app.setLoginItemSettings({
    openAtLogin: true
  });


// function to create the app window in which the app is shown
const createWindow = (appPage, data) => {

  console.log("Trying to open a Window");

  // get the screen size without the taskbar
  const screenSize = screen.getPrimaryDisplay().workAreaSize;

  // always make a window size that takes up 85% of the screen height (or width if the screen is turned)
  // choose the smaller value (height or width) and set the target size to that value to make sure that the targetSize
  // always fits on the screen
  let targetSize;
  if (screenSize.width > screenSize.height) {
    targetSize = screenSize.height;
  } else {
    targetSize = screenSize.width;
  }

  // let the browser window target take up 85% of the available screen size
  targetSize = Math.floor(targetSize * 0.85);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: targetSize, // old fixed values: 800 or 900
    height: targetSize, // old fixed values: 775 or 875
    resizable: false,
    show: false,
    icon: macIconPath,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  // get and log some infos about how the browser window is displayed on the screen
  const zoomFactor = screen.getPrimaryDisplay().scaleFactor;
  const windowBounds = mainWindow.getBounds();
  const windowOnDisplay = null;

  // do not show a menu in the app
  mainWindow.setMenu(null);

  // load the entrypoint index.html of the app
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // send a message to the page to load the correct component and show the main window after it finished loading
  // in the electron docs, ready-to-show is recommended for showing the main window, but IPC communication to the
  // main window does not work with "ready-to-show"
  mainWindow.webContents.on("did-finish-load", () => {
    // send the info about which page to render and the infos about the screen (how the window is displayed on the screen)
    mainWindow.webContents.send("appPageToRender", appPage, {zoom: zoomFactor,
      screenSize: screenSize, windBounds: windowBounds, windOnDisp: windowOnDisplay}, data);
    // show the window
    mainWindow.showInactive();

    // resizes the browser window when the browser window is dragged into another display with a different zoom level
    // (etc. from a laptop to a desktop monitor)
    mainWindow.on("move", () => {
      // get the display the browser window is in
      const display = screen.getDisplayNearestPoint(
          {x: mainWindow.getBounds().x, y: mainWindow.getBounds().y});

      let newSize;
      if (display.workAreaSize.width > display.workAreaSize.height) {
        newSize = Math.floor(display.workAreaSize.height * 0.85)
      } else {
        newSize = Math.floor(display.workAreaSize.width * 0.85)
      }

      // need to manually setResizable to true and false when resizing, because it wont work otherwise when the resizable
      // option is turned off
      if (newSize !== targetSize) {
        targetSize = newSize;
        mainWindow.setResizable(true);
        mainWindow.setSize(targetSize, targetSize);
        mainWindow.setResizable(false);
        mainWindow.webContents.send("resizedWindow", targetSize);
      }

    })

    // if it the browser window is the logger
    if (appPage === "logger") {
      // send a windows notification that the logger started
      const notificationTitle = "Studien-App Datenerhebung";
      const notificationBody = "Die Studien-App hat ein Fenster zur Datenerhebung geöffnet. Herzlichen Dank für Ihre Teilnahme!"

      new Notification({title: notificationTitle, body: notificationBody, silent: false}).show();
    }
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // conditionally add event listeners to the Browser window instance
  if (appPage === "logger") {

    mainWindow.on("closed", () => {
      // clear the interval of the mousePositionLogger (if the participant closes the logger window without participating
      clearInterval(logMousePosition);
      // remove the event listener in the start logger function that listens for the task start to send the last 5 minutes
      // to the renderer process
      ipcMain.removeAllListeners("mouseTaskStarted");
      // after closing of a logger window, start the logging process again
      //TODO: Choose a time until the logger starts (90 minutes --> 85 silence + 5 min logging)
      startLogger(55 * 60 * 1000) })

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
        startLogger(55 * 60 * 1000);
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

    console.log("App is ready");

    // set AppUserModelId on Windows 10
    // process.platform !== "darwin" ? app.setAppUserModelId("freihaut.studien-app") : null;

    // create a system Tray Icon when the app is opened
    tray = new Tray(macTrayIconPath); // insert iconPath if icon is selected
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

    console.log("App wants to start");

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
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.close();
  }
})

// end of tutorial event
ipcMain.on("tutorialEnd", () => {
  // write a file to notify that the program has started and add a participant identifier
  const participantCode = Math.random().toString(36).substring(2);
  const window = BrowserWindow.getFocusedWindow();

  if (window) {
    dataStorage.set("started", { started: Date.now(), ident: participantCode }, function (error) {
      if (error) {
        // throw an error if the json save does not work (because the study wont work properly and show the tutorial again
        // on app restart
        throw error;
      } else {
        tutorialHasFinished = true;
        window.close();
      }
    })
  }
})


// start to log mouse data in the main process for xx minutes and trigger an create Logger window event after another
// xx minutes
const startLogger = (startTime) => {

  // check if the startTime of the Browser window creation is after the time limit of the study (30 days)
  dataStorage.get("started", (err, data) => {
    // get the time difference in days between the start of the current date and the study start date
    let timeDiff = Math.floor((Date.now() - data.started) / 1000 / 60 / 60 / 24);
    // if the start time is older than xx days (length of the study), show the study end page
    //TODO: Set an end time of the study in days
    if (timeDiff > 14) {
      // show the study endPage and send the participant id
      createWindow("studyEnd", data.ident);
    } else {
      // if the study is not finished yet, start the logger Process

      // initialize a variable to store the free logged mouse data
      let mousePositions = [];

      // set a timeout that starts logging the mouse positions every 20 milliseconds after a chosen time (e.g. after
      // 85 minutes)
      setTimeout(() => {

        // start an interval that logs the cursor position every 20 milliseconds (or choose an alternative logging interval)
        // and push it into an array
        logMousePosition = setInterval(() => {
          mousePositions.push(Object.assign({}, screen.getCursorScreenPoint(), { "t": Date.now() }));
          // if the array is longer than 15.000 entries, always delete the first mouse Position after adding a new
          // mouse position to only keep the mouse Position data of the last 5 minutes
          // 5 minutes = 5 * 60 * 1000 = 300.000 milliseconds -> 15.000 datapoints if one datapoint is logged every 20ms
          if (mousePositions.length > 15000) {
            mousePositions.shift();
          }
        }, 20);
        // set another timeout that ends the cursor position logging and opens a browser window
        setTimeout(() => {
          // clearInterval(logMousePosition);
          createWindow("logger")
        },
          // stop recording mouse position data and open the data logger window after 5 minutes (or choose an alternative
          // interval)
          // TODO: set the time the mouse position logging starts prior to opening the logger window: minutes * 60 seconds * 1000 milliseconds
          5 * 60 * 1000)

        // add a listener that listens to the start of the mouse task and send the mouse data that was recorded until 5
        // minutes prior to the start into the renderer process
        ipcMain.once("mouseTaskStarted", (event) => {
          // clear the mouse logging interval
          clearInterval(logMousePosition);
          // console.log("Logging ended with " + String(mousePositions.length) + " mouse datapoints");
          // send the logged mouse position data into the renderer process
          event.reply("sendMousePositionData", mousePositions);
        })

      }, startTime);

    }
  });
}
