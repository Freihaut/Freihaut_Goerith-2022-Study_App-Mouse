// here is the code for the mouse logger inside the app

import React, {Component} from 'react';


// Keyboard mouse tracker component for react

export default class MouseTracker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            eventListener: null
        };

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseClick = this.onMouseClick.bind(this);
        this.onMouseScroll = this.onMouseScroll.bind(this);
    }

    // get mouse movement info and set object value to "undefined" if the browser return undefined
    onMouseMove(e) {

        // if (e.x === undefined || e.y === undefined || e.pageX === undefined || e.pageY === undefined) {
        //     console.log("undefined move");
        // }

        this.props.onEvent({
            e: "Mo",
            t: Date.now(),
            x: e.x === undefined ? "undefined" : e.x,
            y: e.y === undefined ? "undefined" : e.y,
            pX: e.pageX === undefined ? "undefined" : e.pageX,
            pY: e.pageY === undefined ? "undefined" : e.pageY,
        });
    }

    // get mouse click info and set object value to "undefined" if the browser return undefined
    onMouseClick (e) {

        // if (e.x === undefined || e.y === undefined || e.pageX === undefined || e.pageY === undefined) {
        //     console.log("undefined click");
        // }

        this.props.onEvent({
            e: "Cl",
            t: Date.now(),
            x: e.x === undefined ? "undefined" : e.x,
            y: e.y === undefined ? "undefined" : e.y,
            pX: e.pageX === undefined ? "undefined" : e.pageX,
            pY: e.pageY === undefined ? "undefined" : e.pageY
        });
    }

    // get mouse scroll info and set object value to "undefined" if the browser return undefined
    onMouseScroll (e) {

        // if (window.scrollX === undefined || window.scrollY === undefined) {
        //     console.log("undefined scroll")
        // }

        this.props.onEvent({
            e: "Sc",
            t: Date.now(),
            pX: window.scrollX === undefined ? "undefined" : window.scrollX,
            pY: window.scrollY === undefined ? "undefined" : window.scrollY
        });
    }


    componentDidMount() {

        // initialize event listeners
        let listener = [];

        // Init our event listeners
        document.addEventListener("mousemove", this.onMouseMove);
        document.addEventListener("click", this.onMouseClick);
        document.addEventListener("scroll", this.onMouseScroll);

        this.setState({eventListener: listener});

        // console.log("Tracker mounted");
    }


    componentWillUnmount() {

        // remove event listeners
        document.removeEventListener("mousemove", this.onMouseMove);
        document.removeEventListener("click", this.onMouseClick);
        document.removeEventListener("scroll", this.onMouseScroll);

        // console.log("Tracker unmounted");
    }


    render() {
        return (<div/>)
    }
}

