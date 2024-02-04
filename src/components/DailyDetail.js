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
                const resmenu = await getAllMenu();
                if (resmenu) menu.current = resmenu;
                if (res) setData(res);
            } catch (err) {
                console.log(err);
            }
        };
        dapatData();
        // const dapatAllData = async () => {
        //     try {
        //         const res = await getAllMenu();
        //         menu.current = res;
        //     } catch (err) {
        //         console.log(err);
        //     }
        // };
        // dapatAllData();
    }, []);

    useEffect(() => {
        if (useEffectRan.current[0] === true) {
            setLoad(false);
            console.log(JSON.parse(data.data));
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

    const handleDel = (nama, metode) => {
        if (
            window.confirm(
                "Data menu " +
                    `${nama.replace(/-/g, " ")} (${metode})` +
                    " akan dihapus?"
            ) === true
        ) {
            const datalama = JSON.parse(data.data);
            console.log(datalama);
            let totalSemua;
            let totalDaily = 0;
            const menuSkrg = datalama.map((el) => {
                if (el.nama === nama) {
                    let jmlAkhir, jmlNonTunaiAkhir;
                    switch (metode) {
                        case "tunai":
                            jmlAkhir = Number(el.jumlahNonTunai);
                            jmlNonTunaiAkhir = el.jumlahNonTunai;
                            break;
                        case "non-tunai":
                            jmlAkhir =
                                Number(el.jumlah) - Number(el.jumlahNonTunai);
                            jmlNonTunaiAkhir = 0;
                            break;
                        default:
                            jmlAkhir = 0;
                            break;
                    }
                    const hargaTotalbaru = menu.current
                        .filter((element) => {
                            if (element.nama === nama) return true;
                        })
                        .map((element) => {
                            return Number(element.harga) * Number(jmlAkhir);
                        });
                    totalSemua = Number(hargaTotalbaru[0]);
                    totalDaily += totalSemua;
                    return {
                        nama: el.nama,
                        jumlah: jmlAkhir,
                        jumlahNonTunai: jmlNonTunaiAkhir,
                        harga: totalSemua,
                    };
                } else {
                    totalSemua = Number(el.harga);
                    totalDaily += totalSemua;
                    return el;
                }
            });
            const menuSkrgFilterJmlNol = menuSkrg
                .filter((el) => {
                    if (Number(el.jumlah) > 0) return true;
                })
                .map((el) => {
                    return el;
                });
            console.log(menuSkrgFilterJmlNol, totalSemua, totalDaily);
            async function editDaily() {
                const res = await updateDaily(
                    menuSkrgFilterJmlNol,
                    totalDaily,
                    window.location.pathname.slice(7)
                );
                if (res) window.location.reload();
            }
            editDaily();
        }
    };

    const handleEdit = () => {
        if (Number(jumlah) > 0) {
            const datalama = JSON.parse(data.data);
            let jumlahSemua = 0;
            let totalSemua = 0;
            let totalDaily = 0;
            const menuSkrg = datalama.map((el) => {
                if (el.nama === menuSelected.current[0]) {
                    const menuDataSelected = menu.current.filter(function (
                        el_child
                    ) {
                        return el_child.nama == menuSelected.current[0];
                    });
                    let cekJumlahNonTunai = 0;
                    if (menuSelected.current[1] == "tunai") {
                        console.log("ini edit tunai");
                        jumlahSemua = Number(el.jumlahNonTunai);
                        totalSemua =
                            Number(menuDataSelected[0].harga) *
                            Number(el.jumlahNonTunai);
                        cekJumlahNonTunai = el.jumlahNonTunai;
                    } else if (menuSelected.current[1] == "non-tunai") {
                        console.log("ini edit non tunai");
                        jumlahSemua =
                            Number(el.jumlah) - Number(el.jumlahNonTunai);
                        totalSemua =
                            Number(menuDataSelected[0].harga) *
                            (Number(el.jumlah) - Number(el.jumlahNonTunai));
                        cekJumlahNonTunai = jumlah;
                    } else {
                        jumlahSemua = 0;
                        totalSemua = 0;
                    }
                    jumlahSemua += Number(jumlah);
                    totalSemua += Number(total);

                    totalDaily += totalSemua;
                    console.log(
                        `${
                            totalDaily - totalSemua
                        } + ${totalSemua} = ${totalDaily}`
                    );
                    return {
                        nama: menuSelected.current[0],
                        jumlah: Number(jumlahSemua),
                        jumlahNonTunai: cekJumlahNonTunai,
                        harga: String(totalSemua),
                    };
                } else {
                    totalDaily += Number(el.harga);
                    console.log(
                        `${totalDaily - Number(el.harga)} + ${Number(
                            el.harga
                        )} = ${totalDaily}`
                    );
                    return el;
                }
            });

            const menuSkrgSelected = menuSkrg.filter(function (el_child) {
                return el_child.nama == menuSelected.current[0];
            });
            console.log(menuSkrg, totalSemua, totalDaily);
            async function editDaily() {
                const res = await updateDaily(
                    menuSkrg,
                    totalDaily,
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
                return el.nama == menuSelected.current[0];
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
                type: dataType,
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            btnDownloadTable.href = "data:" + dataType + ", " + tableHTML;
            btnDownloadTable.download = filename;
            // btnDownloadTable.click();
        }
    }

    function cetak() {
        window.print();
    }

    return (
        <>
            <div className="container no-print">
                <div className="d-flex align-items-center justify-content-center">
                    <h1 className="my-3 me-auto">Detail Daily Recap</h1>
                    <a className="btn btn-danger me-1" id="btnDownloadDetail">
                        <div className="d-flex justify-content-center align-items-center gap-2">
                            <i className="material-icons">file_download</i>{" "}
                            Download
                        </div>
                    </a>
                    <button className="btn btn-outline-danger" onClick={cetak}>
                        Print
                    </button>
                </div>
                {load ? (
                    ""
                ) : (
                    <h5>
                        Tanggal : {konversiTglPHP(data.tanggal.split(" ")[0])}
                    </h5>
                )}
                <table className="table table-striped" id="tabelDetail">
                    <thead>
                        <tr>
                            <th>Menu</th>
                            <th>Metode Bayar</th>
                            <th>Jumlah</th>
                            <th>Harga Satuan</th>
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
                                        <React.Fragment key={index}>
                                            {item.jumlahNonTunai != null ||
                                            item.jumlahNonTunai != undefined ? (
                                                <>
                                                    {Number(item.jumlah) -
                                                        Number(
                                                            item.jumlahNonTunai
                                                        ) >
                                                        0 && (
                                                        <tr>
                                                            <td>
                                                                {item.nama.replace(
                                                                    /-/g,
                                                                    " "
                                                                )}
                                                            </td>
                                                            <td>Tunai</td>
                                                            <td>
                                                                {Number(
                                                                    item.jumlah
                                                                ) -
                                                                    Number(
                                                                        item.jumlahNonTunai
                                                                    )}
                                                            </td>
                                                            <td>
                                                                Rp{" "}
                                                                {menu.current.map(
                                                                    (
                                                                        element
                                                                    ) => {
                                                                        if (
                                                                            element.nama ===
                                                                            item.nama
                                                                        )
                                                                            return numberWithCommas(
                                                                                element.harga
                                                                            );
                                                                    }
                                                                )}
                                                            </td>
                                                            <td>
                                                                {/* Rp{" "}
                                                    {numberWithCommas(
                                                        item.harga
                                                    )} */}
                                                                Rp{" "}
                                                                {menu.current.map(
                                                                    (
                                                                        element
                                                                    ) => {
                                                                        if (
                                                                            element.nama ===
                                                                            item.nama
                                                                        )
                                                                            return numberWithCommas(
                                                                                Number(
                                                                                    element.harga
                                                                                ) *
                                                                                    (Number(
                                                                                        item.jumlah
                                                                                    ) -
                                                                                        Number(
                                                                                            item.jumlahNonTunai
                                                                                        ))
                                                                            );
                                                                    }
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <button
                                                                        className="btn btn-light"
                                                                        onClick={() => {
                                                                            menuSelected.current =
                                                                                [
                                                                                    item.nama,
                                                                                    "tunai",
                                                                                ];
                                                                            setIsEdit(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-danger"
                                                                        onClick={() => {
                                                                            handleDel(
                                                                                item.nama,
                                                                                "tunai"
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
                                                    )}
                                                    {Number(
                                                        item.jumlahNonTunai
                                                    ) > 0 && (
                                                        <tr>
                                                            <td>
                                                                {item.nama.replace(
                                                                    /-/g,
                                                                    " "
                                                                )}
                                                            </td>
                                                            <td>Non Tunai</td>
                                                            <td>
                                                                {Number(
                                                                    item.jumlahNonTunai
                                                                )}
                                                            </td>
                                                            <td>
                                                                Rp{" "}
                                                                {menu.current.map(
                                                                    (
                                                                        element
                                                                    ) => {
                                                                        if (
                                                                            element.nama ===
                                                                            item.nama
                                                                        )
                                                                            return numberWithCommas(
                                                                                element.harga
                                                                            );
                                                                    }
                                                                )}
                                                            </td>
                                                            <td>
                                                                {/* Rp{" "}
                                                    {numberWithCommas(
                                                        item.harga
                                                    )} */}
                                                                Rp{" "}
                                                                {menu.current.map(
                                                                    (
                                                                        element
                                                                    ) => {
                                                                        if (
                                                                            element.nama ===
                                                                            item.nama
                                                                        )
                                                                            return numberWithCommas(
                                                                                Number(
                                                                                    element.harga
                                                                                ) *
                                                                                    Number(
                                                                                        item.jumlahNonTunai
                                                                                    )
                                                                            );
                                                                    }
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <button
                                                                        className="btn btn-light"
                                                                        onClick={() => {
                                                                            menuSelected.current =
                                                                                [
                                                                                    item.nama,
                                                                                    "non-tunai",
                                                                                ];
                                                                            setIsEdit(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-danger"
                                                                        onClick={() => {
                                                                            handleDel(
                                                                                item.nama,
                                                                                "non-tunai"
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
                                                    )}
                                                </>
                                            ) : (
                                                <tr>
                                                    <td>
                                                        {item.nama.replace(
                                                            /-/g,
                                                            " "
                                                        )}
                                                    </td>
                                                    <td>Tidak diketahui</td>
                                                    <td>{item.jumlah}</td>
                                                    <td>
                                                        Rp{" "}
                                                        {menu.current.map(
                                                            (element) => {
                                                                if (
                                                                    element.nama ===
                                                                    item.nama
                                                                )
                                                                    return numberWithCommas(
                                                                        element.harga
                                                                    );
                                                            }
                                                        )}
                                                    </td>
                                                    <td>
                                                        Rp{" "}
                                                        {numberWithCommas(
                                                            item.harga
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-light"
                                                                onClick={() => {
                                                                    menuSelected.current =
                                                                        [
                                                                            item.nama,
                                                                            false,
                                                                        ];
                                                                    setIsEdit(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={() => {
                                                                    handleDel(
                                                                        item.nama,
                                                                        false
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
                                            )}
                                        </React.Fragment>
                                    ))}
                            </>
                        )}
                        <tr>
                            <th colSpan={4}>Total Keseluruhan : </th>
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
                                Edit Menu{" "}
                                {menuSelected.current[0].replace(/-/g, " ")} (
                                {menuSelected.current[1]})
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

            <div className="print">
                <div className="container">
                    <img
                        src="../img/logo.png"
                        className="mx-auto d-block mt-2 mb-1"
                    />
                    {load ? (
                        ""
                    ) : (
                        <h5>
                            Recap Tanggal :{" "}
                            {konversiTglPHP(data.tanggal.split(" ")[0])}
                        </h5>
                    )}
                    <p>-------------------------------------</p>
                    <table>
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
                                        .map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td
                                                        style={{
                                                            paddingRight:
                                                                "10px",
                                                        }}
                                                    >
                                                        {item.jumlah}
                                                    </td>
                                                    <td className="text-start">
                                                        {item.nama.replace(
                                                            /-/g,
                                                            " "
                                                        )}
                                                    </td>
                                                    <td>
                                                        {numberWithCommas(
                                                            item.harga
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    <tr>
                                        <th colSpan={2}></th>
                                        <th
                                            style={{
                                                paddingBlock: "0px",
                                                lineHeight: "5px",
                                            }}
                                        >
                                            ---------
                                        </th>
                                    </tr>
                                    <tr>
                                        <th colSpan={2} className="text-end">
                                            Total :
                                        </th>
                                        <th>
                                            Rp {numberWithCommas(data.total)}
                                        </th>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
