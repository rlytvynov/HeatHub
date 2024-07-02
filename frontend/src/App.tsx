import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import TubularHeatingElements from "./pages/Tubular/TubularHeatingElements";
import TubularHeatingElementsAir from "./pages/Tubular/TubularHeatingElementsAir";
import TubularHeatingElementsWater from "./pages/Tubular/TubularHeatingElementsWater";
import RouterLayout from "./components/Layouts/RoterLayout";
import MeasuringInstruments from "./pages/Measuring/MeasuringInstruments";
import TemperatureControllers from "./pages/Measuring/TemperatureControllers";
import Thermometers from "./pages/Measuring/Thermometers";
import PressureGauges from "./pages/Measuring/PressureGauges";
import Thermomanometers from "./pages/Measuring/Thermomanometers";
import BackupPowerSupply from "./pages/BPS/BackupPowerSupply";
import SolarPanels from "./pages/BPS/SolarPanels";
import Controllers from "./pages/BPS/Controllers";
import InvertersUPS from "./pages/BPS/InvertersUPS";
import ControlDevices from "./pages/Control/ControlDevices";
import Switches from "./pages/Control/Switches";
import Timers from "./pages/Control/Timers";
import Gaskets from "./pages/Gaskets/Gaskets";
import Flanges from "./pages/Flanges/Flanges";
import Anodes from "./pages/Anodes/Anodes";
import Relays from "./pages/Starting Relays/Realys";
import YMap from "./components/Map";
import Blog from "./pages/Blog/Blog";
import About from "./pages/About/About";
import PaymentInstructions from "./pages/Payment/PaymentInstructions";
import { useContext, useEffect, useSyncExternalStore } from "react";
import { SocketContext } from "./contexts/SocketProvider";
import { iuser } from "user";
import { adminSessionsStore } from "./data/sessions/adminSessionsStore";
import OnlineUsers from "./components/OnlineUsers";
import { userSessionsStore } from "./data/sessions/userSessionsStore";
import { roomStore } from "./data/rooms/roomStore";
import { adminRoomsStore } from "./data/rooms/adminRoomsStore";
import { useAuthContext } from "./contexts/AuthProvider";
import { iroom } from "room";

function App() {
    const authContext = useAuthContext()
    const socket = useContext(SocketContext)
    const admins = useSyncExternalStore(adminSessionsStore.subscribe.bind(adminSessionsStore), adminSessionsStore.getSnapshot.bind(adminSessionsStore))
    const users = useSyncExternalStore(userSessionsStore.subscribe.bind(userSessionsStore), userSessionsStore.getSnapshot.bind(userSessionsStore));
    useSyncExternalStore(roomStore.subscribe.bind(roomStore), roomStore.getSnapshot.bind(roomStore));
    useSyncExternalStore(adminRoomsStore.subscribe.bind(adminRoomsStore), adminRoomsStore.getSnapshot.bind(adminRoomsStore));
    useEffect(() => {
        const uploadStore = async () => {
            await adminSessionsStore.loadOnlineAdmins()
            await userSessionsStore.loadOnlineUsers()
        }
        uploadStore()

        const handleUserConnected = (user: iuser) => {
            if(user.role === 'admin') {
                adminSessionsStore.adminConnected(user)
            } else {
                userSessionsStore.userConnected(user)
            }
        }
        const handleUserDisconnected = (user: iuser) => {
            if(user.role === 'admin') {
                adminSessionsStore.adminDisconnected(user)
            } else {
                userSessionsStore.userDisconnected(user)
            }
        }
        const handleNewMessage = (room: iroom) => {
            if(authContext.user?.role === 'admin') {
                adminRoomsStore.refreshRoom(room)
            } else {
                roomStore.refreshRoom(room)
            }
        }

        socket.on('new-room-message', handleNewMessage)
        socket.on('user-connected', handleUserConnected)
        socket.on('user-disconnected', handleUserDisconnected)
        return () => {
            socket.off('user-connected', handleUserConnected)
            socket.off('user-disconnected', handleUserDisconnected)
        }
    }, [socket])
    return (
        <>
            <BrowserRouter>
                <Navbar/>
                <main>
                    <h1>Electronics and electrical equipment store</h1>
                    <hr />
                    <Routes>
                        <Route path="/" element={<Home />}>
                            <Route index element={<YMap />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/chat" element={<Chat />}/>
                            <Route path="/payment-instructions" element={<PaymentInstructions />} />
                        </Route>
                        <Route path="/tubular-heating-elements" element={<RouterLayout/>}>
                            <Route index element={<TubularHeatingElements />} />
                            <Route path="air" element={<TubularHeatingElementsAir />} />
                            <Route path="water" element={<TubularHeatingElementsWater />} />
                        </Route>
                        <Route path="/backup-power-supply" element={<RouterLayout />}>
                            <Route index element={<BackupPowerSupply />} />
                            <Route path="solar-panels" element={<SolarPanels />} />
                            <Route path="controllers" element={<Controllers />} />
                            <Route path="inverters" element={<InvertersUPS />} />
                        </Route>
                        <Route path="/measuring-instruments" element={<RouterLayout />}>
                            <Route index element={<MeasuringInstruments />} />
                            <Route path="temperature-controllers" element={<TemperatureControllers />} />
                            <Route path="thermometers" element={<Thermometers />} />
                            <Route path="pressure-gauges" element={<PressureGauges />} />
                            <Route path="thermomanometers" element={<Thermomanometers />} />
                        </Route>
                        <Route path="/control-devices" element={<RouterLayout />}>
                            <Route index element={<ControlDevices />} />
                            <Route path="switches" element={<Switches />} />
                            <Route path="timers" element={<Timers />} />
                        </Route>
                        <Route path="/anodes" element={<Anodes />} />
                        <Route path="/flanges" element={<Flanges />} />
                        <Route path="/gaskets" element={<Gaskets />} />
                        <Route path="/starting-relays" element={<Relays />} />
                        {/* <Route path="/:category/:subcategory/:itemId" element={<ItemPage />} /> */}
                    </Routes>
                </main>  
                <OnlineUsers users={users.length + admins.length}/>
            </BrowserRouter> 
        </>
    )
}

export default App;
