var request = require("request");
var cmd=require('node-cmd');
var platformID = [];

function getPlatformData(dataUrl) {
    updatedURL = dataUrl + "/raw";
    var options = {
        url: updatedURL,
        headers: {
            'User-Agent': 'request'
        }
    };
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })

}

function getPlatformID(platformData, platformQuery) {
    var pipelineID = "echo '" + platformData.toString() + "' | grep -oP '(?<=" + platformQuery +"/pipelines/)[^ ]*' | cut -d '\"' -f1 ";   
    return new Promise(function(resolve, reject){
     cmd.get(
        pipelineID,
        function(err, data, stderr){
            resolve(data);
        });
    })
}

module.exports = {
    getTriggerID:function(jobURL, platformName) {
        var platformData = getPlatformData(jobURL);
        platformData.then(function(result) {
            getPlatformID(result, platformName).then(function(result){
                platformID = result;
            })
        }).catch(function(err) {
            console.log(err);
        });
    }
}