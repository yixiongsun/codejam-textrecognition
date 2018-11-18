const Python = require('../libraries/pythonshell')
const RequestManager = require('../libraries/requestmanager')
const fs = require('fs');
const path = require('path')


/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render('api/index', {
    title: 'API Examples'
  });
};




/**
 * GET /api/upload
 * File Upload API example.
 */

exports.getFileUpload = (req, res) => {
  res.render('api/upload', {
    title: 'File Upload'
  });
};

exports.postFileUpload = (req, res) => {
  let python = new Python(req.file.path, "upload")
  let p2 = python
  let lang = req.body.language || "en"
  let requestmanager = new RequestManager(lang)
  python.extract(function(finished, frame, image) {
    if (finished) {
      requestmanager.finish()
      return
    }
    requestmanager.add(frame, image, function(finished, response) {
      if (finished) {
        let json = JSON.stringify(response)
        fs.writeFile('translated.json', json, 'utf8',function(err, result) {
          p2.overlay(function(err) {
            if (!err) {
              res.render('api/video')
            }
          })
        });

      }
    })
  })
};
exports.getRealTime = (req, res) => {
  res.render('api/realtime', {
    title: 'Real Time video'
  });
}

exports.postRealTime = (req, res) => {

  // This line opens the file as a readable stream
  res.sendFile(path.resolve(__dirname + "/../" + req.files[0].path));
  
}

exports.getVideoStream = (req, res) => {
  const p = path.resolve(__dirname + "/../" + "output.mp4")
  const stat = fs.statSync(p)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1

    if (start > end) {
      start = end
    }

    const chunksize = (end-start)+1
    const file = fs.createReadStream(p, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(p).pipe(res)
  }

  

}
exports.getVideo = (req, res) => {
  res.render('api/video', {
    title: 'Video'
  });
}