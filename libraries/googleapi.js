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
    constructor() {

        //this.vision = google.vision({version: "v1p2beta1", })
    }

    textDetection() {
        return new Promise(function (reject, resolve) {
            var fs = require('fs');
            var imageFile = fs.readFileSync('./resources/wakeupcat.jpg');

            // Convert the image data to a Buffer and base64 encode it.
            var encoded = Buffer.from(imageFile).toString('base64');
            let request = {
                image: { content: encoded }
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

