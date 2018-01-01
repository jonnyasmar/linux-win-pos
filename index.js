#! /usr/bin/env node

'use strict';

const options = require('./src/options');
const positionWindows = require('./src/position-windows');
const windowPositions = require('./src/window-positions');

if(options.SAVE_WINDOW_POSITIONS) windowPositions();
else positionWindows();