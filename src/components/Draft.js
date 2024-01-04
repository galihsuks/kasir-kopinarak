import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Draft() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    useEffect(() => {
        const dapatData = async () => {
            try {
                const res = localStorage.getItem("draft");
                if (res) setData(JSON.parse(res));
            } catch (err) {
                console.log(err);
            }
        };
        dapatData();
    }, []);

    function delDraft(index) {
        const draftItem = data
            .filter((obj, ind) => {
                if (ind === index) return false;
                return true;
            })
            .map((obj) => {
                return obj;
            });
        setData(draftItem);
        localStorage.setItem("draft", JSON.stringify(draftItem));
    }
    function pilihDraft(index) {
        sessionStorage.setItem("selected_draft", JSON.stringify(data[index]));
        delDraft(index);
        navigate("/", { replace: true });
    }
    return (
        <div className="container">
            <h1 className="mt-3">Draft</h1>
            <p>*Draft hanya tersimpan pada browser dan komputer yang sama</p>
            <table className="table">
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Atas Nama</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        <>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.tanggal}</td>
                                    <td>{item.atasNama}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-light"
                                                onClick={() => {
                                                    pilihDraft(index);
                                                }}
                                            >
                                                Pilih
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => {
                                                    delDraft(index);
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
                                Tidak ada draft
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
