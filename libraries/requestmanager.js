const GoogleAPI = require('./googleapi')

module.exports = class RequestManager {
    constructor() {
        this.frames = 0
        this.finishedRequests = 0
        this.data = []
    }
    // add another request
    async add(frame, image, callback) {
        this.frames += 1
        let request = new GoogleAPI(image)
        try {
            let response = await request.textDetection(image)
            this.finishedRequests += 1
            this.data.push(response)

            let finished = this.frames == this.finishedRequests
            return callback(finished, this.data)
        } catch (err) {
            console.log(err)
        }

    }

    finish() {
        this.finish = true
    }

    getData() {
        return this.data
    }
}