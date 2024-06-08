import {ReactNode} from 'react'
import "../styles/components/Layout.scss"

type Props = {
    styleClass: string,
    children: ReactNode
}

const Layout = ({styleClass, children}: Props) => {
  return (
    <div className={`_wrapper ${styleClass}`}>
        <div className={`_container ${styleClass}`}>
            {children}
        </div>
    </div>
  )
}

export default Layout