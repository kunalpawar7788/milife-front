export default {
    round_off: function(value, precision) {
        if (precision > 0){
            let factor = 10 ** precision;
            return Math.round(value * factor) / factor;
        }
        return Math.round(value);
    },

}
