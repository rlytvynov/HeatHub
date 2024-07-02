import { useCallback, useState } from "react"
import "../../styles/components/Navbar.css"
import Profile from "./Auth/Profile/Profile"
import Register from "./Auth/Register"
import Login from "./Auth/Login"
import { NavLink } from "react-router-dom"
import { useAuthContext } from "../../contexts/AuthProvider"

type Props = {

}

function Navbar({}: Props) {
    const [loginForm, setLoginForm] = useState<boolean>(true)
    const authState = useAuthContext()
    const handleLoginClick = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        setLoginForm(true)
    }, [])

    const handleRegisterClick = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        setLoginForm(false)
    }, [])

    return (
        <aside id="left">
            <div className="window" style={{width: '100%'}}>
                <div className="title-bar">
                    <div className="title-bar-text"> { authState.user && 'email' in authState.user ? 'Profile' : loginForm ? 'Login Form' : 'Register Form'}</div>
                </div>
                <div className="window-body">
                    {
                        authState.user && 'email' in authState.user ? <Profile/> : loginForm ? <Login swap={handleRegisterClick}/> : <Register swap={handleLoginClick}/>
                    }
                </div>
            </div>

            <ul className="tree-view" style={{width: '100%', height: '100%' ,overflowY: 'scroll'}}>
                <li><NavLink to="/" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Main Page / Location</NavLink></li>
                <li><NavLink to="/chat" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Chat</NavLink></li>
                <li>
                    <NavLink to="/tubular-heating-elements" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Tubular heating elements</NavLink>
                    <ul>
                        <li> <NavLink to="/tubular-heating-elements/air" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Water tubular heating elements</NavLink></li>
                        <li> <NavLink to="/tubular-heating-elements/water" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Air tubular heating elements</NavLink></li>
                    </ul>
                </li>
                <li>
                    <NavLink to="/backup-power-supply" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Backup power supply</NavLink>
                    <ul>
                        <li> <NavLink to="/backup-power-supply/solar-panels" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Solar panels</NavLink></li>
                        <li> <NavLink to="/backup-power-supply/controllers" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Controllers</NavLink></li>
                        <li> <NavLink to="/backup-power-supply/inverters" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Inverters (UPS)</NavLink></li>
                    </ul>
                </li>
                <li>
                    <NavLink to="/measuring-instruments" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Measuring instruments</NavLink>
                    <ul>
                        <li> <NavLink to="/measuring-instruments/temperature-controllers" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Temperature controllers</NavLink></li>
                        <li> <NavLink to="/measuring-instruments/thermometers" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Thermometers</NavLink></li>
                        <li> <NavLink to="/measuring-instruments/pressure-gauges" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Pressure gauges</NavLink></li>
                        <li> <NavLink to="/measuring-instruments/thermomanometers" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Thermomanometers</NavLink></li>
                    </ul>
                </li>
                <li>
                    <NavLink to="/control-devices" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Сontrol devices</NavLink>
                    <ul>
                        <li> <NavLink to="/control-devices/switches" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Switches</NavLink></li>
                        <li> <NavLink to="/control-devices/timers" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Timers</NavLink></li>
                    </ul>
                </li>
                <li><NavLink to="/anodes" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Anodes</NavLink></li>
                <li><NavLink to="/flanges" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Flanges</NavLink></li>
                <li><NavLink to="/gaskets" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Gaskets</NavLink></li>
                <li><NavLink to="/starting-relays" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Starting relays</NavLink></li>
            </ul>
        </aside>
    )
}

export default Navbar