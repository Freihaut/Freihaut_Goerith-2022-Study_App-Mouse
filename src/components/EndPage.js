/*
This function component renders the end page that shows that the study has ended
 */

import React from 'react'
const {ipcRenderer} = require("electron");


export default function StudyEnd () {

    // scroll to the top of the page
    window.scrollTo(0, 0);

    return(

        <div className="section">
            <div className={"content"}>
                <h3>
                    Die Studie ist beendet
                </h3>
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
                    <button className={"button is-link"}
                            onClick={() => ipcRenderer.send("close")}>
                        Studien-App beenden
                    </button>
                </div>

            </div>
        </div>
    )

}