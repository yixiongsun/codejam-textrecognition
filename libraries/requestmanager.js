const GoogleAPI = require('./googleapi')
const Inside = require('point-in-polygon')

module.exports = class RequestManager {
    constructor(language) {
        this.frames = 0
        this.finishedRequests = 0
        this.data = {}
        this.language = language
    }
    // add another request
    async add(frame, image, callback) {
        this.frames += 1
        let request = new GoogleAPI(this.language)
        try {
            let response = await request.textDetection(image)
            let textAnnotations = response[0].textAnnotations
            let fullText = response[0].fullTextAnnotation

            this.finishedRequests += 1
            let finished = (this.frames == this.finishedRequests) && this.hasFinished

            if (!textAnnotations || textAnnotations.length == 0) {
                return callback(finished, this.data)

            }
            //let textArray = this.textOnFrame(response)
            let textArray = this.mapBlock(textAnnotations, fullText)
            let translate = await request.languageTransform(textArray)
            if (translate && translate.length > 0) {
                this.data[frame.toString()] = translate
            }


            return callback(finished, this.data)

        } catch (err) {
            console.log(err)
        }

    }

    finish() {
        this.hasFinished = true
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

    mapBlock(textAnnotations, fullTextAnnotations) {
        var output = []
        for (var i = 0; i < fullTextAnnotations.pages.length; i++) {
            for (var j = 0; j < fullTextAnnotations.pages[i].blocks.length; j++) {
                let block = fullTextAnnotations.pages[i].blocks[j].boundingBox.vertices
                var box = {
                    topleft: block[0],
                    topright: block[1],
                    bottomright: block[2],
                    bottomleft: block[3],
                    line: ""
                }
                output.push(box)
            }
        }
        
        var out2 = []
        for (var i = 1; i < textAnnotations.length; i++) {
            let mid = this.midpoint(textAnnotations[i].boundingPoly.vertices)
            var found = false
            for (var j = 0; j < output.length; j++) {
                if (this.inBox(mid, output[j])) {
                    output[j].line += textAnnotations[i].description
                    output[j].line += " "
                    found = true
                    break
                }
            }
            if (!found) {
                out2.push({
                    line: textAnnotations[i].description,
                    topleft: textAnnotations[i].boundingPoly.vertices[0],
                    topright: textAnnotations[i].boundingPoly.vertices[1],
                    bottomright: textAnnotations[i].boundingPoly.vertices[2],
                    bottomleft: textAnnotations[i].boundingPoly.vertices[3]
                })
            }
        }

        return output.concat(out2)

    }

    midpoint(vertices) {
        let xcenter = (vertices[0].x + vertices[1].x + vertices[2].x  + vertices[3].x)/4
        let ycenter = (vertices[0].y + vertices[1].y + vertices[2].y  + vertices[3].y)/4
        return {x: xcenter, y: ycenter}
    }

    inBox(point, box) {
        var points = [
            [box.topleft.x, box.topleft.y],
            [box.topright.x, box.topright.y],
            [box.bottomright.x, box.bottomright.y],
            [box.bottomleft.x, box.bottomleft.y]
        ]
        
        
        return Inside([point.x, point.y], points)
    }



}