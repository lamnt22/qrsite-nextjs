module.exports = {
  apps: [
    {
      name: 'NextAppName',
      exec_mode: 'cluster',
      instances: '1',
      script: 'npm',
      args: 'start',
    }
  ]
}