/*
This function component renders the end page that shows that the study has ended
 */

import React from 'react';
import ParticipationCredit from "./ParticipationCredit";
import EndPage from "./EndPage";


export default function StudyEnd (props) {

    // scroll to the top of the page
    window.scrollTo(0, 0);

    return(

        <div style={{display: "flex", alignItems: "center", height: "100vh"}}>
            <div style={{margin: "auto"}}>
                {props.endPage ? <EndPage/> : <ParticipationCredit savingAttempt={props.savingAttempt}
                                                                   savingFailed={props.savingFailed}
                                                                   collectCredit={(bool) => props.collectCredit(bool)}/>}
            </div>
        </div>
    )

}