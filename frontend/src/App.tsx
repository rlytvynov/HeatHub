import { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/NotFound";

import Footer from "./components/Footer";
import Header from "./components/Header/Header";
import { SocketContext } from "./contexts/SocketProvider";

function App() {
    return (
        <BrowserRouter>
            <Header/>
            <main>
                <Routes>

                    <Route index path="/" element={<Home/>}/>

                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/profile" element={<Profile/>}/>

                    <Route path="*" element={<NotFound/>}/>

                    {/*<Route path="/items/:category" element={<Items />}/>
                    <Route path="/items/:category/:item" element={<Item />}/>


                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/blog" element={<Blog/>}/>
                    <Route path="/blog/:postId" element={<Post/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="*" element={<NotFound/>}/>*/}
                </Routes>
            </main>
            <Footer/>
        </BrowserRouter>
    );
}

export default App;
