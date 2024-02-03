import React, { useEffect, useRef, useState } from "react";
import { getTanggal, numberWithCommas } from "../global/Variables";
import { addDaily, getAllMenu, getAllStok, updateStok } from "../global/Fetch";

export default function Dashboard() {
    const useRefCek = useRef([false]);
    const [menu, setMenu] = useState();
    const [menuFilter, setMenuFilter] = useState();
    const [cari, setCari] = useState("");
    const [pesanan, setPesanan] = useState([]);
    const subtotal = useRef(0);
    const waktu = useRef(0);
    const [diskon, setDiskon] = useState(0);
    const [total, setTotal] = useState(0);
    const [cash, setCash] = useState(0);
    const [metode, setMetode] = useState("tunai");
    const [kembali, setKembali] = useState(0);
    const [an, setAn] = useState("");
    const [anSign, setAnSign] = useState(false);
    const trigerDaily = useRef();
    const [isiToast, setIsiToast] = useState("");
    const stokCurrent = useRef([]);
    const cekStokHabis = useRef(false);
    const idStokUpdate = useRef([]);

    useEffect(() => {
        const dapatStok = async () => {
            try {
                const res = await getAllStok();
                if (res) stokCurrent.current = Array.from(res);
            } catch (err) {
                console.log(err);
            }
        };
        dapatStok();
        const dapatData = async () => {
            try {
                const res = await getAllMenu();
                setMenu(res);
                setMenuFilter(res);
            } catch (err) {
                console.log(err);
            }
        };
        dapatData();

        if (sessionStorage.getItem("selected_draft")) {
            const dariDraft = JSON.parse(
                sessionStorage.getItem("selected_draft")
            );
            subtotal.current = dariDraft.subtotal;
            setPesanan(dariDraft.pesanan);
            setAn(dariDraft.atasNama);
            sessionStorage.removeItem("selected_draft");
        }
    }, []);

    useEffect(() => {
        if (useRefCek.current[0]) {
            const dapatStok = async () => {
                try {
                    const stok = await getAllStok();
                    stokCurrent.current = stok;
                    idStokUpdate.current = [];
                    cekStokHabis.current = false;
                    pesanan.forEach((ePesanan) => {
                        // console.log(ePesanan);
                        let bahan;
                        if (ePesanan.dingin)
                            bahan = JSON.parse(ePesanan.bahan_dingin);
                        else bahan = JSON.parse(ePesanan.bahan);
                        // console.log(bahan);
                        bahan.forEach((eBahan) => {
                            stokCurrent.current.forEach((eStok, ind) => {
                                if (eStok.nama === eBahan.nama) {
                                    stokCurrent.current[ind].nominal =
                                        Number(
                                            stokCurrent.current[ind].nominal
                                        ) -
                                        eBahan.nominal * ePesanan.jumlah;
                                    if (!idStokUpdate.current.includes(ind))
                                        idStokUpdate.current.push(ind);
                                }
                                if (stokCurrent.current[ind].nominal < 0) {
                                    cekStokHabis.current = true;
                                    callToast(
                                        "Stok " +
                                            stokCurrent.current[
                                                ind
                                            ].nama.replace(/-/g, " ") +
                                            " tidak mencukupi",
                                        "bg-danger",
                                        "text-white"
                                    );
                                }
                            });
                        });
                        // console.log(stokCurrent.current);
                        // console.log(idStokUpdate.current);
                    });
                } catch (err) {
                    console.log(err);
                }
            };
            dapatStok();
        }
        return () => {
            useRefCek.current[0] = true;
        };
    }, [pesanan]);

    function handleCari(e) {
        const searchItem = e.target.value;
        setCari(searchItem);
        const filteredItems = menu.filter((item) => {
            return item.nama
                .toLowerCase()
                .replace("-", " ")
                .includes(cari.toLowerCase());
        });
        setMenuFilter(filteredItems);
    }
    function remAll() {
        subtotal.current = 0;
        setPesanan([]);
    }
    function addItem(item, dingin) {
        let itemnya = Object.assign({}, item);
        itemnya.dingin = dingin;
        itemnya.jumlah = 1;
        let cek = 0;
        pesanan.forEach((isi, index) => {
            if (item.id === isi.id && dingin === isi.dingin) {
                cek = index + 1;
            }
        });
        const menunya = [...pesanan];
        if (!cek) {
            subtotal.current += Number(item.harga);
            setPesanan([...pesanan, itemnya]);
        } else {
            menunya[cek - 1].jumlah = Number(menunya[cek - 1].jumlah) + 1;
            subtotal.current += Number(menunya[cek - 1].harga);
            setPesanan(menunya);
        }
    }
    function remItem(index) {
        const menunya = pesanan.map((obj) => ({ ...obj }));
        subtotal.current -= pesanan[index].harga * pesanan[index].jumlah;
        menunya.splice(index, 1);
        setPesanan(menunya);
    }
    function cetak() {
        const wkt = new Date();
        const str_waktu =
            ("00" + String(wkt.getHours())).substring(
                ("00" + String(wkt.getHours())).length - 2
            ) +
            ":" +
            ("00" + String(wkt.getMinutes())).substring(
                ("00" + String(wkt.getMinutes())).length - 2
            ) +
            ":" +
            ("00" + String(wkt.getSeconds())).substring(
                ("00" + String(wkt.getSeconds())).length - 2
            );
        waktu.current.innerHTML = str_waktu;
        window.print();
    }
    function masukDaily() {
        if (cekStokHabis.current) {
            return callToast("Stok ada yang kurang", "bg-danger", "text-white");
        }
        if (pesanan.length <= 0) {
            return callToast(
                "Daftar belanja kosong",
                "bg-danger",
                "text-white"
            );
        }
        if (cash < total) {
            return callToast("Cash kurang", "bg-danger", "text-white");
        }
        async function addDailyTrig() {
            const res = await addDaily(total, pesanan, diskon, metode);
            idStokUpdate.current.forEach((eId, index, array) => {
                const dataPostStok = {
                    id: stokCurrent.current[eId].id,
                    nominal: stokCurrent.current[eId].nominal,
                };
                updateStok(dataPostStok);
                if (index === array.length - 1) remAll();
            });
            // console.log(pesanan);
        }
        addDailyTrig();
        callToast(
            "Pesanan sudah dimasukkan ke harian",
            "bg-success",
            "text-white"
        );
        remAll();
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
            if (window.location.pathname === "/") {
                trigerDaily.current.classList.remove("active");
                trigerDaily.current.classList.remove("bg-success");
                trigerDaily.current.classList.remove("bg-danger");
                trigerDaily.current.classList.remove("text-white");
            }
        }, 3000);
    }
    function masukDraft() {
        if (pesanan.length <= 0) {
            return callToast(
                "Daftar belanja kosong",
                "bg-danger",
                "text-white"
            );
        }
        if (an === "") {
            return callToast(
                "Masukkan nama pelanggan terlebih dahulu",
                "bg-danger",
                "text-white"
            );
        }
        const wkt = new Date();
        const str_waktu =
            ("00" + String(wkt.getHours())).substring(
                ("00" + String(wkt.getHours())).length - 2
            ) +
            ":" +
            ("00" + String(wkt.getMinutes())).substring(
                ("00" + String(wkt.getMinutes())).length - 2
            ) +
            ":" +
            ("00" + String(wkt.getSeconds())).substring(
                ("00" + String(wkt.getSeconds())).length - 2
            );
        const draftItem = {
            pesanan: pesanan,
            atasNama: an,
            tanggal: getTanggal() + " " + str_waktu,
            subtotal: subtotal.current,
        };
        let draftLocal = localStorage.getItem("draft");
        if (draftLocal) {
            let a = JSON.parse(draftLocal);
            a.push(draftItem);
            localStorage.setItem("draft", JSON.stringify(a));
        } else {
            localStorage.setItem("draft", JSON.stringify([draftItem]));
        }
        callToast(
            "Pesanan sudah dimasukkan ke draft",
            "bg-success",
            "text-white"
        );
        remAll();
    }

    useEffect(() => {
        setTotal(((100 - diskon) / 100) * subtotal.current);
    }, [diskon, pesanan]);
    useEffect(() => {
        setKembali(cash - total);
    }, [cash, total]);
    useEffect(() => {
        if (an === "") {
            setAnSign(true);
        } else {
            setAnSign(false);
        }
    }, [an]);
    return (
        <>
            <div className="container no-print mt-4">
                <div className="toast align-items-center" ref={trigerDaily}>
                    <div className="d-flex">
                        <div className="toast-body">{isiToast}</div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <h3>Menu</h3>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Cari Menu"
                            value={cari}
                            onChange={handleCari}
                        />
                        {menu ? (
                            <div>
                                {cari === ""
                                    ? menu.map((item, index) => {
                                          return item.makanan === "1" ? (
                                              <button
                                                  key={index}
                                                  className="btn btn-dark position-relative m-2 menu"
                                                  onClick={() => {
                                                      addItem(item, false);
                                                  }}
                                              >
                                                  {item.nama.replace(/-/g, " ")}
                                              </button>
                                          ) : (
                                              <button
                                                  key={index}
                                                  className="btn btn-dark position-relative m-2 menu"
                                              >
                                                  {item.nama.replace(/-/g, " ")}
                                                  <div className="gap-2 container-collapse">
                                                      <p
                                                          className="m-0 p-hover"
                                                          onClick={() => {
                                                              addItem(
                                                                  item,
                                                                  false
                                                              );
                                                          }}
                                                      >
                                                          Hot
                                                      </p>
                                                      <p
                                                          className="m-0 p-hover"
                                                          onClick={() => {
                                                              addItem(
                                                                  item,
                                                                  true
                                                              );
                                                          }}
                                                      >
                                                          Ice
                                                      </p>
                                                  </div>
                                              </button>
                                          );
                                      })
                                    : menuFilter.map((item, index) => {
                                          return item.makanan === "1" ? (
                                              <button
                                                  key={index}
                                                  className="btn btn-dark position-relative m-2 menu"
                                                  onClick={() => {
                                                      addItem(item, false);
                                                  }}
                                              >
                                                  {item.nama.replace(/-/g, " ")}
                                              </button>
                                          ) : (
                                              <button
                                                  key={index}
                                                  className="btn btn-dark position-relative m-2 menu"
                                              >
                                                  {item.nama.replace(/-/g, " ")}
                                                  <div className="gap-2 container-collapse">
                                                      <p
                                                          className="m-0 p-hover"
                                                          onClick={() => {
                                                              addItem(
                                                                  item,
                                                                  false
                                                              );
                                                          }}
                                                      >
                                                          Hot
                                                      </p>
                                                      <p
                                                          className="m-0 p-hover"
                                                          onClick={() => {
                                                              addItem(
                                                                  item,
                                                                  true
                                                              );
                                                          }}
                                                      >
                                                          Ice
                                                      </p>
                                                  </div>
                                              </button>
                                          );
                                      })}
                            </div>
                        ) : (
                            <p>Memuat...</p>
                        )}
                    </div>
                    <div className="col-7">
                        <div className="d-flex justify-content-between">
                            <h3>Daftar Belanja</h3>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-outline-dark"
                                    onClick={masukDraft}
                                >
                                    Save to draft
                                </button>
                                <button
                                    className="btn btn-outline-dark"
                                    onClick={masukDaily}
                                >
                                    Payment
                                </button>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={remAll}
                                >
                                    Delete All
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={cetak}
                                    disabled={cash >= total ? false : true}
                                >
                                    Print
                                </button>
                            </div>
                        </div>
                        <div className="container-table">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Menu</th>
                                        <th scope="col">Jumlah</th>
                                        <th scope="col">Harga</th>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pesanan.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                {item.makanan === "1" ? (
                                                    <td>
                                                        {item.nama.replace(
                                                            /-/g,
                                                            " "
                                                        )}
                                                    </td>
                                                ) : (
                                                    <td>
                                                        {item.nama.replace(
                                                            /-/g,
                                                            " "
                                                        ) +
                                                            " (" +
                                                            (item.dingin
                                                                ? "Ice"
                                                                : "Hot") +
                                                            ")"}
                                                    </td>
                                                )}
                                                <td>{item.jumlah}</td>
                                                <td>
                                                    Rp{" "}
                                                    {numberWithCommas(
                                                        item.harga * item.jumlah
                                                    )}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-light"
                                                        onClick={() => {
                                                            remItem(index);
                                                        }}
                                                    >
                                                        <i className="material-icons">
                                                            delete_forever
                                                        </i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <th colSpan={2}>Sub Total</th>
                                    <th>
                                        Rp {numberWithCommas(subtotal.current)}
                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan={2}>Diskon</th>
                                    <th>
                                        <div className="input-group flex-nowrap">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Diskon"
                                                onChange={(e) => {
                                                    setDiskon(e.target.value);
                                                }}
                                            />
                                            <span
                                                className="input-group-text"
                                                id="addon-wrapping"
                                            >
                                                %
                                            </span>
                                        </div>
                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan={2}>Total</th>
                                    <th>Rp {numberWithCommas(total)}</th>
                                </tr>
                                <tr>
                                    <th colSpan={2}>Pembayaran</th>
                                    <th>
                                        <div className="input-group flex-nowrap mb-1">
                                            <span
                                                className="input-group-text"
                                                id="addon-wrapping"
                                            >
                                                Rp
                                            </span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Nominal"
                                                onChange={(e) => {
                                                    setCash(e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <select
                                                className="form-select"
                                                aria-label="Default select example"
                                                value={metode}
                                                onChange={(e) => {
                                                    setMetode(e.target.value);
                                                }}
                                            >
                                                <option value="tunai">
                                                    Tunai
                                                </option>
                                                <option value="non-tunai">
                                                    Non-tunai
                                                </option>
                                            </select>
                                        </div>
                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan={2}>Kembali</th>
                                    {cash >= total ? (
                                        <th>Rp {numberWithCommas(kembali)}</th>
                                    ) : (
                                        <th className="text-danger">
                                            Cash kurang
                                        </th>
                                    )}
                                </tr>
                                <tr>
                                    <th colSpan={2}>Atas Nama</th>
                                    <th>
                                        <input
                                            type="text"
                                            className={
                                                anSign
                                                    ? "form-control is-invalid"
                                                    : "form-control"
                                            }
                                            placeholder="Atas Nama"
                                            value={an}
                                            onChange={(e) => {
                                                setAn(e.target.value);
                                            }}
                                        />
                                        <div className="invalid-feedback">
                                            Masukan nama pelanggan
                                        </div>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="print">
                <div className="container">
                    <img src="img/logo.png" className="mx-auto d-block mt-2" />
                    <p className="mb-0">Kradenan, Trucuk, Klaten</p>
                    <p className="mb-0 lh-1">Telp. 0851-8234-9672</p>
                    <div className="d-flex justify-content-between mt-3">
                        <p className="mb-0 lh-1">{getTanggal()}</p>
                        <p className="mb-0 lh-1" ref={waktu}></p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="mb-0 lh-1">Atas nama</p>
                        <p className="mb-0 lh-1">{an}</p>
                    </div>
                    <p className="mb-0">
                        -------------------------------------
                    </p>
                    <table>
                        <tbody>
                            {pesanan.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        {item.jumlah > 0 ? (
                                            <tr>
                                                <td
                                                    style={{
                                                        paddingRight: "10px",
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
                                                        item.harga * item.jumlah
                                                    )}
                                                </td>
                                            </tr>
                                        ) : (
                                            ""
                                        )}
                                    </React.Fragment>
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
                                    Sub Total :
                                </th>
                                <th>{numberWithCommas(subtotal.current)}</th>
                            </tr>
                            <tr>
                                <th colSpan={2} className="text-end">
                                    Diskon :
                                </th>
                                <th>{diskon}%</th>
                            </tr>
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
                                <th>{numberWithCommas(total)}</th>
                            </tr>
                            <tr>
                                <th colSpan={2} className="text-end">
                                    Cash :
                                </th>
                                <th>{numberWithCommas(cash)}</th>
                            </tr>
                            <tr>
                                <th colSpan={2} className="text-end">
                                    Kembali :
                                </th>
                                <th>{numberWithCommas(kembali)}</th>
                            </tr>
                        </tbody>
                    </table>
                    <p className="mb-0">
                        -------------------------------------
                    </p>
                    <p className="mb-0 lh-1">
                        Terima kasih sudah mengunjungi @ko.pinarak
                    </p>
                </div>
                <span className="d-block mt-4" style={{ color: "whitesmoke" }}>
                    -----------------------------------------
                </span>
                <div className="container">
                    <img src="img/logo.png" className="mx-auto d-block mt-2" />
                    <p className="mb-0">Kradenan, Trucuk, Klaten</p>
                    <p className="mb-0 lh-1">Telp. 0851-8234-9672</p>
                    <div className="d-flex justify-content-between mt-3">
                        <p className="mb-0 lh-1">{getTanggal()}</p>
                        <p className="mb-0 lh-1" ref={waktu}></p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="mb-0 lh-1">Atas nama</p>
                        <p className="mb-0 lh-1">{an}</p>
                    </div>
                    <p className="mb-0">
                        -------------------------------------
                    </p>
                    <table>
                        <tbody>
                            {pesanan.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        {item.jumlah > 0 ? (
                                            <tr>
                                                <td
                                                    style={{
                                                        paddingRight: "10px",
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
                                                        item.harga * item.jumlah
                                                    )}
                                                </td>
                                            </tr>
                                        ) : (
                                            ""
                                        )}
                                    </React.Fragment>
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
                                    Sub Total :
                                </th>
                                <th>{numberWithCommas(subtotal.current)}</th>
                            </tr>
                            <tr>
                                <th colSpan={2} className="text-end">
                                    Diskon :
                                </th>
                                <th>{diskon}%</th>
                            </tr>
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
                                <th>{numberWithCommas(total)}</th>
                            </tr>
                            <tr>
                                <th colSpan={2} className="text-end">
                                    Cash :
                                </th>
                                <th>{numberWithCommas(cash)}</th>
                            </tr>
                            <tr>
                                <th colSpan={2} className="text-end">
                                    Kembali :
                                </th>
                                <th>{numberWithCommas(kembali)}</th>
                            </tr>
                        </tbody>
                    </table>
                    <p className="mb-0">
                        -------------------------------------
                    </p>
                    <p className="mb-0 lh-1">
                        Terima kasih sudah mengunjungi @ko.pinarak
                    </p>
                </div>
            </div>
        </>
    );
}
