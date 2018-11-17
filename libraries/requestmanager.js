const GoogleAPI = require('./googleapi')

module.exports = class RequestManager {
    constructor() {
        this.frames = 0
        this.finishedRequests = 0
        this.data = {}
    }
    // add another request
    async add(frame, image, callback) {
        this.frames += 1
        let request = new GoogleAPI()
        try {
            let response = await request.textDetection(image)
            this.finishedRequests += 1
            let textArray = this.textOnFrame(response)
            let translate = await request.languageTransform(textArray)
            if (translate && translate.length > 0) {
                this.data[frame.toString()] = translate
            }


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

    textOnFrame(textAnnotations) {
        var text = [];
        // Reads array of textAnnotations
        var wordPoly, wordPosX1, wordPosY1, wordPosX2, wordPosY2, wordPosX3, wordPosY3, wordPosX4, wordPosY4;
        for (var i = 1; i < textAnnotations.length; i++) {
            wordPoly = textAnnotations[i].boundingPoly;
            wordPosX1 = wordPoly.vertices[0].x;
            wordPosY1 = wordPoly.vertices[0].y;
            wordPosX2 = wordPoly.vertices[1].x;
            wordPosY2 = wordPoly.vertices[1].y;
            wordPosX3 = wordPoly.vertices[2].x;
            wordPosY3 = wordPoly.vertices[2].y;
            wordPosX4 = wordPoly.vertices[3].x;
            wordPosY4 = wordPoly.vertices[3].y;
            text.push({
                word: textAnnotations[i].description,
                x1: wordPosX1,
                y1: wordPosY1,
                x2: wordPosX2,
                y2: wordPosY2,
                x3: wordPosX3,
                y3: wordPosY3,
                x4: wordPosX4,
                y4: wordPosY4
            })
        }
        return text;
    }



}