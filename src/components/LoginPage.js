import React, {useRef} from 'react';

export default function Login (props) {

    const loginId = useRef(null);
    const loginPassword = useRef(null);


    return (
        <div style={{display: "flex", alignItems: "center", height: "100vh"}}>
            <div style={{margin: "auto"}}>
                <section className="section">
                    <div className="content">
                        <div className={"notification is-light is-info"}>
                            <h4 className="title">
                                Herzlichen Dank für die Installation der Studien-App.
                            </h4>
                            <p>
                                Um die Studie zu starten, melden Sie sich bitte mit Ihrem Zugangscode- und passwort an, welche
                                Sie in der Einladungsmail zu dieser Studie erhalten haben (z.B. Zugangscode: GHB-7HG-KHL, Passwort: xyz).
                            </p>
                            <p>
                                Falls Sie sich bereits mit Ihren Zugangsdaten angemeldet haben und diese Nachricht erneut sehen, wurden
                                sie vermutlich versehentlich abgemeldet. Bitte melden Sie sich erneut mit denselben Zugangsdaten an,
                                um die Studie fortzusetzen.
                            </p>
                            <form onSubmit={(event) => {event.preventDefault(); props.logIn(loginId.current.value + "@test.de", loginPassword.current.value)}}>
                                <div className="field">
                                    <div className="control">
                                        <p className={"help is-danger"} style={{visibility: props.badLogin ? "visible" : "hidden"}}>
                                            Die eingegebenen Zugangsdaten sind ungültig oder Sie sind nicht mit dem Internet verbunden.
                                            Bitte geben Sie Ihre Zugangsdaten erneut ein und stellen Sie sicher, dass Sie mit dem Internet
                                            verbunden sind.
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
            </div>
        </div>
    );

}