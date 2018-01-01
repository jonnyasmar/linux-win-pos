/**
 * position-windows.js
 *
 * Used to position windows according to the JSON config file defined in options.js.
 */
const fs = require('fs');
const {execSync} = require('child_process');
const options = require('./options');
const {blink, wait, shellescape} = require('./__');

/**
 * Gets the open windows with `wmctrl` and positions calls `positionWindows` on them.
 */
const run = () =>{
  let openWindows = execSync('wmctrl -l').toString();
  openWindows = openWindows.split('\n').filter(openWindow =>{
    return !(new RegExp(options.IRRELEVANT_WINDOWS).test(openWindow.toLowerCase()));
  });

  positionWindows(openWindows);
};

/**
 * Positions an array of windows.
 *
 * @param openWindows An array of window titles as returned by line-splitting `wmctrl -l`.
 */
const positionWindows = (openWindows) =>{
  let specs = options.WINDOW_POSITIONS[options.CONFIG];

  let openWindow = openWindows.shift().split(` `)[0];
  if(openWindow){
    // Get the window by it's title
    execSync(shellescape(['wmctrl', '-ia', openWindow]));
    wait(.125);

    // Get the window's WM_CLASS, because this is far more reliable to reference when we restore window positions
    let wmClass = execSync("xprop -id $(xprop -root _NET_ACTIVE_WINDOW | cut -d ' ' -f 5)_NET_WM_NAME WM_CLASS").toString();
    wmClass = wmClass.split('"');
    wmClass = `${wmClass[1]}.${wmClass[3]}`;

    // @todo Add handling for storing window maximize states
    if(specs[wmClass]){
      execSync('wmctrl -r :ACTIVE: -b remove,maximized_vert,maximized_horz');
      execSync('wmctrl -r :ACTIVE: -e ' + specs[wmClass].geo);
    }

    wait(.125);
    if(openWindows.length) positionWindows(openWindows);
    else end();
  }else{
    openWindows.shift();
    if(openWindows.length) positionWindows(openWindows);
    else end();
  }
};

/**
 * End execution and/or blink out.
 */
const end = () =>{
  execSync(shellescape(['wmctrl', '-a', options.CURRENT_WINDOW]));
  if(!options.BLINKS_WHEN_DONE) process.exit();
  else blink(options.BLINKS_WHEN_DONE, true);
};

module.exports = run;