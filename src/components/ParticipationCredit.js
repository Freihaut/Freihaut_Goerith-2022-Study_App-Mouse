import React, { Component } from 'react';


export default class ParticipationCredit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            checkVal: -99
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }


    componentDidMount() {
        window.scrollTo(0, 0);
    }

    handleInputChange(event) {

        // Get the name and value of the clicked radio button and save it to the corresponding question state
        const target = event.target;
        let value = parseInt(target.value);

        this.setState({checkVal: value})

    }

    render() {

        return(
            <div className="section" style={{marginTop: "1.5rem"}}>
                <div className={"content"}>
                    <h4>Geschafft!</h4>
                    <p>
                       Bevor Sie die Studie beenden und die Studien-App deinstallieren,
                        können Sie abschließend noch auswählen, ob Sie eine Vergütung für Ihre Studienteilnahme erhalten möchten.
                        Wählen Sie dazu eine der Optionen aus und bestätigen Sie Ihre Auswahl indem Sie auf "Vergütung bestätigen"
                        klicken.
                    </p>
                    <hr/>
                </div>

                <fieldset>
                    <div className={"field"}>
                        <label className={"radio"}>
                            <input
                                type={"radio"}
                                style={{marginRight: 5}}
                                name={"payment"}
                                value={"1"}
                                onChange={this.handleInputChange}
                            />
                            Ich spende meine Vergütung zurück an WiSoPanel
                        </label>
                    </div>
                </fieldset>

                <fieldset>
                    <div className={"field"} style={{marginTop: "2em"}}>
                        <label className={"radio"}>
                            <input
                                type={"radio"}
                                style={{marginRight: 5}}
                                name={"payment"}
                                value={"2"}
                                onChange={this.handleInputChange}
                            />
                           Ich möchte einen Amazon-Gutschein erhalten
                        </label>
                    </div>
                    <div className={"field"} style={{opacity: this.state.checkVal === 2 ? "1" : "0.5"}}>
                        <p>Der Amazon-Gutschein soll an folgende E-Mail Adresse gesendet werden:</p>
                        <div className="control" style={{maxWidth: "500px"}}>
                            <input className="input" type="text" placeholder="Ihre E-Mail Adresse" disabled={this.state.checkVal !== 2}/>
                        </div>
                        <p className={"help"}> Bitte achten Sie darauf eine gültige E-Mail Adresse anzugeben</p>
                    </div>
                </fieldset>

                <fieldset>
                    <div className={"field"} style={{marginTop: "2em"}}>
                        <label className={"radio"}>
                            <input
                                type={"radio"}
                                style={{marginRight: 5}}
                                name={"payment"}
                                value={"3"}
                                onChange={this.handleInputChange}
                            />
                            Ich möchte das Geld auf mein PayPal-Konto überwiesen haben
                        </label>
                    </div>
                    <div className={"field"} style={{opacity: this.state.checkVal === 3 ? "1" : "0.5"}}>
                        <p>Das Geld soll an folgende PayPal Adresse gesendet werden:</p>
                        <div className="control" style={{maxWidth: "500px"}}>
                            <input className="input" type="text" placeholder="Ihre E-Mail Adresse" disabled={this.state.checkVal !== 3}/>
                        </div>
                        <p className={"help"}> Bitte achten Sie darauf eine gültige E-Mail Adresse anzugeben</p>
                    </div>
                </fieldset>

                <fieldset>
                    <div className={"field"} style={{marginTop: "2em"}}>
                        <label className={"radio"}>
                            <input
                                type={"radio"}
                                style={{marginRight: 5}}
                                name={"payment"}
                                value={"4"}
                                onChange={this.handleInputChange}
                            />
                            Ich möchte das Geld auf mein Bankkonto überwiesen haben
                        </label>
                    </div>
                    <div className={"field"} style={{opacity: this.state.checkVal === 4 ? "1" : "0.5"}}>
                        <p>Das Geld soll auf folgendes Bankkonto überwiesen werden:</p>
                        <div className="control" style={{maxWidth: "500px"}}>
                            <input className="input" type="text" placeholder="Ihre IBAN" disabled={this.state.checkVal !== 4}/>
                        </div>
                        <p className={"help"}> Bitte achten Sie darauf eine IBAN anzugeben</p>
                    </div>
                </fieldset>



            </div>
        );
    }

}