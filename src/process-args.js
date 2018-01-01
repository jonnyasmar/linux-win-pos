/**
 * process-args.js
 *
 * Checks & processes POSIX style command-line arguments passed to the script.
 */
const processArgs = () =>{
  let args = {}, currentProp;
  process.argv.filter((a, i) =>{return i > 1;}).forEach(arg =>{
    let isProp = false;
    arg.split('').forEach(char =>{
      if(isProp){
        currentProp = char;
        args[currentProp] = true;
      }else if(char !== '-'){
        // Type cast the property values as necessary
        if(!isNaN(arg)) args[currentProp] = parseInt(arg);
        else if(arg === 'true') args[currentProp] = true;
        else if(arg === 'false') args[currentProp] = false;
        else args[currentProp] = arg.replace(/["'`]/g,'');
      }

      if(char === '-') isProp = true;
    });
  });

  return args;
};

module.exports = processArgs;