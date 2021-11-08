module.exports = (seconds) => {
    if (Number(seconds) != 0 && !isNaN(Number(seconds)) && seconds != undefined && seconds != null && (typeof seconds == 'string' || typeof seconds == 'number')) {
        seconds = Number(seconds);
        const pad = n => n.toString().padStart(2, '0');
        const h = pad(Math.floor(+seconds / 3600));
        const m = pad(Math.floor(+seconds % 3600 / 60));
        const s = pad(Math.floor(+seconds % 3600 % 60));
        return (h == 0 && m == 0) ? ('00:' + s) : (h == 0) ? (m + ':' + s) : (h + ':' + m + ':' + s);
    }
    else {
        return undefined;
    }
};