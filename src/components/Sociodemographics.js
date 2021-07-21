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
                        <h4>Schritt 4: Einführung abschließen und Studie starten</h4>
                        <p>
                            Sie sind am Ende der Einführung in die Studien-App angekommen. Machen Sie abschließend bitte noch
                            einige Angaben zu Ihrer Person und bestätigen Sie dann, dass Sie die Studie starten möchten.
                        </p>
                        <p>
                            Wenn Sie auf "Studie starten" klicken, schließt sich dieses Fenster und die Studien-App
                            bleibt passiv im Hintergrund, bis sie nach etwa 60 Minuten ein Fenster zur ersten Datenerhebung öffnet.
                        </p>

                        <hr/>
                    </div>

                    <div className={"field"} style={{marginTop: "25px"}}>
                        <p className="questionTextStyle">Ihr Alter:</p>
                        <div className="control">
                            <div className={"select is-info"}>
                                <select name={"age"}
                                        value={this.props.answers.age}
                                        onChange={this.handleInputChange}>
                                    <option value={-99} disabled={true} hidden={true}>Bitte wählen Sie aus</option>
                                    <option value={1}>jünger als 30</option>
                                    <option value={2}>30 bis 39</option>
                                    <option value={3}>40 bis 49</option>
                                    <option value={4}>50 bis 59</option>
                                    <option value={5}>60 oder älter</option>
                                </select>
                            </div>
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

                    <div style={{marginTop: "3rem", width: "100%", textAlign: "center"}}>
                        <button className={this.props.hasEnded ? "button is-link is-loading" : "button is-link"}
                                disabled={this.props.hasEnded}
                                onClick={() => this.props.endSociodem()}>Studie starten</button>
                    </div>

            </div>
        );
    }

}