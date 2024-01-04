import { useEffect, useRef, useState } from "react";
import { delDaily, getAllDaily } from "../global/Fetch";
import { konversiTglPHP, numberWithCommas } from "../global/Variables";
import { Link } from "react-router-dom";

export default function Daily() {
    const useEffectRan = useRef([false]);
    // const cekIndexList = useRef([]);
    const cekTotalList = useRef([]);
    const [renderSkuy, setRenderSkuy] = useState(false);
    const [data, setData] = useState([]);
    useEffect(() => {
        const dapatData = async () => {
            try {
                const res = await getAllDaily();
                if (res) setData(res);
            } catch (err) {
                console.log(err);
            }
        };
        dapatData();
    }, []);

    useEffect(() => {
        if (useEffectRan.current[0] === true) {
            let elmSblm = "";
            let cekInd = 0;
            data.forEach((item, ind) => {
                const bulan = item.tanggal.split(" ")[0].split("-")[1];
                if (bulan !== elmSblm) {
                    // cekIndexList.current.push(ind);
                    cekTotalList.current[ind] = Number(item.total);
                    elmSblm = bulan;
                    cekInd = ind;
                } else {
                    cekTotalList.current[cekInd] += Number(item.total);
                }
            });
            setRenderSkuy((prev) => !prev);
            // console.log(cekIndexList.current);
            // console.log(cekTotalList.current);
            exportTableToExcel();
        }
        return () => {
            useEffectRan.current[0] = true;
        };
    }, [data]);

    function handleDelDaily(tgl) {
        if (
            window.confirm(
                "Data tanggal " + konversiTglPHP(tgl) + " akan dihapus?"
            ) == true
        ) {
            async function hapus() {
                const res = await delDaily(tgl);
                if (res.status === "berhasil") window.location.reload();
                else console.log(res);
            }
            hapus();
        }
    }

    function exportTableToExcel(filename = "") {
        var dataType = "application/vnd.ms-excel";
        var tableSelect = document.getElementById("tabelDaily");
        var btnDownloadTable = document.getElementById("btnDownloadDaily");
        var tableHTML = tableSelect.outerHTML.replace(/ /g, "%20");

        // Specify file name
        filename = filename ? filename + ".xls" : "Daily_Recap.xls";

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
                <h1 className="my-3">Daily Recap</h1>
                <a className="btn btn-danger" id="btnDownloadDaily">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <i className="material-icons">file_download</i>
                        <p className="m-0">Download Daily Recap</p>
                    </div>
                </a>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Total</th>
                        <th>Total per Bulan</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        <>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        {konversiTglPHP(
                                            item.tanggal.split(" ")[0]
                                        ) +
                                            " " +
                                            item.tanggal.split(" ")[1]}
                                    </td>
                                    <td>Rp {numberWithCommas(item.total)}</td>
                                    <td>
                                        {cekTotalList.current[index] &&
                                            "Rp " +
                                                numberWithCommas(
                                                    cekTotalList.current[index]
                                                )}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link
                                                className="btn btn-outline-dark"
                                                to={
                                                    "/daily/" +
                                                    item.tanggal.split(" ")[0]
                                                }
                                            >
                                                Detail
                                            </Link>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => {
                                                    handleDelDaily(
                                                        item.tanggal.split(
                                                            " "
                                                        )[0]
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
                            <td colSpan={2} className="text-center">
                                Tidak ada data harian
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* tabel excel */}
            <table style={{ display: "none" }} id="tabelDaily">
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Total</th>
                        <th>Total per Bulan</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        <>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        {konversiTglPHP(
                                            item.tanggal.split(" ")[0]
                                        ) +
                                            " " +
                                            item.tanggal.split(" ")[1]}
                                    </td>
                                    <td>Rp {numberWithCommas(item.total)}</td>
                                    <td>
                                        {cekTotalList.current[index] &&
                                            "Rp " +
                                                numberWithCommas(
                                                    cekTotalList.current[index]
                                                )}
                                    </td>
                                </tr>
                            ))}
                        </>
                    ) : (
                        <tr>
                            <td colSpan={2} className="text-center">
                                Tidak ada data harian
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
