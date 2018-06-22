'use strict'

const setupDatabase = require('./lib/db')
const setupAgentModels = require('./models/agent')
const setUpMetricModels = require('./models/metric')
const defaults = require('defaults')

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pools: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })
  const sequelize = setupDatabase(config)
  const agentModels = setupAgentModels(config)
  const metricModels = setUpMetricModels(config)

  agentModels.hasMany(metricModels)
  metricModels.belongsTo(agentModels)

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const Agent = {}
  const Metric = {}

  return {
    Agent,
    Metric
  }
}
