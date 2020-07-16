(async () => {
    const core = require('@actions/core');
    const httpm = require('@actions/http-client');
    const fs = require("fs");

    try {

        const deployUrl = core.getInput('deploy-url');
        const path = core.getInput('path');
        console.log(`path: ${path}`)

        // will need to create a tar hopefully (or zip) here

        const stream = fs.createReadStream(path)

        const http = new httpm.HttpClient();
        const res = await http.sendStream('PUT', deployUrl, stream)
        if (res.message.statusCode < 200 || res.message.statusCode > 299) {
            throw new Error("Non 2xx status uploading files got: "+res.message.statusCode)
        }

    } catch (error) {
        console.log(error)
        core.setFailed(error.message);
    }
})();
