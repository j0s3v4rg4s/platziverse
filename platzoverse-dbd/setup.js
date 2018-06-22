'use strict'

const db = require('./')
const debug = require('debug')('platziverse:db:setup')
const chalk = require('chalk')
const inquirer = require('inquirer')

const prompt = inquirer.createPromptModule()

async function setup () {
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'This will destroy your database, are your sure?'
    }
  ])

  if (!answer.setup) {
    return console.log('All is ok :D')
  }

  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }
  await db(config).catch(handleFatalError)
  process.exit(0)
}

function handleFatalError (error) {
  console.log(`${chalk.red('[fatal error]')} ${error.message}`)
  console.log(error.stack)
  process.exit(1)
}

setup()
