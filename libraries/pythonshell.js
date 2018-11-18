const {PythonShell} = require('python-shell')

module.exports = class Python {

    // file is path to file
    // type is either upload or stream
    constructor(file, type, language) {
        this.file = file
        this.type = type
        this.language = language
    }

    // runs the python script
    extract(callback) {
        var args = [this.file]
        if (this.language) {
            args.push(this.language)
        }
        let options = {
            args: args,
            mode: "text"
        }
        let pyshell = new PythonShell('run.py', options);
        pyshell.on('message', function (message) {
            if (message) {
                try {
                    let out = JSON.parse(message)
                    callback(null, out.frame, out.image)
                } catch(err) {

                }
                
            }
            
        });
        pyshell.end(function (err, code, signal) {
            if (err) throw err;

            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
            if (code == 0) {
                return callback(true)

            }
        });
          
    }

    overlay(callback) {
        var args = ["translated.json", this.file]
        
        let options = {
            args: args,
            mode: "text"
        }
        let pyshell = new PythonShell('overlay.py', options);
        
        pyshell.end(function (err, code, signal) {
            if (err) throw err;
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
            callback(null)
        });
          
    }
    


}