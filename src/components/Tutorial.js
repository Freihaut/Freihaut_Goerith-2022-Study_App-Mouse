/*
This file handles the tutorial, which is shown when the app is first started after installation
and optionally when the participant wants to see it again by clicking on the info option on tray icon
 */

import React, { Component } from 'react';

import SelfReport from "./SelfReport";
import MouseTask from "./MouseTask";
import AppStartPage from "./AppStartPage";
import Sociodemographics from "./Sociodemographics";


export default class Tutorial extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page: "welcome",
            hasEnded: false,
            socioDemographics: {
                age: -99,
                sex: -99,
                hand: -99,
            }
        }
    }

    switchPage(page) {

        this.setState({page: page})
    }

    // if a user makes an entry in the socidem questions update the state with the new entry
    // the sociodem data is passed into and handled in the tutorial component to save the answers if the user moves
    // away from the sociodem page
    handleSocioDemInput(socioDemData){

        this.setState({
            socioDemographics: {...this.state.socioDemographics, ...socioDemData}
        })
    }

    endTutorial() {

        this.setState({
            hasEnded: true
        }, () => {
            this.props.endTutorial({"Sociodemographics": this.state.socioDemographics})
        })

    }

    renderTutorialPage(state) {

        if (state === "welcome") {
            return (<AppStartPage tutorial={true} endCurrentPage={() => this.switchPage("task")}/>)
        } else if (state === "task") {
            return (<MouseTask intro={true}
                               endTask={() => this.switchPage("selfReport")}
                               mouseTaskSize={this.props.mouseTaskSize}/>)
        } else if (state === "selfReport") {
            return (<SelfReport intro={true}
                                buttonText={"Weiter"}
                                endReport={() => this.switchPage("sociodem")}/>)
        } else if (state === "sociodem") {
            return (<Sociodemographics answers={this.state.socioDemographics}
                                       hasEnded={this.state.hasEnded}
                                       inputChange={(data) => this.handleSocioDemInput(data)}
                                       endSociodem={() => this.endTutorial()}/>)
        }
    }

    render() {

        return(
            <div>
                <div style={{display: "flex", alignItems: "center", height: "100vh"}}>
                    <div style={{margin: "auto"}}>
                        <nav className="navbar is-fixed-top is-expanded" role="navigation" aria-label="main navigation">
                                <div className={"tabs is-small is-toggle is-fullwidth"}>
                                    <ul>
                                        <li className={this.state.page === "welcome" ? "is-active" : ""}>
                                            <a onClick={() => this.state.hasEnded ? null : this.switchPage("welcome")}>
                                                <span>1. Studien-App Infos</span>
                                            </a>
                                        </li>
                                        <li className={this.state.page === "task" ? "is-active" : ""}>
                                            <a onClick={() => this.state.hasEnded ? null : this.switchPage("task")}>
                                                <span>2. Vorschau Aufgabe</span>
                                            </a>
                                        </li>
                                        <li className={this.state.page === "selfReport" ? "is-active" : ""}>
                                            <a onClick={() => this.state.hasEnded ? null : this.switchPage("selfReport")}>
                                                <span>3. Vorschau Fragen</span>
                                            </a>
                                        </li>
                                        <li className={this.state.page === "sociodem" ? "is-active" : ""}>
                                            <a onClick={() => this.state.hasEnded ? null : this.switchPage("sociodem")}>
                                                <span>4. Studienstart</span>
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
            </div>

        )
    }

}