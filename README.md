# linux-win-pos
**Don't like the limitations of traditional tiling window managers like xmonad?**

**Don't want to deal with the overhead of ones like i3?** 


This is what linux-win-pos was created for.

It is a dead-simple window tiling manager for Linux desktop environments like Unity, Gnome, or Lubuntu. Inspired by [DockWin](https://github.com/rwese/DockWin).

Written in Node to illustrate it's versatility and capability as a desktop utility.

### Features
- Saves the position of all open windows to a file as a simple JSON object
- Saves individual configurations depending on the number of connected displays
- Positions all open windows according to the saved configuration
- Blinks the screen when done positioning.
- See `src/options.js` for more capabilities.

#### Please star this repo if you find it useful!

### Demo

[![Demo Video of linux-win-pos In Action](https://i.ytimg.com/vi/fyXDNax3BUg/hqdefault.jpg)](https://www.youtube.com/watch?v=fyXDNax3BUg)

### Requirements
- Linux + Desktop Environment; *Built on Ubuntu 17.10 + Gnome 3*
- Node + NPM; *Built on 7.10.1 + 5.6.0*
- `wmctrl`, `xrandr`, `xdotool`, `xprop`, `xcalib`; *You should have most of these, but they can all be easily installed with `sudo apt-get install`*

*This should also work in most other flavors, but needs more thorough testing of window decoration interaction.*

# Getting Started

**linux-win-pos** is very simple and very easy to run.

There are several configurable options in `src/options.js`, but the default options will save a JSON configration file to `~/.window-positions`.

Just follow the steps below and you're good to go:

#### 1. Install linux-win-pos
##### Via git
```
git clone https://github.com/jonnyasmar/linux-win-pos.git ~/linux-win-pos
cd ~/linux-win-pos
npm install
```
##### Via NPM
```
npm install -g linux-win-pos
```

#### 2. Save open window positions
##### Installed via Git
```
node ~/linux-win-pos -sr
```
##### Installed via NPM
```
linux-win-pos -- -sr
```
Note: the flags `-sr`

`s`: Save the position of open windows, instead of repositioning them.

`r`: Reset the contents of `~/.window-positions`; used when saving.

#### 3. Position open windows according to `~/.window-positions`
##### Installed via Git
```
node ~/linux-win-pos
```
##### Installed via NPM
```
linux-win-pos
```

### Bonus Points:
Bind these to some shortcuts with a tool like `xbindkeys`! I personally like to use `Super`+`Shift`+`Escape` to save & `Super`+`Escape` to recall.

### Command-line Options

**-b** [3] number of times to blink the screen when the operation is complete  

**-c** [#screens-displays] the configuration to use; defaults to the one for the number of connected displays 

**-f** [~/.window-positions] the location of the file containing the window positions to load 

**-i** [unity|hud] pipe-separated list of window title matches to ignore when positioning windows 

**-r** [false] reset the .window-positions file; use in conjunction with -s 

**-s** [flase] gets and stores the positions of all open windows 