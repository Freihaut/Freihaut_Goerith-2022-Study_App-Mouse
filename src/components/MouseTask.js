import React, { Component } from 'react';
const {ipcRenderer} = require("electron");

// import the mouse Tracker
import MouseTracker from "./MouseTracker";

// import the mouse task image
import MouseTaskImage from "./base64Images/MouseTaskImage";

export default class MouseTask extends Component {

    constructor(props) {

        super(props);

        this.state={
            modal: this.props.intro ? "modal is-active" : "modal",
            clickedCircles: 0,
            mouseTaskSize: Math.floor(this.props.mouseTaskSize * 0.77)
        }

        // hold all possible 25 task order coordinates in a variable (they were randomly generated with the constraint
        // that they had to fit without overlap and then hard coded here)
        const allClickOrders = [
            [15, 12, 7, 9, 2, 4, 8], [6, 4, 13, 2, 0, 14, 9], [7, 3, 12, 13, 4, 2, 14], [12, 14, 11, 9, 3, 5, 10],
            [15, 9, 13, 10, 4, 2, 8], [13, 8, 6, 12, 3, 14, 9], [0, 6, 3, 7, 12, 1, 15], [1, 6, 3, 4, 14, 8, 11],
            [0, 9, 12, 4, 8, 1, 3], [7, 3, 8, 11, 1, 2, 13], [15, 6, 10, 12, 0, 9, 1], [9, 10, 6, 4, 3, 0, 8],
            [3, 14, 1, 5, 12, 9, 2], [4, 14, 13, 5, 3, 11, 10], [10, 7, 0, 6, 13, 14, 8], [15, 1, 11, 12, 7, 9, 6],
            [9, 13, 2, 3, 14, 4, 15], [14, 7, 0, 6, 4, 2, 1], [3, 7, 1, 10, 13, 12, 6], [2, 14, 7, 1, 5, 0, 6],
            [8, 10, 3, 2, 5, 13, 15], [3, 2, 4, 6, 8, 9, 13], [15, 3, 2, 12, 14, 5, 4], [8, 2, 13, 7, 3, 9, 10],
            [3, 11, 12, 5, 0, 4, 1]
        ]

        // getting a random number var randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        // return a random number between 0 and 24
        this.randomNumber = Math.floor(Math.random() * 25);

        // select a randomly chosen click order from all 25 possible click orders
        this.clickOrder = allClickOrders[this.randomNumber];

        // "naive" media check to test if a mouse is connected (does not reliably detect if the task was done with a
        // mouse or not!
        this.noMouseConnected = window.matchMedia('not (pointer: fine), not (hover: hover)').matches;

        // settings for the modal if its the task intro and the modal is triggered
        if (this.props.intro) {
            document.body.classList.add("is-clipped");
        }

        // initialize an Array to store the task mouse datapoints
        this.mouseTaskData = [];

        // initialize a variable that stores the main process mouse position data
        this.mainProcesesMouseData = null;

        // add a listener that grabs the main process mouse data
        ipcRenderer.once("sendMousePositionData", (event, data) => {
            this.mainProcesesMouseData = data;
        })

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.mouseTaskSize !== this.props.mouseTaskSize) {
            this.setState({mouseTaskSize: Math.floor(this.props.mouseTaskSize * 0.77)});
        }
    }


    circleClicked(num) {

        // if the participant clicks on the correct circle, go to the next circle
        if (num === this.clickOrder[this.state.clickedCircles]) {
            this.setState({clickedCircles: this.state.clickedCircles + 1}, () => {
                if (this.state.clickedCircles === 1) {
                    // tell the main process to stop recording mouse positions
                    ipcRenderer.send("mouseTaskStarted");
                } else if (this.state.clickedCircles === this.clickOrder.length) {
                    // end the task and send the task mouse data as well the info about the connected input device
                   setTimeout(() => this.props.endTask({
                       mTaskData: this.mouseTaskData,
                       mFreeUseData: this.mainProcesesMouseData,
                       noMouseCon: this.noMouseConnected,
                       taskInf: {
                           clickOrd: this.clickOrder,
                           taskNum: this.randomNumber
                       }
                       }), 1250);
                }
            });
        } else {
            // if the wrong circle is clicked, do nothing
        }
            };

    // add the info about which circle was clicked last to the data: keep the string as short as possible to save data
    onMouseEvent(datapoint) {
        const taskInfo = {
            cN: this.state.clickedCircles
        }

        Object.assign(datapoint, taskInfo);

        this.mouseTaskData.push(datapoint);
    }


    // instruction modal to explain the task in the tutorial
    renderInstruction() {

        return (

            <div className={this.state.modal} style={{textAlign: "left"}}>
                <div className="modal-background">{null}</div>
                <div className="modal-content">
                    <header className="modal-card-head">
                        <p className="modal-card-title"><b>Schritt 2: Vorschau der Aufgabe</b></p>
                    </header>
                    <section className="modal-card-body">
                            <div>
                                <div className="media">
                                    <div className="media-left" style={{display: "flex", alignSelf: "center"}}>
                                        <figure className="image" style={{width: "10rem"}}>
                                            <img src={MouseTaskImage}
                                                 alt={"Placeholder image"}
                                            />
                                        </figure>
                                    </div>
                                    <div className={"media-content"}>
                                        <p>
                                           Jede Datenerhebung beginnt mit der Aufgabe, 7 erscheinende Punkte in einer
                                            vorgegebenen Reihenfolge anzuklicken (siehe oberes Bild).
                                        </p>
                                        <br/>
                                        <p>
                                            Der Punkt, den Sie anklicken müssen, ist schwarz markiert. Wenn Sie den schwarz markierten Punkt
                                            angeklickt haben, wird dies angezeigt und Sie müssen den nächsten schwarzen
                                            Punkt anklicken (siehe unteres Bild) bis Sie alle schwarz markierten Punkte
                                            angeklickt haben.
                                        </p>
                                        <br/>
                                        <p>
                                            Die Aufgabe endet, sobald Sie alle schwarz markierten Punkte angeklickt haben.
                                        </p>
                                    </div>
                                </div>
                        </div>

                    </section>
                    <footer className="modal-card-foot">
                        <button className={"button is-link"} onClick={() => this.closeModal()}>Aufgabe starten</button>
                    </footer>
                </div>
            </div>
        )
    }

    // close the modal when the close modal button is pushed
    closeModal(){
        document.body.classList.remove("is-clipped");
        this.setState({
            modal: "modal"
        });
    }


    render() {

        // create the coordinates for the circles in the task (4 by 4 grid)
        let gridCoords = [];

        // define a start position of the point and the size of each step between two points
        // the start pos is 17,5% from the top and left side of the task box
        // the end pos is 17,5% from the top and right side of the task box
        // the steps fill up the space between the start circle and end circle equally
        const startPos = Math.floor(this.state.mouseTaskSize * 0.175);
        const step = Math.floor((this.state.mouseTaskSize - (2 * startPos)) / 3);

        // do a 4x4 loop and create the coordinates of each mouse circle in the task
        for (let i=1; i<5; i++) {
            for (let k=1; k<5; k++) {
                const xCoord = startPos + ((i%4) * step); // 70 * 120
                const yCoord = startPos + ((k%4) * step);
                gridCoords.push([xCoord, yCoord]);
            }
        }


        return(
            <div>
                <MouseTracker onEvent={(e) => this.onMouseEvent(e)}/>
                <div className="box" style={this.props.intro ? {marginTop: "3em"} : {}}>
                    <svg style={{width:String(this.state.mouseTaskSize), height:String(this.state.mouseTaskSize), border:"2px solid black"}}>
                        {/*Create the basic circles*/}
                        {gridCoords.map((coord, ind) => (
                            <circle cx={coord[0]} cy={coord[1]}
                                    r={String(Math.ceil(0.023 * this.state.mouseTaskSize)) + "px"}
                                    fill={this.clickOrder[this.state.clickedCircles] === ind ? "hsl(0, 0%, 21%)" :
                                        this.clickOrder.slice(0, this.state.clickedCircles).includes(ind) ? "hsl(217, 71%, 53%)" : "hsl(0, 0%, 86%)"}
                                    key={ind}
                                    style={{cursor: "pointer"}}
                                    onClick={() => this.circleClicked(ind)}
                            />
                        ))}

                        {/*Create the "activation circles around the basic circles to show if a circle was successfully clicked*/}
                        {gridCoords.map((coord, ind) => (
                            <circle cx={coord[0]} cy={coord[1]}
                                    r={String(Math.ceil(0.055 * this.state.mouseTaskSize)) + "px"}
                                    stroke="hsl(217, 71%, 53%)"
                                    strokeWidth={String(Math.ceil(0.006 * this.state.mouseTaskSize)) + "px"}
                                    fill="none"
                                    key={ind}
                                    visibility={this.clickOrder.slice(0, this.state.clickedCircles).includes(ind) ? "visible" : "hidden"}
                                    />
                        ))}
                        {/* Create connecting lines between the "activated circles*/}
                        {[...Array(this.clickOrder.length - 1)].map((coord, ind) => (
                            <line x1={gridCoords[this.clickOrder[ind]][0]}
                                  y1={gridCoords[this.clickOrder[ind]][1]}
                                  x2={gridCoords[this.clickOrder[ind + 1]][0]}
                                  y2={gridCoords[this.clickOrder[ind + 1]][1]}
                                  key={ind}
                                  stroke="hsl(217, 71%, 53%)"
                                  strokeWidth={String(Math.ceil(0.01 * this.state.mouseTaskSize)) + "px"}
                                  visibility={ind + 1 < this.state.clickedCircles ? "visible" : "hidden"}
                            />
                        ))}
                        {/*Create a check mark inside each target circle*/}
                        {this.clickOrder.map((gridNum, ind) => (
                            <path d={"M" + (gridCoords[gridNum][0] - 8).toString() + " "
                            + gridCoords[gridNum][1].toString() + " L"
                            + (gridCoords[gridNum][0] - 2).toString() + " " + (gridCoords[gridNum][1] + 6).toString() + " L"
                            + (gridCoords[gridNum][0] + 6).toString() + " " + (gridCoords[gridNum][1] - 6).toString()}
                                  stroke="white"
                                  strokeWidth={String(Math.floor(0.005 * this.state.mouseTaskSize)) + "px"}
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  fill="none"
                                  key={ind}
                                  className={this.state.clickedCircles === this.clickOrder.length ? "animatedCheckMark" : ""}
                                  visibility={this.state.clickedCircles === this.clickOrder.length ? "visible" : "hidden"}
                            />
                        ))}
                    </svg>
                </div>
                {this.renderInstruction()}
            </div>
        )
    }

}