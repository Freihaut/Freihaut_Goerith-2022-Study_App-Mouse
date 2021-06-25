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
                <div className="section">
                    <div className={"content"}>
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
                            Falls Sie Psychologie an der Albert-Ludwigs Universität Freiburg studieren und für Ihre
                            Studienteilnahme Versuchspersonenstunden erhalten möchten, finden Sie hier einen
                            Code, mit dem Sie Ihre Studienteilnahme verifizieren können. Der Code wird unabhängig
                            von Ihren Daten gespeichert, sodass keine Zuordnung Ihrer Daten zu Ihrer Person möglich ist.
                            Um die Versuchspersonenstunden zu erhalten, tragen Sie Folgendes auf Ihrem Versuchspersonenzettel
                            ein und wenden Sie sich dann mit Ihrem Code an den Studienverantwortlichen, der Ihre Teilnahme verifiziert:
                        </p>
                        <p>
                            <strong>Datum:</strong> Das aktuelle Datum <br/>
                            <strong>Titel der Studie:</strong> Computernutzung und Stress <br/>
                            <strong>Dauer:</strong> 2 Stunden <br/>
                            <strong>Verantwortl. Dozent:</strong> Paul Freihaut
                        </p>
                        <h6>Ihr Versuchspersonencode: <i>{props.participantCode}</i></h6>
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
            </div>
        </div>
    )

}