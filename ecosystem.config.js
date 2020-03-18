module.exports = {
  apps: [
    {
      name: 'banana-website',
      script: './server/index.js',
      watch: ['server/**/*.js', '.env', 'nuxt.config.js'],
      node_args: '-r esm',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
