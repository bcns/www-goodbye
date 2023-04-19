const dev = process.env.NODE_ENV !== 'production';

module.exports = {
    plugins: {
        ...(dev
            ? undefined
            : {
                  cssnano: {
                      preset: ['default', {discardComments: {removeAll: true}}],
                  },
              }),
    },
};
