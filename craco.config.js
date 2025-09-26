const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        configure: (webpackConfig) => {
            // Disable resolve-url-loader to fix CSS build issues
            const rules = webpackConfig.module.rules;
            rules.forEach(rule => {
                if (rule.oneOf) {
                    rule.oneOf.forEach(oneOfRule => {
                        if (oneOfRule.use && Array.isArray(oneOfRule.use)) {
                            oneOfRule.use = oneOfRule.use.filter(use => {
                                return !(typeof use === 'object' && use.loader && use.loader.includes('resolve-url-loader'));
                            });
                        }
                    });
                }
            });
            return webpackConfig;
        },
    },
}; 