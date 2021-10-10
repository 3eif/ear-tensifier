module.exports = (milliseconds) => {
    if (milliseconds > 3600000000) return 'Live';
    if (milliseconds === 0) return "00:00";

    const times = {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    };

    while (milliseconds > 0) {
        if (milliseconds - 31557600000 >= 0) {
            milliseconds -= 31557600000;
            times.years++;
        } else if (milliseconds - 2628000000 >= 0) {
            milliseconds -= 2628000000;
            times.months++;
        } else if (milliseconds - 604800000 >= 0) {
            milliseconds -= 604800000;
            times.weeks += 7;
        } else if (milliseconds - 86400000 >= 0) {
            milliseconds -= 86400000;
            times.days++;
        } else if (milliseconds - 3600000 >= 0) {
            milliseconds -= 3600000;
            times.hours++;
        } else if (milliseconds - 60000 >= 0) {
            milliseconds -= 60000;
            times.minutes++;
        } else {
            times.seconds = Math.round(milliseconds / 1000);
            milliseconds = 0;
        }
    }

    let finalTime = [];
    let first = false;

    for (const [k, v] of Object.entries(times)) {
        if (v === 0 && !first) continue;
        finalTime.push(v < 10 ? `0${v}` : `${v}`);
        first = true;
        continue;
        if (v > 0) finalTime.push(`${v} ${v > 1 ? k : k.slice(0, -1)}`);
    }

    if (finalTime.length === 1) finalTime.unshift("00");

    let time = finalTime.join(":");

    if (time.includes(",")) {
        const pos = time.lastIndexOf(",");
        time = `${time.slice(0, pos)} and ${time.slice(pos + 1)}`;
    }

    return time;
};