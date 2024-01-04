import { Link } from "react-router-dom";

export default function Navbar(props) {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary no-print">
            <div className="container">
                <a className="navbar-brand" href="#">
                    Kopinarak
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link
                                className={
                                    props.page === "dashboard"
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                                to="/"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={
                                    props.page === "draft"
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                                to="/draft"
                            >
                                Draft
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={
                                    props.page === "daily"
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                                to="/daily"
                            >
                                Daily
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={
                                    props.page === "menu"
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                                to="/menu"
                            >
                                Menu
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={
                                    props.page === "stok"
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                                to="/stok"
                            >
                                Stok
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
