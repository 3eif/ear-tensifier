const { Structure } = require("erela.js");

module.exports = Structure.extend('Queue', Queue => {
    class queue extends Queue {
        constructor(...args) {
            super(...args);
        }

        add(track, offset) {
            // if (!Utils_1.TrackUtils.validate(track)) {
            //     throw new RangeError('Track must be a "Track" or "Track[]".');
            // }
            if (!this.current) {
                if (!Array.isArray(track)) {
                    this.current = track;
                    return;
                }
                else {
                    this.current = (track = [...track]).shift();
                }
            }
            if (typeof offset !== "undefined" && typeof offset === "number") {
                if (isNaN(offset)) {
                    throw new RangeError("Offset must be a number.");
                }
                if (offset < 0 || offset > this.length) {
                    throw new RangeError(`Offset must be or between 0 and ${this.length}.`);
                }
            }
            if (typeof offset === "undefined" && typeof offset !== "number") {
                if (track instanceof Array)
                    this.push(...track);
                else
                    this.push(track);
            }
            else {
                if (track instanceof Array)
                    this.splice(offset, 0, ...track);
                else
                    this.splice(offset, 0, track);
            }
        }
    }
    return queue;
});