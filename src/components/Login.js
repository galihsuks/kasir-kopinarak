import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { signup, currentUser, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        console.log(currentUser);
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate("/");
        } catch (error) {
            console.log(error.code);
            switch (error.code) {
                case "auth/invalid-credential":
                    setAlert("Email atau password salah");
                    break;
                default:
                    break;
            }
        }
        setLoading(false);
    }

    return (
        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ height: "calc(100vh - 200px)" }}
        >
            <div className="p-4 rounded" style={{ width: "400px" }}>
                <img src="img/logo.png" className="mx-auto d-block mb-1" />
                <p className="text-center fw-bold">Login Kasir Kopinarak</p>
                {alert !== "" && (
                    <div className="alert alert-danger" role="alert">
                        {alert}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                        >
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            ref={emailRef}
                        />
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="exampleInputPassword1"
                            className="form-label"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            ref={passwordRef}
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-danger">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
