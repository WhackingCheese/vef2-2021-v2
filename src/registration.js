const util = require('util');
const fs = require('fs');
const express = require('express');
const { body } = require('express-validator');
const { selectAllNotAnon, query, insert } = require('./db');

const title = 'Undirskriftarlisti';
let validations = {};

const router = express.Router();

async function pageCreate(req, res) {
  const signatures = await selectAllNotAnon();
  res.render('registration', { title, validations, signatures });
  validations = {};
}

function catchErrors(fn) {
  return (req, res) => fn(req, res);
}

function validate(name, ssid, comment) {
  const valid = {};
  const ssid_re = /^((\d{6}\-\d{4})|(\d{10}))/;
  if (name.length < 1 || name.length > 128) {
    valid.name = 'Nafn þarf að vera 1-128 stafir.';
  }
  const matches = ssid_re.exec(ssid);
  if (matches == null || matches.length == 0 || matches[0] !== ssid) {
    valid.ssid = 'Kennitala þarf að vera á formati "123456-7890".';
  }
  if (comment.length > 400) {
    valid.comment = 'Athugasemdir þurfa að vera styttri en 400 stafir.';
  }
  return valid;
}

async function register(req, res) {
  const {
    body: {
      name = '',
      ssid = '',
      comment = '',
      anon = false,
    } = {},
  } = await req;
  if (req.body.anon == null) {
      req.body.anon = false;
  }
  validations = validate(name, ssid, comment);
  if(Object.keys(validations).length === 0) {
    // sanitize input
    try {
        await insert(req.body);
    } catch {
        // already exists
    }
  }

  res.redirect('/');
}

router.get('/', catchErrors(pageCreate));
router.post('/', catchErrors(register));

module.exports = router;
