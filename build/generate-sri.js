#!/usr/bin/env node

/*!
 * Script to generate SRI hashes for use in our docs.
 * Copyright 2017 The Bootstrap Authors
 * Copyright 2017 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

'use strict'

const fs = require('fs')
const path = require('path')
const sriToolbox = require('sri-toolbox')
const sh = require('shelljs')
const sed = sh.sed

sh.config.fatal = true

const configFile = path.join(__dirname, '..', '_config.yml')

const files = [
  {
    file: 'dist/css/bootstrap.min.css',
    yamlName: 'css_hash'
  },
  {
    file: 'dist/js/bootstrap.min.js',
    yamlName: 'js_hash'
  },
  {
    file: 'assets/js/vendor/jquery-slim.min.js',
    yamlName: 'jquery_hash'
  },
  {
    file: 'assets/js/vendor/popper.min.js',
    yamlName: 'popper_hash'
  }
]

files.forEach((file) => {
  fs.readFile(file.file, 'utf8', (err, data) => {
    if (err) {
      throw err
    }

    const integrity = sriToolbox.generate({
      algorithms: ['sha384']
    }, data)

    sed('-i', new RegExp(`(\\s${file.yamlName}:\\s+"|')(\\S+)("|')`), '$1' + integrity + '$3', configFile)
  })
})
