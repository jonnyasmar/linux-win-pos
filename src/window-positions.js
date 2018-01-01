/**
 * window-positions.js
 *
 * Handles getting and storing open window positions for later recall.
 */
const fs = require('fs');
const {execSync} = require('child_process');
const mergeDeep = require('merge-deep');
const options = require('./options');
const {getWinInfo} = require('./__');

/**
 * Gets the position of all the currently open windows and stores them to the file defined
 * in options.WINDOW_POSITIONS_FILE
 */
const get = () =>{
  console.log(`Scanning open windows... Please don't click anything!`);

  let display = execSync("echo $DISPLAY").toString().trim();
  let configuration = execSync(`xrandr -d ${display} -q | grep ' connected' | wc -l`).toString().trim() + '-displays';
  let output = {};
  output[configuration] = {};

  let windows = execSync('wmctrl -lpG').toString().split('\n').filter(openWindow =>{
    return !(new RegExp(options.IRRELEVANT_WINDOWS).test(openWindow.toLowerCase()));
  });

  windows.forEach((window, i) =>{
    console.log(`${i + 1} of ${windows.length} windows scanned...`);

    if(!window) return;
    //let title = window.split(` ${options.USERNAME} `);
    //title = title[title.length - 1];
    let windowId = window.split(` `)[0];
    if(!windowId) return;

    // @todo: Implement title-based sizing
    //props[title] = Object.assign({}, props);

    let wininfo = getWinInfo(windowId);
    output[configuration][wininfo.wmClass] = wininfo.geo;
  });

  let mergedPositions = mergeDeep(options.WINDOW_POSITIONS, output);

  fs.writeFileSync(options.WINDOW_POSITIONS_FILE, JSON.stringify(mergedPositions, null, 2));

  console.log(`Done! The following window positions have been merged with the contents of ${options.WINDOW_POSITIONS_FILE}`);
  console.dir(mergedPositions);
};

module.exports = get;