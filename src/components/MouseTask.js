import React, { Component } from 'react';

// import the mouse Tracker
import MouseTracker from "./MouseTracker";

// import the mouse task image
import MouseTaskImage from "./base64Images/MouseTaskImage";

export default class MouseTask extends Component {

    constructor(props) {
        super(props);

        this.state={
            modal: this.props.intro ? "modal is-active" : "modal",
            clickedCircles: 0
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

        // create the coordinates for the circles in the task (4 by 4 grid)
        this.gridCoords = [];

        for (let i=1; i<5; i++) {
            for (let k=1; k<5; k++) {
                const xCoord = 80 + ((i%4) * 130); // 70 * 120
                const yCoord = 80 + ((k%4) * 130);
                this.gridCoords.push([xCoord, yCoord]);
            }
        }

        // "naive" media check to test if a mouse is connected (does not reliably detect if the task was done with a
        // mouse or not!
        this.noMouseConnected = window.matchMedia('not (pointer: fine), not (hover: hover)').matches;

        // initialize an Array to store the task mouse datapoints
        this.mouseData = [];

        // settings for the modal if its the task intro and the modal is triggered
        if (this.props.intro) {
            document.body.classList.add("is-clipped");
        }
    }


    circleClicked(num) {

        // if the participant clicks on the correct circle, go to the next circle
        if (num === this.clickOrder[this.state.clickedCircles]) {
            this.setState({clickedCircles: this.state.clickedCircles + 1}, () => {
                if (this.state.clickedCircles === this.clickOrder.length) {
                    // end the task and send the task mouse data as well the info about the connected input device
                   setTimeout(() => this.props.endTask({mouseTaskData: this.mouseData, noMouseConnected: this.noMouseConnected,
                   clickOrder: this.clickOrder, taskNumber: this.randomNumber}), 1250);
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

        this.mouseData.push(datapoint);
    }


    // instruction modal to explain the task in the tutorial
    renderInstruction() {

        return (

            <div className={this.state.modal} style={{textAlign: "left", fontSize: "18px"}}>
                <div className="modal-background">{null}</div>
                <div className="modal-content">
                    <header className="modal-card-head">
                        <p className="modal-card-title"><b>2. Vorschau der Aufgabe</b></p>
                    </header>
                    <section className="modal-card-body">
                            <div>
                                <div className="media">
                                    <div className="media-left">
                                        <figure className="image" style={{width: "175px"}}>
                                            <img src={MouseTaskImage}
                                                 alt={"Placeholder image"}/>
                                        </figure>
                                    </div>
                                    <div className="media-content">
                                        <p>
                                           Jede Datenerhebung beginnt mit der Aufgabe, eine Anzahl an Punkten in einer
                                            vorgegebenen Reihenfolge anzuklicken (siehe oberes Bild).
                                        </p>
                                        <br/>
                                        <p>
                                            Der Punkt, den Sie anklicken müssen ist schwarz markiert. Wenn Sie den schwarz markierten Punkt
                                            angeklickt haben, wird dies angezeigt und Sie müssen den nächsten schwarzen
                                            Punkt anklicken (siehe unteres Bild).
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
                        <button className="button is-link" onClick={() => this.closeModal()}>Aufgabe starten</button>
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


        return(
            <div>
                <MouseTracker onEvent={(e) => this.onMouseEvent(e)}/>
                <div className="box">
                    <svg style={{width:"550", height:"550", border:"2px solid black"}}>
                        {/*Create the basic circles*/}
                        {this.gridCoords.map((coord, ind) => (
                            <circle cx={coord[0]} cy={coord[1]}
                                    r="12"
                                    fill={this.clickOrder[this.state.clickedCircles] === ind ? "hsl(0, 0%, 21%)" :
                                        this.clickOrder.slice(0, this.state.clickedCircles).includes(ind) ? "hsl(217, 71%, 53%)" : "hsl(0, 0%, 86%)"}
                                    key={ind}
                                    style={{cursor: "pointer"}}
                                    onClick={() => this.circleClicked(ind)}
                            />
                        ))}

                        {/*Create the "activation circles around the basic circles to show if a circle was successfully clicked*/}
                        {this.gridCoords.map((coord, ind) => (
                            <circle cx={coord[0]} cy={coord[1]}
                                    r="35"
                                    stroke="hsl(217, 71%, 53%)"
                                    strokeWidth="5px"
                                    fill="none"
                                    key={ind}
                                    visibility={this.clickOrder.slice(0, this.state.clickedCircles).includes(ind) ? "visible" : "hidden"}
                                    />
                        ))}
                        {/* Create connecting lines between the "activated circles*/}
                        {[...Array(this.clickOrder.length - 1)].map((coord, ind) => (
                            <line x1={this.gridCoords[this.clickOrder[ind]][0]}
                                  y1={this.gridCoords[this.clickOrder[ind]][1]}
                                  x2={this.gridCoords[this.clickOrder[ind + 1]][0]}
                                  y2={this.gridCoords[this.clickOrder[ind + 1]][1]}
                                  key={ind}
                                  stroke="hsl(217, 71%, 53%)"
                                  strokeWidth="5px"
                                  visibility={ind + 1 < this.state.clickedCircles ? "visible" : "hidden"}
                            />
                        ))}
                        {/*Create a check mark inside each target circle*/}
                        {this.clickOrder.map((gridNum, ind) => (
                            <path d={"M" + (this.gridCoords[gridNum][0] - 8).toString() + " "
                            + this.gridCoords[gridNum][1].toString() + " L"
                            + (this.gridCoords[gridNum][0] - 2).toString() + " " + (this.gridCoords[gridNum][1] + 6).toString() + " L"
                            + (this.gridCoords[gridNum][0] + 6).toString() + " " + (this.gridCoords[gridNum][1] - 6).toString()}
                                  stroke="white"
                                  strokeWidth="3.5"
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