import React, { useEffect } from 'react'
import "../../styles/components/Content.css"

type Props = {
    header: string
}

export default function ContentLayout({header, children}: Props & React.PropsWithChildren) {

    return (
        <>
            <h2>{header}</h2>
            <div className="container">
                {children}
            </div>
        </>
    )
}