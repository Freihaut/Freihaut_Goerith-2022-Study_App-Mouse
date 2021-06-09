import React, { Component } from 'react';


export default class SelfReport extends Component {

    constructor(props) {
        super(props);

        // set a state for each questionnaire item
        this.state = {
            modal: this.props.intro ? "modal is-active" : "modal",
            selfReport: {
                valence: 50,
                arousal: 50,
                stress: 50}
        };

        // settings for the modal if its the task intro and the modal is triggered
        if (this.props.intro) {
            document.body.classList.add("is-clipped");
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }


    handleInputChange(event) {
        // Get the name and value of the clicked radio button and save it to the corresponding question state

        const target = event.target;
        const value = parseInt(target.value);
        const name = target.name;

        // get the state
        const state = {...this.state.selfReport};
        // set the value of the changed handler
        state[name] = value;

        //set the new state
        this.setState({selfReport: state});
    }


    // instruction modal to explain the task in the tutorial
    renderInstruction() {

        return (

            <div className={this.state.modal} style={{textAlign: "left", fontSize: "18px"}}>
                <div className="modal-background">{null}</div>
                <div className="modal-content">
                    <header className="modal-card-head">
                        <p className="modal-card-title"><b>3. Vorschau der Fragen</b></p>
                    </header>
                    <section className="modal-card-body">

                        <div className="content">
                            <p>
                               Nachdem Sie die Aufgabe beendet haben, werden Ihnen noch 3 Fragen zu Ihrem aktuellen Befinden
                                angezeigt.
                            </p>
                            <p>
                                Verschieben Sie die Regler bei jeder Frage so, dass er Ihrem aktuellen Befinden am ehesten
                                entspricht. Beantworten Sie die Fragen spontan, es gibt keine richtigen oder falschen
                                Antworten.
                            </p>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-link" onClick={() => this.closeModal()}>Fragen anzeigen</button>
                    </footer>
                </div>
            </div>
        )
    }

    // close the modal when the close modal button is pushed
    closeModal(){
        document.body.classList.remove("is-clipped");
        this.setState({
            modal: "modal"
        });
    }

    render() {


        return(
            <div className="container is-fluid" style={{marginTop: "50px"}}>
                <div>
                    <h3 className="title is-5">
                        Bitte verschieben Sie die Regler so, dass sie Ihrem aktuellen Befinden am besten entsprechen.
                    </h3>
                    <hr style={{margin: "0 0", height: "3px"}}/>
                </div>

                <div style={{marginTop: "2.5rem"}}>
                    <p className="title is-5">Ich fühle mich...</p>
                    <input className="slider" step="1" min="0" max="100" name="valence" value={this.state.selfReport.valence} type="range" onChange={this.handleInputChange}/>
                    <ul className="slider-labels">
                        <li className="slider-start-label title is-5">negativ</li>
                        <li className="slider-end-label title is-5">positiv</li>
                    </ul>
                </div>

                <div style={{marginTop: "5rem"}}>
                    <p className="title is-5">Ich fühle mich...</p>
                    <input className="slider" step="1" min="0" max="100" name="arousal" value={this.state.selfReport.arousal} type="range" onChange={this.handleInputChange}/>
                    <ul className="slider-labels">
                        <li className="slider-start-label title is-5">aufgeregt</li>
                        <li className="slider-end-label title is-5">ruhig</li>
                    </ul>
                </div>

                <div style={{marginTop: "5rem"}}>
                    <p className="title is-5">Ich fühle mich...</p>
                    <input className="slider" step="1" min="0" max="100" name="stress" value={this.state.selfReport.stress} type="range" onChange={this.handleInputChange}/>
                    <ul className="slider-labels">
                        <li className="slider-start-label title is-5">gestresst</li>
                        <li className="slider-end-label title is-5">entspannt</li>
                    </ul>
                </div>

                <div style={{marginTop: "5rem", width: "100%", textAlign: "center"}}>
                    <button className="button is-link" onClick={() => this.props.endReport({selfReportData: this.state.selfReport})}>{this.props.buttonText}</button>
                </div>
                {this.renderInstruction()}
            </div>
        )
    }

}