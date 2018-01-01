/**
 * options.js
 *
 * Sets up default options. These are all POSIX style arguments.
 */
const {execSync} = require('child_process');
const processArgs = require('./process-args');
const utils = require('./__');

// Constants
const ARGS = processArgs();

// Set default options
// As command-line arguments, these should be prefixed with a - (they can be joined as well; i.e. -sr)
let options = {
  // BLINKS_WHEN_DONE: number of times to blink the screen when the operation is complete
  'b': 3,
  // CONFIG: the configuration to use; defaults to the one for the number of connected displays
  'c': utils.getScreens() + '-displays',
  // WINDOW_POSITIONS_FILE: the location of the file containing the window positions to load
  'f': execSync('echo $HOME').toString().trim() + '/.window-positions',
  // IRRELEVANT_WINDOWS: pipe-separated list of window title matches to ignore when positioning windows
  'i': 'unity|hud',
  // RESET: reset the .window-positions file; use in conjunction with -s
  'r': false,
  // SAVE_WINDOW_POSITIONS: gets and stores the positions of all open windows
  's': false,
  // USERNAME: the name of the current user (for splitting titles)
  'u': execSync('hostname').toString().trim()
};

// Merge with the processed args
options = Object.assign({}, options, ARGS);

// Generate the geometry string to each window's list of properties
// We do this here to keep the .window-positions file clean :)
let windowPositions = options['r'] ? {} : utils.readJsonFile(options['f']);
Object.keys(windowPositions).forEach(displayType =>{
  let display = windowPositions[displayType];
  Object.keys(display).forEach(wmClass =>{
    let props = display[wmClass];
    display[wmClass].geo = `0,${props.x},${props.y},${props.w},${props.h}`;
  });
});

// Exports some readable versions of the options & does some transforming where appropriate
module.exports = {
  // Options
  BLINKS_WHEN_DONE: options['b'],
  CONFIG: options['c'],
  WINDOW_POSITIONS_FILE: options['f'],
  IRRELEVANT_WINDOWS: options['i'],
  RESET: options['r'],
  USERNAME: options['u'],
  SAVE_WINDOW_POSITIONS: options['s'],
  // Global Constants
  WINDOW_POSITIONS: windowPositions,
  CURRENT_WINDOW: execSync('xdotool getactivewindow getwindowname').toString().trim()
};