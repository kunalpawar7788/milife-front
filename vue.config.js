module.exports = {
    css: {
        loaderOptions: {
            sass: {
                data: `
                    @import "~@/scss/_typo.scss";
                    @import "~@/scss/global.scss";
                `
            }
        }
    }
};
