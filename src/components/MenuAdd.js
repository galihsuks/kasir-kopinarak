import { useEffect, useRef, useState } from "react";
import { addMenu, getAllStok } from "../global/Fetch";
import { useNavigate } from "react-router-dom";

export default function MenuAdd() {
    const navigate = useNavigate();
    const [nama, setNama] = useState("");
    const [harga, setHarga] = useState("");
    const [jenis, setJenis] = useState("minum");
    const [bahan, setBahan] = useState(["cup"]);
    const [bahanD, setBahanD] = useState(["cup"]);
    const nominalBahan = useRef([0]);
    const nominalBahanD = useRef([0]);
    const trigerDaily = useRef();
    const [isiToast, setIsiToast] = useState("");
    const [stok, setStok] = useState([]);

    useEffect(() => {
        const dapatStok = async () => {
            try {
                const res = await getAllStok();
                if (res) setStok(res);
            } catch (err) {
                console.log(err);
            }
        };
        dapatStok();
    }, []);

    function handleAddMenu() {
        if (harga === "" || nama === "") {
            return callToast(
                "Nama dan Harga harus terisi",
                "bg-danger",
                "text-white"
            );
        }
        const dataBahan = bahan.map((item, index) => {
            return {
                nama: item,
                nominal: nominalBahan.current[index]
            };
        });
        const dataBahanD = bahanD.map((item, index) => {
            return {
                nama: item,
                nominal: nominalBahanD.current[index]
            };
        });
        const dataPost = {
            nama: nama.replace(/ /g, "-"),
            harga: harga,
            makanan: jenis === "makan" ? "1" : "0",
            bahan: JSON.stringify(dataBahan),
            bahan_dingin:
                jenis === "minum"
                    ? JSON.stringify(dataBahanD)
                    : JSON.stringify([])
        };
        async function add() {
            const res = await addMenu(dataPost);
            if (res.status === "berhasil") navigate("/menu", { replace: true });
            else console.log(res);
        }
        add();
    }
    function callToast(text, bg = "", color = "") {
        setIsiToast(text);
        trigerDaily.current.classList.add("active");
        if (bg !== "") {
            trigerDaily.current.classList.add(bg);
        }
        if (color !== "") {
            trigerDaily.current.classList.add(color);
        }
        setTimeout(() => {
            if (window.location.pathname === "/addmenu") {
                trigerDaily.current.classList.remove("active");
                trigerDaily.current.classList.remove("bg-success");
                trigerDaily.current.classList.remove("bg-danger");
                trigerDaily.current.classList.remove("text-white");
            }
        }, 3000);
    }

    function handleChangeBahan(item, index) {
        let myNextList = [...bahan];
        myNextList[index] = item;
        setBahan(myNextList);
    }
    function handleChangeBahanD(item, index) {
        let myNextList = [...bahanD];
        myNextList[index] = item;
        setBahanD(myNextList);
    }

    return (
        <div className="container">
            <div className="toast align-items-center" ref={trigerDaily}>
                <div className="d-flex">
                    <div className="toast-body">{isiToast}</div>
                </div>
            </div>

            <h1 className="my-3">Add Menu</h1>
            <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">Nama</label>
                <div className="col-sm-10">
                    <input
                        type="text"
                        value={nama}
                        onChange={(e) => {
                            setNama(e.target.value);
                        }}
                        className="form-control"
                        placeholder="Nama Menu"
                    />
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">Jenis</label>
                <div className="col-sm-10">
                    <select
                        className="form-select"
                        value={jenis}
                        onChange={(e) => {
                            setJenis(e.target.value);
                        }}
                    >
                        <option value="minum">Minum</option>
                        <option value="makan">Makan</option>
                    </select>
                </div>
            </div>
            <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">Harga</label>
                <div className="col-sm-10">
                    <div className="input-group mb-3">
                        <span className="input-group-text">Rp</span>
                        <input
                            type="number"
                            value={harga}
                            onChange={(e) => {
                                setHarga(e.target.value);
                            }}
                            className="form-control"
                            placeholder="Harga"
                        />
                    </div>
                </div>
            </div>
            <div className="mb-3 row">
                <div className={jenis === "minum" ? "col-sm-6" : "col-sm-12"}>
                    <p>Bahan</p>
                    {bahan.map((item, index) => (
                        <div className="row" key={index}>
                            <div className="col-sm-6">
                                <select
                                    className="form-select"
                                    defaultValue={"cup"}
                                    onChange={(e) =>
                                        handleChangeBahan(e.target.value, index)
                                    }
                                >
                                    {stok.map((e, i) => (
                                        <option value={e.nama} key={i}>
                                            {e.nama.replace(/-/g, " ")}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-sm-6">
                                <div className="input-group mb-3">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Nominal"
                                        defaultValue={0}
                                        onChange={(e) => {
                                            nominalBahan.current[index] =
                                                Number(e.target.value);
                                        }}
                                    />
                                    <span className="input-group-text">
                                        {stok.map((e) => {
                                            if (bahan[index] === e.nama)
                                                return e.satuan;
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {jenis === "minum" && (
                    <div className="col-sm-6">
                        <p>Bahan Dingin</p>
                        {bahanD.map((item, index) => (
                            <div className="row" key={index}>
                                <div className="col-sm-6">
                                    <select
                                        className="form-select"
                                        defaultValue={"cup"}
                                        onChange={(e) =>
                                            handleChangeBahanD(
                                                e.target.value,
                                                index
                                            )
                                        }
                                    >
                                        {stok.map((e, i) => (
                                            <option value={e.nama} key={i}>
                                                {e.nama.replace(/-/g, " ")}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-sm-6">
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Nominal"
                                            defaultValue={0}
                                            onChange={(e) => {
                                                nominalBahanD.current[index] =
                                                    Number(e.target.value);
                                            }}
                                        />
                                        <span className="input-group-text">
                                            {stok.map((e) => {
                                                if (bahanD[index] === e.nama)
                                                    return e.satuan;
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mb-3 row">
                <div className={jenis === "minum" ? "col-sm-6" : "col-sm-12"}>
                    <button
                        className="btn btn-outline-dark"
                        onClick={() => {
                            nominalBahan.current = [...nominalBahan.current, 0];
                            setBahan([...bahan, "cup"]);
                        }}
                    >
                        Tambah bahan
                    </button>
                </div>
                {jenis === "minum" && (
                    <div className="col-sm-6">
                        <button
                            className="btn btn-outline-dark"
                            onClick={() => {
                                nominalBahanD.current = [
                                    ...nominalBahanD.current,
                                    0
                                ];
                                setBahanD([...bahanD, "cup"]);
                            }}
                        >
                            Tambah bahan dingin
                        </button>
                    </div>
                )}
            </div>
            <a className="btn btn-danger" onClick={handleAddMenu}>
                Save
            </a>
        </div>
    );
}
