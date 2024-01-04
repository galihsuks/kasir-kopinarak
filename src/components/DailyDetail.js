import React, { useEffect, useRef, useState } from "react";
import { getAllMenu, getDaily, updateDaily } from "../global/Fetch";
import { konversiTglPHP, numberWithCommas } from "../global/Variables";

export default function DailyDetail() {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    const useEffectRan = useRef([false, false, false]);
    const [isEdit, setIsEdit] = useState(false);
    const [jumlah, setJumlah] = useState("");
    const [diskon, setDiskon] = useState("");
    const [total, setTotal] = useState("");
    const [isInvalid, setIsInvalid] = useState(false);
    const menu = useRef();
    const menuSelected = useRef([]);

    useEffect(() => {
        const dapatData = async () => {
            try {
                const res = await getDaily(window.location.pathname.slice(7));
                if (res) setData(res);
            } catch (err) {
                console.log(err);
            }
        };
        dapatData();
        const dapatAllData = async () => {
            try {
                const res = await getAllMenu();
                menu.current = res;
            } catch (err) {
                console.log(err);
            }
        };
        dapatAllData();
    }, []);

    useEffect(() => {
        if (useEffectRan.current[0] === true) {
            setLoad(false);
        }
        return () => {
            useEffectRan.current[0] = true;
        };
    }, [data]);

    useEffect(() => {
        if (useEffectRan.current[2] === true) {
            console.log(load);
            if (!load) exportTableToExcel();
        }
        return () => {
            useEffectRan.current[2] = true;
        };
    }, [load]);

    const handleDel = (nama) => {
        if (
            window.confirm(
                "Data menu " + nama.replace(/-/g, " ") + " akan dihapus?"
            ) == true
        ) {
            const datalama = JSON.parse(data.data);
            let totalSemua = 0;
            const menuSkrg = datalama
                .filter((el) => {
                    if (el.nama === nama) {
                        return false;
                    } else {
                        return true;
                    }
                })
                .map((el) => {
                    totalSemua += Number(el.harga);
                    return el;
                });
            async function editDaily() {
                const res = await updateDaily(
                    menuSkrg,
                    totalSemua,
                    window.location.pathname.slice(7)
                );
                if (res) window.location.reload();
            }
            editDaily();
        }
    };

    const handleEdit = () => {
        if (Number(jumlah) > 0) {
            const dataEdit = {
                nama: menuSelected.current,
                jumlah: Number(jumlah),
                harga: String(total)
            };
            const datalama = JSON.parse(data.data);
            let totalSemua = 0;
            const menuSkrg = datalama.map((el) => {
                if (el.nama === menuSelected.current) {
                    totalSemua += total;
                    return dataEdit;
                } else {
                    totalSemua += Number(el.harga);
                    return el;
                }
            });
            async function editDaily() {
                const res = await updateDaily(
                    menuSkrg,
                    totalSemua,
                    window.location.pathname.slice(7)
                );
                if (res) window.location.reload();
            }
            editDaily();
        } else {
            setIsInvalid(true);
        }
    };

    useEffect(() => {
        if (useEffectRan.current[1] === true) {
            const hargaPerMenu = menu.current.filter(function (el) {
                return el.nama == menuSelected.current;
            });
            console.log(hargaPerMenu[0]);
            setTotal(
                ((100 - diskon) / 100) *
                    Number(hargaPerMenu[0].harga * Number(jumlah))
            );
            if (isInvalid) setIsInvalid(false);
        }
        return () => {
            useEffectRan.current[1] = true;
        };
    }, [diskon, jumlah]);

    useEffect(() => {
        if (isEdit) {
            setJumlah("");
            setDiskon("");
            setTotal("");
        }
    }, [isEdit]);

    function exportTableToExcel(filename = "") {
        var dataType = "application/vnd.ms-excel";
        var tableSelect = document.getElementById("tabelDetail");
        var btnDownloadTable = document.getElementById("btnDownloadDetail");
        var tableHTML = tableSelect.outerHTML.replace(/ /g, "%20");

        // Specify file name
        filename = filename
            ? filename + ".xls"
            : "Detail_" + data.tanggal.split(" ")[0] + "_Recap.xls";

        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(["\ufeff", tableHTML], {
                type: dataType
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            btnDownloadTable.href = "data:" + dataType + ", " + tableHTML;
            btnDownloadTable.download = filename;
            // btnDownloadTable.click();
        }
    }

    return (
        <div className="container">
            <div className="d-flex align-items-center justify-content-between">
                <h1 className="my-3">Detail Daily Recap</h1>
                <a className="btn btn-danger" id="btnDownloadDetail">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <i className="material-icons">file_download</i>
                        {load ? (
                            ""
                        ) : (
                            <p className="m-0">
                                Download Rekap Tgl{" "}
                                {konversiTglPHP(data.tanggal.split(" ")[0])}
                            </p>
                        )}
                    </div>
                </a>
            </div>
            {load ? (
                ""
            ) : (
                <h5>Tanggal : {konversiTglPHP(data.tanggal.split(" ")[0])}</h5>
            )}
            <table className="table table-striped" id="tabelDetail">
                <thead>
                    <tr>
                        <th>Menu</th>
                        <th>Jumlah</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {load ? (
                        <tr>
                            <td colSpan={2} className="text-center">
                                Tidak ada data
                            </td>
                        </tr>
                    ) : (
                        <>
                            {JSON.parse(data.data)
                                .sort((a, b) => {
                                    if (a.nama < b.nama) {
                                        return -1;
                                    }
                                    if (a.nama > b.nama) {
                                        return 1;
                                    }
                                    return 0;
                                })
                                .map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.nama.replace(/-/g, " ")}</td>
                                        <td>{item.jumlah}</td>
                                        <td>
                                            Rp {numberWithCommas(item.harga)}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-light"
                                                    onClick={() => {
                                                        menuSelected.current =
                                                            item.nama;
                                                        setIsEdit(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => {
                                                        handleDel(item.nama);
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
                    )}
                    <tr>
                        <th>Total Keseluruhan : </th>
                        <th></th>
                        {load ? (
                            ""
                        ) : (
                            <th className="text-danger">
                                Rp {numberWithCommas(data.total)}
                            </th>
                        )}
                        <th></th>
                    </tr>
                </tbody>
            </table>

            {isEdit && (
                <div className="overlay-hitam-bg">
                    <div className="container-edit-daily">
                        <h2 className="mb-3">
                            Edit Menu {menuSelected.current.replace(/-/g, " ")}
                        </h2>
                        <div>
                            <input
                                type="number"
                                className={
                                    isInvalid
                                        ? "form-control mb-1 is-invalid"
                                        : "form-control mb-1"
                                }
                                placeholder="Jumlah"
                                value={jumlah}
                                onChange={(e) => {
                                    setJumlah(e.target.value);
                                }}
                            />
                            {isInvalid && (
                                <div className="text-danger">
                                    Jumlah harus lebih dari nol
                                </div>
                            )}
                        </div>
                        <div className="input-group mb-1">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Diskon"
                                value={diskon}
                                onChange={(e) => {
                                    setDiskon(e.target.value);
                                }}
                            />
                            <span className="input-group-text">%</span>
                        </div>
                        <div className="input-group">
                            <span className="input-group-text">Rp</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Total Harga"
                                disabled
                                value={numberWithCommas(total)}
                            />
                        </div>
                        <div className="d-flex gap-1 mt-3 justify-content-end">
                            <button
                                className="btn btn-outline-dark"
                                onClick={handleEdit}
                            >
                                Simpan
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => {
                                    setIsEdit(false);
                                }}
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
