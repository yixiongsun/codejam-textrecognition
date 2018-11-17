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
        let pyshell = new PythonShell('test.py', options);
        pyshell.on('message', function (message) {
            callback(null, message.frame, message.image)
        });
        pyshell.end(function (err, code, signal) {
            if (err) throw err;
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
            callback(true)
        });
          
    }

    overlay() {
        
    }
    


}