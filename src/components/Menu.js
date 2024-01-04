import { useEffect, useState } from "react";
import { delMenu, getAllMenu } from "../global/Fetch";
import { numberWithCommas } from "../global/Variables";
import { Link } from "react-router-dom";

export default function Menu() {
    const [data, setData] = useState([]);
    useEffect(() => {
        const dapatData = async () => {
            try {
                const res = await getAllMenu();
                if (res) setData(res);
            } catch (err) {
                console.log(err);
            }
        };
        dapatData();
    }, []);
    function handleDelMenu(id, nama) {
        if (window.confirm("Menu " + nama + " akan dihapus?") == true) {
            async function hapus() {
                const res = await delMenu(id);
                window.location.reload();
            }
            hapus();
        }
    }
    return (
        <div className="container">
            <div className="d-flex align-items-center justify-content-between">
                <h1 className="my-3">Menu</h1>
                <Link to={"/addmenu"} className="btn btn-outline-dark">
                    Tambah Menu
                </Link>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Nama</th>
                        <th>Jenis</th>
                        <th>Harga</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        <>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.nama.replace(/-/g, " ")}</td>
                                    <td>
                                        {item.makanan === "1"
                                            ? "Makan"
                                            : "Minum"}
                                    </td>
                                    <td>Rp {numberWithCommas(item.harga)}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Link
                                                className="btn btn-light"
                                                to={"/menu/" + item.id}
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => {
                                                    handleDelMenu(
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
                                Tidak ada menu
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
