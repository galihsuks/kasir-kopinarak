import "./App.css";
import {
    Navigate,
    Route,
    Routes,
    redirect,
    useNavigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Daily from "./components/Daily";
import DailyDetail from "./components/DailyDetail";
import Draft from "./components/Draft";
import Menu from "./components/Menu";
import MenuDetail from "./components/MenuDetail";
import MenuAdd from "./components/MenuAdd";
import Stok from "./components/Stok";
import Login from "./components/Login";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";

function App() {
    const { signup, currentUser, login } = useAuth();
    const navigate = useNavigate();

    const HarusLogin = ({ children }) => {
        if (currentUser) return <div>{children}</div>;
        else return (window.location.href = "/login");
    };
    const HarusLogout = ({ children }) => {
        if (!currentUser) return <div>{children}</div>;
        else return (window.location.href = "/");
    };

    return (
        <div className="App">
            <Routes>
                <Route path="/">
                    <Route
                        index
                        element={
                            <>
                                <HarusLogin>
                                    <Navbar page={"dashboard"} />
                                    <Dashboard />
                                </HarusLogin>
                            </>
                        }
                    />
                    <Route path="daily">
                        <Route
                            index
                            element={
                                <>
                                    <HarusLogin>
                                        <Navbar page={"daily"} />
                                        <Daily />
                                    </HarusLogin>
                                </>
                            }
                        />
                        <Route
                            path=":tgl"
                            element={
                                <>
                                    <HarusLogin>
                                        <Navbar page={"dailydetail"} />
                                        <DailyDetail />
                                    </HarusLogin>
                                </>
                            }
                        />
                    </Route>
                    <Route
                        path="login"
                        element={
                            <>
                                <HarusLogout>
                                    <Login />
                                </HarusLogout>
                            </>
                        }
                    />
                    <Route
                        path="draft"
                        element={
                            <>
                                <HarusLogin>
                                    <Navbar page={"draft"} />
                                    <Draft />
                                </HarusLogin>
                            </>
                        }
                    />
                    <Route path="menu">
                        <Route
                            index
                            element={
                                <>
                                    <HarusLogin>
                                        <Navbar page={"menu"} />
                                        <Menu />
                                    </HarusLogin>
                                </>
                            }
                        />
                        <Route
                            path=":id"
                            element={
                                <>
                                    <HarusLogin>
                                        <Navbar page={"menu"} />
                                        <MenuDetail />
                                    </HarusLogin>
                                </>
                            }
                        />
                    </Route>
                    <Route
                        path="addmenu"
                        element={
                            <>
                                <HarusLogin>
                                    <Navbar page={"menu"} />
                                    <MenuAdd />
                                </HarusLogin>
                            </>
                        }
                    />
                    <Route
                        path="stok"
                        element={
                            <>
                                <HarusLogin>
                                    <Navbar page={"stok"} />
                                    <Stok />
                                </HarusLogin>
                            </>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <>
                                <Navigate to={"/"}></Navigate>
                            </>
                        }
                    />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
