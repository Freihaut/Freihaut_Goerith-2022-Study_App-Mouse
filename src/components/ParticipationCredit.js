import React, { Component } from 'react';


export default class ParticipationCredit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            checkVal: false
        }
    }


    componentDidMount() {
        window.scrollTo(0, 0);
    }


    handleInputChange() {

        // toggle the checkbox
        this.setState({checkVal: !this.state.checkVal})

    }

    render() {

        return(
            <div className="section" style={{marginTop: "1.5rem"}}>
                <div className={"content"}>

                    <div className={"notification is-light is-info"}>
                        <h3 className={"title"}>Geschafft!</h3>
                        <h5 className={"subtitle"}> Die Datenerhebung ist abgeschlossen.</h5>
                        <p>
                            Für Ihre Teilnahme an dieser Studie erhalten Sie 100 Treuepunkte (=10 Euro). Klicken Sie
                            auf "Studie beenden", um diese in den nächsten Tagen gutgeschrieben zu bekommen. Falls Sie möchten, können Sie Ihre
                            Treuepunkte auch an das WiSoPanel zurück spenden. Setzen Sie dafür einen Haken in der entsprechenden
                            Box.
                        </p>
                        <div>
                            <label className="checkbox">
                                <input type="checkbox" style={{marginRight: "10px", outline: "none"}} checked={this.state.checkVal} onChange={()=> this.handleInputChange()}/>
                                Ich verzichte auf die Treuepunkte und spende sie an WiSoPanel zurück.
                            </label>
                        </div>
                        <div className={"field"} style={{marginTop: "2rem", width: "100%", textAlign: "center"}}>
                            <div className="control">
                                <p className={"help is-danger"} style={{visibility: this.props.savingFailed ? "visible" : "hidden"}}>
                                    Ihre Angabe konnte nicht gespeichert werden. Stellen Sie sicher, dass Sie mit dem Internet
                                    verbunden sind und probieren Sie es erneut.
                                </p>
                                <button className={this.props.savingAttempt ? "button is-link is-loading" : "button is-link"}
                                        disabled={this.props.savingAttempt}
                                        onClick={() => this.props.collectCredit(this.state.checkVal)}>Studie beenden
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

}