module.exports = (t) => {
    if (Number(t) != 0 && !isNaN(Number(t)) && t != undefined && t != null && (typeof t == 'string' || typeof t == 'number')) {
        t = Number(t);
        const pad = n => n.toString().padStart(2, '0');
        const h = pad(Math.floor(+t / 3600));
        const m = pad(Math.floor(+t % 3600 / 60));
        const s = pad(Math.floor(+t % 3600 % 60));
        return (h == 0 && m == 0) ? ('00:' + s) : (h == 0) ? (m + ':' + s) : (h + ':' + m + ':' + s);
    }
    else if (typeof t == 'string' && t.indexOf(':') != -1) {
        const parts = t.split(':');
        if (parts.length == 3) {
            const h = Number(parts[0]);
            const m = Number(parts[1]);
            const s = Number(parts[2]);
            if (!isNaN(h) && !isNaN(m) && !isNaN(s)) {
                return (h * 3600) + (m * 60) + s;
            }
        }
        else if (parts.length == 2) {
            const m = Number(parts[0]);
            const s = Number(parts[1]);
            if (!isNaN(m) && !isNaN(s)) {
                return (m * 60) + s;
            }
        }
    }
    else {
        return undefined;
    }
};