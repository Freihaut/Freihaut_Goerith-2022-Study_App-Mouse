/*
Reshows the Tutorial when the participant clicks on the option in the system Tray
 */

import React, { Component } from 'react';
const {ipcRenderer} = require("electron");

import SelfReport from "./SelfReport";
import MouseTask from "./MouseTask";
import AppStartPage from "./AppStartPage";


export default class ReshowAppInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {page: "infoPage"}
    }

    switchPage(page) {
        this.setState({page: page})
    }

    renderTutorialPage(state) {

        if (state === "infoPage") {
            return (<AppStartPage tutorial={false} endCurrentPage={() => this.switchPage("task")}/>)
        } else if (state === "task") {
            return (<MouseTask intro={true}
                               endTask={() => this.switchPage("selfReport")}
                               mouseTaskSize={this.props.mouseTaskSize}/>)
        } else if (state === "selfReport") {
            return (<SelfReport intro={true}
                                buttonText={"Fenster schließen"}
                                endReport={() => ipcRenderer.send("close")}/>)
        }
    }

    render() {

        return(
            <div style={{display: "flex", alignItems: "center", height: "100vh"}}>
                <div style={{margin: "auto"}}>
                    <nav className="navbar is-fixed-top is-expanded" role="navigation" aria-label="main navigation">
                        <div className={"tabs is-small is-toggle is-fullwidth"}>
                            <ul>
                                <li className={this.state.page === "infoPage" ? "is-active" : ""}>
                                    <a onClick={() => this.switchPage("infoPage")}>
                                        <span>1. Studien-App Infos</span>
                                    </a>
                                </li>
                                <li className={this.state.page === "task" ? "is-active" : ""}>
                                    <a onClick={() => this.switchPage("task")}>
                                        <span>2. Vorschau Aufgabe</span>
                                    </a>
                                </li>
                                <li className={this.state.page === "selfReport" ? "is-active" : ""}>
                                    <a onClick={() => this.switchPage("selfReport")}>
                                        <span>3. Vorschau Fragen</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                    </nav>
                    <div>
                        {this.renderTutorialPage(this.state.page)}
                    </div>
                </div>
            </div>
        )
    }
}