import React, { Component } from 'react';


export default class Soziodemographics extends Component {

    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }


    handleInputChange(event) {
        // Get the name and value of the clicked radio button and save it to the corresponding question state
        const target = event.target;
        let value = target.value;
        const name = target.name;

        // occupation is a text and input which should not be parsed to an int (bad coding)
        if (name !== "occupation") {
            value = parseInt(value);
        }

        let socioDemAns = {}
        socioDemAns[name] = value;

        this.props.inputChange(socioDemAns);

    }

    render() {

        return(
            <div className="section" style={{marginTop: "1.5rem"}}>
                <div className={"content"}>
                        <h4>4. Einführung abschließen und Studie beginnen</h4>
                        <p>
                            Sie sind am Ende der Einführung in die Studien-App angekommen. Machen Sie abschließend bitte noch
                            einige Angaben zu Ihrer Person und bestätigen Sie dann, dass Sie die Studie beginnen möchten.
                        </p>
                        <p>
                            Wenn Sie auf "Studie beginnen" klicken, schließt sich dieses Fenster und die Studien-App
                            bleibt passiv im Hintergrund ausgeführt, bis sie nach etwa 60 Minuten ein Fenster zur Datenerhebung öffnet.
                        </p>
                        <p>
                            Falls Sie die Studien-App Informationen, die Vorschau der Aufgabe oder die Vorschau der Fragen erneut
                            aufrufen möchten, klicken Sie auf die entsprechende Seite in der obigen Navigation. Die
                            Studien-App Informationen, die Vorschau der Aufgabe oder die Vorschau der Fragen können Sie nach Beginn
                            der Studie auch jederzeit wieder über das Studien-App Symbol in Ihrer {process.platform === "darwin" ? "Menüleiste" : "Systemleiste"} aufrufen.
                        </p>
                        <p>Vielen Dank für Ihre Bereitschaft, an dieser Studie teilzunehmen!</p>
                        <hr/>
                    </div>

                    <div className={"field"} style={{marginTop: "25px"}}>
                        <p className="questionTextStyle">Ihr Alter in Jahren:</p>
                        <div className="control">
                            <label>
                                <input
                                    style={{width: "150px"}}
                                    name="age"
                                    className={"input"}
                                    type="number"
                                    placeholder="Ihr Alter"
                                    value={this.props.answers.age === -99 ? "" : this.props.answers.age}
                                    onChange={this.handleInputChange}
                                    onWheel={()=> document.activeElement.blur()}
                                />
                            </label>
                        </div>
                    </div>

                    <div className={"field"} style={{marginTop: "26px"}}>
                    <span>
                        <p className="questionTextStyle">Ihr Geschlecht:</p>
                        <div className={"control"}>
                            <label className={"radio"}>
                                <input
                                    style={{marginRight: 5}}
                                    type="radio"
                                    value="0"
                                    checked={this.props.answers.sex === 0}
                                    name="sex"
                                    onChange={this.handleInputChange}
                                />weiblich
                            </label>
                            <label className={"radio"} style={{marginLeft: 25}}>
                                <input
                                    style={{marginRight: 5}}
                                    type="radio"
                                    value="1"
                                    checked={this.props.answers.sex === 1}
                                    name="sex"
                                    onChange={this.handleInputChange}
                                />männlich
                            </label>
                            <label className={"radio"} style={{marginLeft: 25}}>
                                <input style={{marginRight: 5}}
                                       type="radio"
                                       value="2"
                                       checked={this.props.answers.sex === 2}
                                       name="sex"
                                       onChange={this.handleInputChange}
                                />divers
                            </label>
                        </div>
                    </span>
                    </div>

                    <div className={"field"} style={{marginTop: "25px"}}>
                        <p className="questionTextStyle">Ihr Beruf:</p>
                        <div className="control">
                            <label>
                                <input
                                    style={{width: "300px"}}
                                    name="occupation"
                                    className={"input"}
                                    type="text"
                                    placeholder="Ihr Beruf"
                                    value={this.props.answers.occupation === -99 ? "" : this.props.answers.occupation}
                                    onChange={this.handleInputChange}
                                />
                            </label>
                        </div>
                    </div>

                    <div className={"field"} style={{marginTop: "40px"}}>
                    <span>
                        <p className="questionTextStyle">Mit welcher Hand bedienen Sie die Computer-Maus:</p>
                        <div className={"control"}>
                            <label className={"radio"}>
                                <input
                                    style={{marginRight: 5}}
                                    type="radio"
                                    name="hand"
                                    value="0"
                                    checked={this.props.answers.hand === 0}
                                    onChange={this.handleInputChange}
                                />rechts
                            </label>
                            <label className={"radio"} style={{marginLeft: 25}}>
                                <input
                                    style={{marginRight: 5}}
                                    type="radio"
                                    name="hand"
                                    value="1"
                                    checked={this.props.answers.hand === 1}
                                    onChange={this.handleInputChange}
                                />links
                            </label>
                        </div>
                    </span>
                    </div>

                    <div className={"field"} style={{marginTop: "40px"}}>
                    <span>
                        <p className="questionTextStyle">Wie nutzen Sie Ihren Computer überwiegend?</p>
                        <div className={"control"}>
                            <label className={"radio"}>
                                <input
                                    style={{marginRight: 5}}
                                    type="radio"
                                    name="computer"
                                    value="0"
                                    checked={this.props.answers.computer === 0}
                                    onChange={this.handleInputChange}
                                />beruflich
                            </label>
                            <label className={"radio"} style={{marginLeft: 25}}>
                                <input
                                    style={{marginRight: 5}}
                                    type="radio"
                                    name="computer"
                                    value="1"
                                    checked={this.props.answers.computer === 1}
                                    onChange={this.handleInputChange}
                                />privat
                            </label>
                             <label className={"radio"} style={{marginLeft: 25}}>
                                <input
                                    style={{marginRight: 5}}
                                    type="radio"
                                    name="computer"
                                    value="2"
                                    checked={this.props.answers.computer === 2}
                                    onChange={this.handleInputChange}
                                />sowohl beruflich als auch privat
                            </label>
                        </div>
                    </span>
                    </div>

                    <div style={{marginTop: "3rem", width: "100%", textAlign: "center"}}>
                        <button className={this.props.hasEnded ? "button is-link is-loading" : "button is-link"}
                                disabled={this.props.hasEnded}
                                onClick={() => this.props.endSociodem()}>Studie beginnen</button>
                    </div>

            </div>
        );
    }

}