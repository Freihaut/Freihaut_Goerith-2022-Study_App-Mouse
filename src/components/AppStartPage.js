/*
This function component renders the start page of the app introduction when participants first open the app
 */

import React from 'react';
// import the task-symbol image
import TaskSymbolImage from "./base64Images/TutorialImage";
// import the App Symbol Image
import AppSymbolImage from "./base64Images/AppSymbolImage";
// import the close Symbol Image
import CloseSymbolImage from "./base64Images/CloseSymbol";


export default function AppStartPage (props) {

    // scroll to the top of the page
    window.scrollTo(0, 0);


   return(
       <div className="section" style={{marginTop: "1.5rem"}}>
           <div className={"content"}>
               {props.tutorial ?
                   <div>
                       <h3 className={"title is-4"}>
                           Willkommen zur Einführung über den Ablauf der Studie
                       </h3>
                       <p>
                           Diese Einführung beinhaltet vier Schritte. Sobald Sie alle vier Schritte der Einführung
                           abgeschlossen haben, beginnt die Studie. Bitte lesen Sie sich alle Informationen aufmerksam durch.
                       </p>
                       <br/>
                   </div>:
                   null}
               <h4>
                   Schritt 1: Allgemeine Informationen zur Studien-App
               </h4>
               <p>
                   Während Sie an der Studie teilnehmen und solange die Studien-App ausgeführt wird, öffnet die Studien-App in
                   regelmäßigen Zeitabständen von 60 Minuten ein Fenster zur Datenerhebung. Die Datenerhebung umfasst zwei Teile und dauert
                   etwa 30 Sekunden. Im ersten Teil geht es darum, eine Aufgabe zu bearbeiten. Im zweiten Teil werden Sie gebeten, Fragen zu beantworten.
                   Beide Teile werden Ihnen in Schritt 2 und Schritt 3 dieser Einführung genauer erläutert.
               </p>
               <p>
                  Die Datenerhebung über die Studien-App erfolgt automatisch, ohne, dass Sie aktiv eingreifen müssen. Dafür wird die
                   Studien-App automatisch ausgeführt. Bei Start dieses Computers wird die Studien-App ebenfalls automatisch gestartet.
                   Solange die Studien-App ausgeführt ist,
                   sehen Sie das <strong>Studien-App Symbol</strong>
                   &nbsp;<img style={{width: "20px", height: "20px"}} src={AppSymbolImage}/> in Ihrer <strong><i>{process.platform === "darwin" ? "Menüleiste" : "Systemleiste"}</i></strong> (siehe Bild).
               </p>
               <p>
                   Falls Sie die automatische Ausführung der Studie unterbrechen möchten, können die Studien-App manuell beenden, in dem Sie auf dieses
                   Studien-App Symbol klicken und dann "Studien-App beenden" auswählen.
                   Um die Studien-App nach dem Beenden manuell wieder zu starten, klicken Sie auf das <strong>Studien-App Symbol</strong>
                   &nbsp;<img style={{width: "20px", height: "20px"}} src={AppSymbolImage}/> auf Ihrem <strong><i>Desktop</i></strong>.
                   Über das Studien-App Symbol in der <strong><i>{process.platform === "darwin" ? "Menüleiste" : "Systemleiste"}</i></strong> können Sie außerdem jederzeit
                   diese Informationen zur Studien-App erneut aufrufen.
               </p>

               <figure className="image">
                   <img src={TaskSymbolImage} style={{"border": "1px solid black", "borderTopStyle": "none",
                       "borderBottomStyle": "none"}}/>
                   <figcaption>
                       Das Studien-App Symbol in Ihrer {process.platform === "darwin" ? "Menüleiste" : "Systemleiste"} zeigt, dass die Studien-App gestartet ist. Durch Klicken auf das Studien-App
                       Symbol können Sie Optionen aufrufen, um die Studien-App zu beenden oder die Informationen zur Studien-App
                       erneut anzuzeigen.
                   </figcaption>
               </figure>

               <p>
                   Wenn die Studien-App ein Fenster zur Datenerhebung öffnet und Sie dieses mal nicht an der Datenerhebung teilnehmen möchten oder können,
                   schließen Sie das Fenster mit dem <strong>Schließen Symbol</strong> <img style={{height: "13px"}} src={CloseSymbolImage}/> Das
                   Auslassen einer Datenerhebung beendet nicht Ihre Studienteilnahme.
               </p>
               <p>
                   Die Studie endet automatisch 14 Tage nachdem Sie die Studie in Schritt 4 gestartet haben.
                   Die Studien-App zeigt Ihnen an, dass die Datenerhebung beendet ist
                   und es öffnet sich danach kein Fenster zur Datenerhebung mehr.
               </p>
               <p>
                   Nach dem Ende der Studie oder falls Sie Ihre Studienteilnahme vorzeitig beenden möchten, können Sie die
                   Studien-App deinstallieren.
               </p>
               <p>
                   Bei weiteren Fragen zur Studien-App wenden Sie sich an:
               </p>
               <p>
                   Paul Freihaut, M.Sc. <br/>
                   Universität Freiburg <br/>
                   Wirtschaftspsychologie <br/>
                   E-Mail: <a href={"mailto:paul.freihaut@psychologie.uni-freiburg.de"}>paul.freihaut@psychologie.uni-freiburg.de</a>
               </p>

               <br/>
               <div className="control" style={{width: "100%", textAlign: "center"}}>
                   <button className={"button is-link"} onClick={() => props.endCurrentPage()}>Weiter</button>
               </div>
           </div>
       </div>
   )

}