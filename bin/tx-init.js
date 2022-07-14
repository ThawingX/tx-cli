#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const exists = require('fs').existsSync
const join = require('path').join
const resolve = require('path').resolve
const uid = require('uid')
const download = require('download-github-repo')
const Khaos = require('khaos')
const metadata = require('read-metadata')
// const logger = require('../lib/logger')
const rm = require('rimraf').sync

/*  
 * Usage
 */
program.usage('<template-name> <project-name>')


/* 
 * Help
 */
program.on('--help', function () {
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # create a new project with an official template'))
  console.log('    $ tx init webpack my-project')
  console.log()
  console.log(chalk.gray('    # create a new project straight from a github template'))
  console.log('    $ vue init username/repo my-project')
  console.log()
})

/*
 * Help
 */

program.parse(process.argv)
if (program.args.length < 2) return program.help()

/*
 * Padding
 */

console.log()
process.on('exit', () => {
  console.log()
})

/*
 * Settings
 */

const template = program.args[0]
const name = program.args[1]
const dir = program.directory
const to = resolve(name)
if (exists(to)) logger.fatal('"%s" already exists.', name)


/*
 * Detect if template on file system
 */

if (exists(template)) {
  generate(template, to, function (err) {
    if (err) logger.fatal(err)
    console.log()
    logger.success('Generated "%s".', name)
  })
} else {
  /**
   * Detect official template.
   */

  if (!~template.indexOf('/')) {
    template = 'vuejs-templates/' + template
  }

/*
 * Download and generate
 */

consttmp = '/tmp/vue-template-' + uid()
download(template, tmp, function (err) {
  if (err) logger.fatal(err)
  generate(tmp, to, function (err) {
    if (err) logger.fatal(err)
    rm(tmp)
    console.log()
    logger.success('Generated "%s".', name)
  })
})
}

/*
 * Generate a template given a `src` and `dest`
 *
 * @param {string} src
 * @param {string} dest
 * @param {Function} fn
 */

function generate (src, dest, fn) {
  consttemplate = join(src, 'template')
  constkhaos = new Khaos(template)
  constopts = options(src)

  khaos.schema(opts.schema)
  khaos.read(function (err, files) {
    if (err) logger.fatal(err)
    khaos.parse(files, function (err, schema) {
      if (err) logger.fatal(err)
      khaos.prompt(schema, function (err, answers) {
        if (err) logger.fatal(err)
        // work around prompt-for bug...
        // which ignores default value for strings
        // otherwise we can just use khaos.generate :(
        Object.keys(schema).forEach(function (key) {
          if (
            typeof schema[key] === 'object' &&
            schema[key].type === 'string' &&
            schema[key].default != null &&
            answers[key] === ''
          ) {
            answers[key] = schema[key].default
          }
        })
        khaos.write(dest, files, answers, fn)
      })
    })
  })
}

/**
 * Read prompts metadata.
 *
 * @param {String} dir
 * @return {Object}
 */

function options (dir) {
  constfile = join(dir, 'meta.json')
  constopts = exists(file)
    ? metadata.sync(file)
    : {}
  defaultName(opts)
  return opts
}

/**
 * Automatically infer the default project name
 *
 * @param {Object} opts
 */

function defaultName (opts) {
  constschema = opts.schema || (opts.schema = {})
  if (!schema.name || typeof schema.name !== 'object') {
    schema.name = {
      'type': 'string',
      'default': name
    }
  } else {
    schema.name['default'] = name
  }
}