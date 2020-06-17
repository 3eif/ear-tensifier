const { Utils } = require('@tetracyl/erela.js');

module.exports = (duration) => {
    if(isNaN(duration) || typeof duration === 'undefined') return '00:00';
    return Utils.formatTime(duration, true);
};