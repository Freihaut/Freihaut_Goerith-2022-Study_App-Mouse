/*
This function component renders the end page that shows that the study has ended
 */

import React from 'react'
const {ipcRenderer} = require("electron");


export default function StudyEnd (props) {

    // scroll to the top of the page
    window.scrollTo(0, 0);

    return(

        <div style={{display: "flex", alignItems: "center", height: "100vh"}}>
            <div style={{margin: "auto"}}>
                <nav className="navbar is-fixed-top is-expanded is-info" role="navigation" aria-label="main navigation">
                </nav>
                <div className="section" style={{maxWidth: "900px"}}>
                    <div className={props.zoom > 1 ? "content is-medium": "content"}>
                        <h3>
                            Die Datenerhebung ist beendet
                        </h3>
                        <p>
                            Sehr gehrte Teilnehmerin, sehr geehrter Teilnehmer,
                        </p>
                        <p>
                            Die Studie ist beendet und die Datenerhebung mit der Studien-App ist abgeschlossen. Die Studien-App
                            erfüllt nun kein Zweck mehr und Sie können die Studien-App deinstallieren.
                        </p>
                        <h4>
                            Vielen herzlichen Dank für ihre Teilnahme an dieser Studie und Ihren Beitrag zur Wissenschaft!
                        </h4>
                        <br/>
                        <p>
                            Falls Sie noch Rückfragen zu der Studie oder der Studien-App haben, können Sie mich
                            gerne kontaktieren.
                        </p>
                        <p>
                            Paul Freihaut, M.Sc. <br/>
                            Universität Freiburg <br/>
                            Wirtschaftspsychologie <br/>
                            Engelbergerstraße 41 <br/>
                            D-79085 Freiburg <br/>
                            E-Mail: <a href={"mailto:paul.freihaut@psychologie.uni-freiburg.de"}>paul.freihaut@psychologie.uni-freiburg.de</a>
                        </p>
                        <br/>
                        <div className="control" style={{width: "100%", textAlign: "center"}}>
                            <button className={props.zoom > 1 ? "button is-link is-medium": "button is-link"}
                                    onClick={() => ipcRenderer.send("close")}>
                                Studien-App beenden
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )

}