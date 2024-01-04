export function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
}
export function getTanggal() {
    const tgl = new Date();
    const arrDay = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    const arrMonth = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    const str_tgl =
        arrDay[tgl.getDay()] +
        ", " +
        tgl.getDate() +
        " " +
        arrMonth[tgl.getMonth()] +
        " " +
        tgl.getFullYear();
    const str_waktu =
        ("00" + String(tgl.getHours())).substring(
            ("00" + String(tgl.getHours())).length - 2
        ) +
        ":" +
        ("00" + String(tgl.getMinutes())).substring(
            ("00" + String(tgl.getMinutes())).length - 2
        ) +
        ":" +
        ("00" + String(tgl.getSeconds())).substring(
            ("00" + String(tgl.getSeconds())).length - 2
        );
    return str_tgl;
}
export function konversiTglPHP(str) {
    const arrMonth = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    const arr_tgl = str.split("-");
    return (
        arr_tgl[2] + " " + arrMonth[Number(arr_tgl[1]) - 1] + " " + arr_tgl[0]
    );
}
