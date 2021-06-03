/*
Togglable Accordeon Component for the Study-App FAQ
 */

import React, {useState} from 'react';

export default function Accordion (props) {

    const [isActive, setActive] = useState(false);

    return(
        <div className="accordion">
            <h6 className={isActive ? "accordion-header header-is-active" : "accordion-header"} onClick={() => setActive(!isActive)}>
                {props.header}
            </h6>
            {isActive && (
                <p className={"accordion-text"}>
                    {props.text}
                </p>
            )}
            <hr/>
        </div>

    )

}