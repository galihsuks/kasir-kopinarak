import { useEffect, useRef, useState } from "react";
import { addStok, delStok, getAllStok, updateStok } from "../global/Fetch";
import { useNavigate } from "react-router-dom";

export default function Stok() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [muncul, setMuncul] = useState(false);
    const judulMuncul = useRef("Tambah Stok");
    const namaMuncul = useRef("Nama Bahan");
    const nominalMuncul = useRef(0);
    const idMuncul = useRef("");
    const satuanMuncul = useRef("Satuan Bahan");
    const trigerDaily = useRef();
    const [isiToast, setIsiToast] = useState("");

    useEffect(() => {
        const dapatData = async () => {
            try {
                const res = await getAllStok();
                if (res) setData(res);
            } catch (err) {
                console.log(err);
            }
        };
        dapatData();
    }, []);
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
            if (window.location.pathname === "/stok") {
                trigerDaily.current.classList.remove("active");
                trigerDaily.current.classList.remove("bg-success");
                trigerDaily.current.classList.remove("bg-danger");
                trigerDaily.current.classList.remove("text-white");
            }
        }, 3000);
    }
    function handleAddStok() {
        console.log("masuk add");
        if (
            namaMuncul.current === "" ||
            nominalMuncul.current === "" ||
            satuanMuncul.current === ""
        ) {
            return callToast(
                "Seluruh data harus terisi",
                "bg-danger",
                "text-white"
            );
        }
        const dataPost = {
            nama: namaMuncul.current.replace(/ /g, "-"),
            nominal: nominalMuncul.current,
            satuan: satuanMuncul.current
        };
        async function add() {
            const res = await addStok(dataPost);
            if (res.status === "berhasil") window.location.reload();
            else console.log(res);
        }
        add();
    }
    function handleEditStok(id) {
        console.log("masuk edit");
        if (
            namaMuncul.current === "" ||
            nominalMuncul.current === "" ||
            satuanMuncul.current === ""
        ) {
            return callToast(
                "Seluruh data harus terisi",
                "bg-danger",
                "text-white"
            );
        }
        const dataPost = {
            id: id,
            nama: namaMuncul.current.replace(/ /g, "-"),
            nominal: nominalMuncul.current,
            satuan: satuanMuncul.current
        };
        async function edit() {
            const res = await updateStok(dataPost);
            if (res.status === "berhasil") window.location.reload();
            else console.log(res);
        }
        edit();
    }
    function handleDelStok(id, nama) {
        if (window.confirm("Stok " + nama + " akan dihapus?") == true) {
            async function hapus() {
                const res = await delStok(id);
                window.location.reload();
            }
            hapus();
        }
    }
    function handleOpenAddStok() {
        judulMuncul.current = "Tambah Stok";
        namaMuncul.current = "";
        nominalMuncul.current = 0;
        satuanMuncul.current = "";
        setMuncul(true);
    }
    function handleOpenEditStok(id, nama, nominal, satuan) {
        judulMuncul.current = "Edit Stok";
        idMuncul.current = id;
        namaMuncul.current = nama;
        nominalMuncul.current = nominal;
        satuanMuncul.current = satuan;
        setMuncul(true);
    }
    function handleCloseMuncul() {
        setMuncul(false);
    }
    return (
        <>
            <div className="toast align-items-center" ref={trigerDaily}>
                <div className="d-flex">
                    <div className="toast-body">{isiToast}</div>
                </div>
            </div>
            {muncul && (
                <div
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        position: "absolute",
                        top: "0",
                        left: "0",
                        height: "100vh",
                        width: "100vw",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <div
                        className="card"
                        style={{ width: "50%", padding: "3em" }}
                    >
                        <h2>{judulMuncul.current}</h2>
                        <div className="mb-3 row">
                            <label className="col-sm-2 col-form-label">
                                Nama
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    defaultValue={namaMuncul.current}
                                    onChange={(e) => {
                                        namaMuncul.current = e.target.value;
                                    }}
                                    className="form-control"
                                    placeholder="Nama Bahan"
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label className="col-sm-2 col-form-label">
                                Nominal
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="number"
                                    defaultValue={nominalMuncul.current}
                                    onChange={(e) => {
                                        nominalMuncul.current = e.target.value;
                                    }}
                                    className="form-control"
                                    placeholder="Nominal"
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label className="col-sm-2 col-form-label">
                                Satuan
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    defaultValue={satuanMuncul.current}
                                    onChange={(e) => {
                                        satuanMuncul.current = e.target.value;
                                    }}
                                    className="form-control"
                                    placeholder="Satuan Bahan"
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <div className="col-sm-12 gap-3">
                                {judulMuncul.current === "Tambah Stok" ? (
                                    <button
                                        className="btn btn-danger"
                                        style={{
                                            display: "inline-block",
                                            marginRight: "5px"
                                        }}
                                        onClick={handleAddStok}
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-danger"
                                        style={{
                                            display: "inline-block",
                                            marginRight: "5px"
                                        }}
                                        onClick={() => {
                                            handleEditStok(idMuncul.current);
                                        }}
                                    >
                                        Save
                                    </button>
                                )}
                                <button
                                    className="btn btn-outline-dark"
                                    onClick={handleCloseMuncul}
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="container">
                <div className="d-flex align-items-center justify-content-between">
                    <h1 className="my-3">Stok</h1>
                    <button
                        className="btn btn-outline-dark"
                        onClick={handleOpenAddStok}
                    >
                        Tambah Stok
                    </button>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Nama</th>
                            <th>Jumlah</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            <>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.nama.replace(/-/g, " ")}</td>
                                        <td>{`${item.nominal} ${item.satuan}`}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-light"
                                                    onClick={() => {
                                                        handleOpenEditStok(
                                                            item.id,
                                                            item.nama.replace(
                                                                /-/g,
                                                                " "
                                                            ),
                                                            item.nominal,
                                                            item.satuan
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => {
                                                        handleDelStok(
                                                            item.id,
                                                            item.nama.replace(
                                                                /-/g,
                                                                " "
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <i className="material-icons">
                                                        delete_forever
                                                    </i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center">
                                    Tidak ada stok
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
