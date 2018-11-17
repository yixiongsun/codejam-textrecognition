const fs = require('fs')
const vision = require('@google-cloud/vision')
/*
const vision = new google.vision_v1p2beta1.ImageAnnotatorClient({
    projectId: "codejam-textreco-1542427043207",
    keyFilename: "./credentials/codejam-textrecognition.json"
})*/
const client = new vision.ImageAnnotatorClient({
    projectId: "codejam-textreco-1542427043207",
    keyFilename: "./credentials/codejam-textrecognition.json"
});


module.exports = class GoogleAPI {
    constructor(image) {
        this.image = image
        //this.vision = google.vision({version: "v1p2beta1", })
    }

    textDetection(base64) {
        return new Promise(function (resolve, reject) {
            
            let request = {
                image: { content: base64 }
            };
            client
                .textDetection(request)
                .then(results => {
                    const labels = results[0].textAnnotations;

                    console.log(labels);
                    labels.forEach(label => console.log(label.description));
                    resolve(labels)
                })
                .catch(err => {
                    console.error('ERROR:', err);
                    reject(err)
                });
        })
    }
}

