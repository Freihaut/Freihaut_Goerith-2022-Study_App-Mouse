import React, {useRef} from 'react';

import EndPage from './EndPage';

export default function Login (props) {

    const loginId = useRef(null);
    const loginPassword = useRef(null);


    return (
        <div style={{display: "flex", alignItems: "center", height: "100vh"}}>
            <div style={{margin: "auto"}}>
                {/*TODO: Set a hard coded study end date*/}
                {Date.now() > new Date(2021, 9, 27) ? <EndPage/>
                    :
                    <section className="section">
                        <div className="content">
                            <div className={"notification is-light is-info"}>
                                <h4 className="title">
                                    Herzlichen Dank für die Installation der Studien-App!
                                </h4>
                                <p>
                                    Um die Studie zu starten, melden Sie sich bitte mit Ihrem Zugangscode und -passwort an, welche
                                    Sie in der Einladungsmail zu dieser Studie erhalten haben (z.B. Zugangscode: GHB-7HG-KHL-4FS, Passwort: abc987).
                                </p>
                                <p>
                                    Beachten Sie, dass die Anmeldung nur bis einschließlich Mittwoch, den 06.10.21 freigeschalten ist. Falls Sie sich bis dahin
                                    nicht angemeldet haben, laufen Ihre Zugangsdaten ab und eine Teilnahme an der Studie ist nicht mehr möglich.
                                </p>
                                <p>
                                    Falls Sie sich bereits mit Ihren Zugangsdaten angemeldet haben und diese Nachricht erneut sehen, wurden
                                    Sie versehentlich abgemeldet. Bitte melden Sie sich erneut mit denselben Zugangsdaten an,
                                    um die Studie fortzusetzen. Eine erneute Anmeldung ist auch nach dem 06.10.21 möglich.
                                </p>
                                <form onSubmit={(event) => {event.preventDefault(); props.logIn(loginId.current.value + "@panel.de", loginPassword.current.value)}}>
                                    <div className="field">
                                        <div className="control">
                                            <p className={"help is-danger"} style={{visibility: props.badLogin ? "visible" : "hidden"}}>
                                                Die eingegebenen Zugangsdaten sind ungültig oder Sie sind nicht mit dem Internet verbunden.
                                                Bitte prüfen Sie, dass Sie die Zugangsdaten korrekt eingegeben haben und stellen Sie sicher, dass Sie mit dem Internet
                                                verbunden sind. Beachten Sie, dass Ihre Zugangsdaten zum 07.10.21 ablaufen, falls
                                                Sie sich bis dahin noch nicht angemeldet haben.
                                            </p>
                                            <input className={props.badLogin ? "input is-danger" : "input is-link"}
                                                   type="text" placeholder="Ihr Anmeldecode" ref={loginId}/>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="control">
                                            <input className={props.badLogin ? "input is-danger" : "input is-link"} type="password"
                                                   placeholder="Ihr Anmeldepasswort" ref={loginPassword}/>
                                        </div>
                                    </div>
                                    <div className={"field"}>
                                        <div className="control">
                                            <button className={props.loginAttempt ? "button is-link is-loading" : "button is-link"}
                                                    type="submit"
                                                    disabled={props.loginAttempt}>Anmelden
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                }
            </div>
        </div>
    );

}