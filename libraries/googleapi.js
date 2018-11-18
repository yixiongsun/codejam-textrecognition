const fs = require('fs')
const vision = require('@google-cloud/vision')
const translate = require('@google-cloud/translate')
/*
const vision = new google.vision_v1p2beta1.ImageAnnotatorClient({
    projectId: "codejam-textreco-1542427043207",
    keyFilename: "./credentials/codejam-textrecognition.json"
})*/
const vision_client = new vision.ImageAnnotatorClient({
    projectId: "codejam-textreco-1542427043207",
    keyFilename: "./credentials/codejam-textrecognition.json"
});

const translate_client = new translate.Translate({
    projectId: "codejam-textreco-1542427043207",
    keyFilename: "./credentials/codejam-textrecognition.json"
})


module.exports = class GoogleAPI {
    constructor(language) {
        this.language = language
        //this.vision = google.vision({version: "v1p2beta1", })
    }

    textDetection(base64) {
        return new Promise(function (resolve, reject) {

            let request = {
                image: { content: base64 },
                features:[{
                    type: "DOCUMENT_TEXT_DETECTION"
                }]
            };
            vision_client
                .annotateImage(request)
                .then(results => {
                    const labels = results[0].textAnnotations;

                    //console.log(labels);
                    //labels.forEach(label => console.log(label.description));
                    resolve(results)
                })
                .catch(err => {
                    console.error('ERROR:', err);
                    reject(err)
                });
        })
    }


    async languageTransform(textarray) {
        if (!textarray || textarray.length == 0) {
            return []
        }
        try {
            var newArray = textarray.slice()
            var text = []
            for (var i in newArray) {
                text.push(newArray[i].line)
            }

            let translates = await this.translation(text)
            for (var i in newArray) {
                newArray[i].line = translates[i]
            
                
            }
            return newArray

            /*
            let languages = await this.languages(text)
            var currentLanguage = languages[0]
            var currentText = text[0]
            var start = 0
            var end = 0
            for (var i = 1; i < languages.length; i++) {
                end = i
                if (languages[i] == currentLanguage) {
                    currentText += " "
                    currentText += text[i]
                } else {
                    start = i - 1
                    let translation = await this.translation(currentText)
                    var coords = this.mapBox(textarray, start, end)
                    coords.line = translation
                    currentText = text[i]
                    currentLanguage = languages[i]
                    lines.push(coords)
                }
            }
            let translation = await this.translation(currentText)
            var coords = this.mapBox(textarray, start, end)
            if (translation && translation.length > 0) {
                coords.line = translation
                lines.push(coords)
                return lines

            }
            
            return []*/


        } catch (err) {
            console.log(err)
        }

    }

    mapBox(array, index1, index2) {

        return {
            topleft: { x: array[index1].x1, y: array[index1].y1 },
            topright: { x: array[index2].x2, y: array[index1].y2 },
            bottomright: { x: array[index2].x3, y: array[index2].y3 },
            bottomleft: { x: array[index1].x4, y: array[index2].y4 }
        }


    }

    languages(text) {
        return new Promise(function (resolve, reject) {
            translate_client.detect(text).then(results => {
                let detections = results[0];

                var languages = []
                detections.forEach(detection => {
                    languages.push(detection.language)
                });
                resolve(languages)
            }).catch(err => {
                console.error('ERROR:', err);
                reject(err)
            });
        })
    }

    translation(text) {
        let lang = this.language
        return new Promise(function (resolve, reject) {
            translate_client.translate(text, lang).then(results => {
                const translation = results[0];
                resolve(translation)
            }).catch(err => {
                console.error('ERROR:', err);
                reject(err)
            });
        })
    }
}

