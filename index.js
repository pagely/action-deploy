(async () => {
    const core = require('@actions/core');
    const httpm = require('@actions/http-client');
    const glob = require('@actions/glob');
    const fs = require("fs");
    const tar = require("tar");

    try {

        const deployUrl = core.getInput('deploy-url');
        const patterns = core.getInput('files');
        console.log(`patterns: ${patterns}`)
        const globber = await glob.create(patterns)
        const files = await globber.glob()
        console.log(`files: ${files}`)

        tar.c(
            {
                "gzip": true
            },
            files
        ).pipe(fs.createWriteStream("app.tar.gz"))


        const stream = fs.createReadStream("app.tar.gz")

        const http = new httpm.HttpClient();
        const res = await http.sendStream('PUT', deployUrl, stream);
        if (res.message.statusCode < 200 || res.message.statusCode > 299) {
            throw new Error("Non 2xx status uploading files got: "+res.message.statusCode)
        }

    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
})();

