import React from 'react'
import "../../styles/components/ModularForm.css"

type Props = {
    hideModularWindow: () => void
}

export default function ModularForm({children, hideModularWindow}: React.PropsWithChildren & Props) {
    return (
        <div id="modular-window-wrapper" className="modular-window-wrapper">
            <div id="modular-window" className="window modular-window" style={{width: "300px"}}>
                <div className="title-bar" style={{padding: '1.3rem 0.5rem'}}>
                    <div className="title-bar-text">Contact form</div>
                    <div className="title-bar-controls">
                        <button id="close" aria-label="Close" onClick={hideModularWindow}></button>
                    </div>
                </div>
                <div style={{padding: '1rem'}} className="window-body">
                    {
                        children
                    }
                </div>
            </div>
        </div>
    )
}