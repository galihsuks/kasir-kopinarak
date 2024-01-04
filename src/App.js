import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Daily from "./components/Daily";
import DailyDetail from "./components/DailyDetail";
import Draft from "./components/Draft";
import Menu from "./components/Menu";
import MenuDetail from "./components/MenuDetail";
import MenuAdd from "./components/MenuAdd";
import Stok from "./components/Stok";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/">
                    <Route
                        index
                        element={
                            <>
                                <Navbar page={"dashboard"} />
                                <Dashboard />
                            </>
                        }
                    />
                    <Route path="daily">
                        <Route
                            index
                            element={
                                <>
                                    <Navbar page={"daily"} />
                                    <Daily />
                                </>
                            }
                        />
                        <Route
                            path=":tgl"
                            element={
                                <>
                                    <Navbar page={"dailydetail"} />
                                    <DailyDetail />
                                </>
                            }
                        />
                    </Route>
                    <Route
                        path="draft"
                        element={
                            <>
                                <Navbar page={"draft"} />
                                <Draft />
                            </>
                        }
                    />
                    <Route path="menu">
                        <Route
                            index
                            element={
                                <>
                                    <Navbar page={"menu"} />
                                    <Menu />
                                </>
                            }
                        />
                        <Route
                            path=":id"
                            element={
                                <>
                                    <Navbar page={"menu"} />
                                    <MenuDetail />
                                </>
                            }
                        />
                    </Route>
                    <Route
                        path="addmenu"
                        element={
                            <>
                                <Navbar page={"menu"} />
                                <MenuAdd />
                            </>
                        }
                    />
                    <Route
                        path="stok"
                        element={
                            <>
                                <Navbar page={"stok"} />
                                <Stok />
                            </>
                        }
                    />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
