/**
 * __.js
 *
 * Utility functions.
 */
const fs = require('fs');
const {execSync} = require('child_process');
const shellescape = require('shell-escape');

/**
 * Blinks the screen so we know the positioning is done.
 *
 * @param blinksLeft The number of blinks remaining.
 * @param exit Whether or not we should exit the process once we're done blinking.
 */
const blink = (blinksLeft, exit) =>{
  if(blinksLeft >= 0){
    execSync('xcalib -invert -alter');
    wait(.125);
    blink(blinksLeft - 1, exit);
  }else{
    // looks for redshift before it ends the process
    let hasRedshift = execSync('command -v redshift').toString();
    wait(.125);
    if(hasRedshift) execSync('redshift -o');
    if(exit) process.exit();
  }
};

/**
 * Creates an artificial sleep.
 *
 * @param s The time to sleep in seconds
 */
const wait = s =>{
  const start = Date.now();
  while(Date.now() - start < s * 1000){}
};

/**
 * Gets the window geometry & class names of all open windows.
 *
 * @param windowId The ID of the window.
 * @returns Object Containing the prop geo (X, Y, Width, & Height of the window) and the prop wmClass (the WM_CLASS property of the window).
 */
const getWinInfo = windowId =>{
  let wininfo = {};

  // Activate the window by ID
  execSync(shellescape(['wmctrl', '-ia', windowId]));
  wait(.125);

  let wmClass = execSync("xprop -id $(xprop -root _NET_ACTIVE_WINDOW | cut -d ' ' -f 5)_NET_WM_NAME WM_CLASS").toString();
  wmClass = wmClass.split('"');

  // Standard window information
  let info = execSync("xwininfo -id $(xdotool getactivewindow)").toString();
  info = info.split('\n');
  info.forEach(line =>{
    line = line.trim();
    // We'll just reuse wininfo :)
    wininfo[line.split(':')[0].trim()] = (line.split(':')[1] || '').trim();
  });

  // Window decoration info
  let extents = execSync(`xprop _NET_FRAME_EXTENTS -id "${windowId}" | grep "NET_FRAME_EXTENTS" | cut -d '=' -f 2 | tr -d ' '`).toString();
  extents = extents.trim().split(',');
  extents = {
    lb: parseInt(isNaN(extents[0]) ? "0" : extents[0]), // left border
    rb: parseInt(isNaN(extents[1]) ? "0" : extents[1]), // right border
    tb: parseInt(isNaN(extents[2]) ? "0" : extents[2]), // title bar
    bb: parseInt(isNaN(extents[3]) ? "0" : extents[3]), // bottom border
  };

  // Geometry
  let x = parseInt(wininfo['Absolute upper-left X']) - extents.lb + '';
  let y = parseInt(wininfo['Absolute upper-left Y']) - extents.tb + '';
  let w = parseInt(wininfo['Width']) + extents.lb + extents.rb + '';
  let h = parseInt(wininfo['Height']) + extents.bb + '';

  wininfo = {
    geo: {x, y, w, h},
    wmClass: `${wmClass[1]}.${wmClass[3]}`
  };

  return wininfo;
};

/**
 * Gets the number of connected displays.
 *
 * @returns string The number of connected displays.
 */
const getScreens = () =>{
  let screens = execSync("xrandr -d :0 -q | grep ' connected' | wc -l").toString();
  return screens.split('\n')[0];
};

/**
 * Parses a JSON file into a JSON object.
 *
 * @param file The file to be read
 * @returns JSON The contents of the file as a JSON object.
 */
const readJsonFile = (file) =>{
  let data = {};
  try{
    data = JSON.parse(fs.readFileSync(file).toString());
    if(data === '' || !data) data = {};
  }catch(e){}

  return data;
};

module.exports = {
  blink,
  wait,
  getWinInfo,
  getScreens,
  readJsonFile,
  shellescape
};