import axios from "axios";
axios.defaults.baseURL = "https://amagabar.com/api-kopinarak/";
//get semua siswa
export const getAllMenu = async () => {
    try {
        const res = await axios.get("api.php?function=getAllMenu");
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const getMenu = async (id) => {
    try {
        const res = await axios.get("api.php?function=getMenu&id=" + id);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const updateMenu = async (body) => {
    try {
        const res = await axios.post(
            "api.php?function=updateMenu",
            JSON.stringify(body)
        );
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const addMenu = async (body) => {
    try {
        const res = await axios.post(
            "api.php?function=addMenu",
            JSON.stringify(body)
        );
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const delMenu = async (id) => {
    try {
        const res = await axios.get("api.php?function=delMenu&id=" + id);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const getAllDaily = async () => {
    try {
        const res = await axios.get("api.php?function=getAllDaily");
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const getDaily = async (tgl) => {
    try {
        const res = await axios.get("api.php?function=getDaily&tgl=" + tgl);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const addDaily = async (total, pesanan, diskon) => {
    try {
        let cek = [];
        let cek_i = [];
        let dataFilter = [];
        pesanan.forEach((obj) => {
            if (!cek.includes(obj.nama)) {
                cek.push(obj.nama);
                cek_i.push(dataFilter.length);
                const bufObj = {
                    nama: obj.nama,
                    harga: Number(obj.harga) * Number(obj.jumlah),
                    jumlah: obj.jumlah
                };
                dataFilter.push(bufObj);
            } else {
                dataFilter[cek_i[cek.indexOf(obj.nama)]].harga =
                    Number(dataFilter[cek_i[cek.indexOf(obj.nama)]].harga) +
                    Number(obj.harga) * Number(obj.jumlah);
                dataFilter[cek_i[cek.indexOf(obj.nama)]].jumlah =
                    Number(dataFilter[cek_i[cek.indexOf(obj.nama)]].jumlah) +
                    Number(obj.jumlah);
            }
        });

        const dataFilter1 = dataFilter.map((a) => {
            return {
                nama: a.nama,
                jumlah: a.jumlah,
                harga: String(((100 - diskon) / 100) * a.harga)
            };
        });
        axios
            .post(
                "api.php?function=addDaily",
                JSON.stringify({
                    total: total,
                    data: dataFilter1
                })
            )
            .then((res) => {
                return res;
            });
    } catch (err) {
        console.log(err);
    }
};
export const delDaily = async (tgl) => {
    try {
        const res = await axios.get("api.php?function=delDaily&tgl=" + tgl);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const updateDaily = async (data, total, tgl) => {
    try {
        const res = await axios.post(
            "api.php?function=updateDaily&tgl=" + tgl,
            JSON.stringify({
                total: total,
                data: data
            })
        );
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const getAllStok = async () => {
    try {
        const res = await axios.get("api.php?function=getAllStok");
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const getStok = async (id) => {
    try {
        const res = await axios.get("api.php?function=getStok&id=" + id);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const updateStok = async (body) => {
    try {
        const res = await axios.post(
            "api.php?function=updateStok",
            JSON.stringify(body)
        );
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const addStok = async (body) => {
    try {
        const res = await axios.post(
            "api.php?function=addStok",
            JSON.stringify(body)
        );
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const delStok = async (id) => {
    try {
        const res = await axios.get("api.php?function=delStok&id=" + id);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
