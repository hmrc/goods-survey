var mongodb = require('mongodb');
const path = require('path');
const fs = require('fs');

const MaxAnswers = 3

function getNextFile(req) {
    const directoryPath = './public/images/items';

    const filesDone = (req.session.filesDone || []);

    const files = fs.readdirSync(directoryPath);
     
    // console.log('done', filesDone);

    let filesRemaining = [];
    if(filesDone.length == files.length) {
        console.log('No files remaining, resetting');
        filesRemaining = files;
        req.session.filesDone = [];
    }
    else {
        filesRemaining = files.filter(x => !new Set(filesDone).has(x));
    }
  
    // console.log('remaining', filesRemaining);


    const file = filesRemaining[Math.floor((Math.random()*filesRemaining.length))];

    // console.log('current', file);
    
    return file;
}

exports.classifyImage = function(req, res) {

    const percentComplete = ((req.session.answerCount || 0) / MaxAnswers) * 100;

    console.log(percentComplete);

    if(percentComplete >= 100) {
        res.redirect('/thank-you');
    }
    else {
        const file = getNextFile(req);
        res.render('classify-image', { 'imageFile': file, 'percentComplete': Math.round(percentComplete) });
    }
};

exports.handleClassifyImage = function(req, res) {

    console.log(req.body.answer);

    if(req.body.answer && req.body.imageFile && req.body.answer.length >= 1) {

        req.session.filesDone = (req.session.filesDone || []).concat([req.body.imageFile]);
        req.session.answerCount = (req.session.answerCount || 0) + 1;

        // req.app.locals.resultsCollection.findOne({  }).then(response => {

        //     res.status(200).json(response)
        // }).catch(error => {
        //     console.error(error)
        // });

        req.app.locals.resultsCollection.insert({
            'imageFile': req.body.imageFile,
            'answer': req.body.answer
        });

        res.redirect('/classify-item');
    }
    else {
        const percentComplete = ((req.session.answerCount || 0) / MaxAnswers) * 100;
        const file = getNextFile(req);

        res.status(400).render('classify-image', { 'imageFile': file, 'percentComplete': Math.round(percentComplete) });
    }
}

exports.thankYou = function(req, res) {

    res.render('thank-you');
};

