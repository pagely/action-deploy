(async () => {
    const core = require('@actions/core');
    const httpm = require('@actions/http-client');
    const glob = require('@actions/glob');
    const fs = require("fs");
    const tar = require("tar");

    try {

        var deployUrl = core.getInput('deploy-url');
        const patterns = core.getInput('files');
        const dest = core.getInput('dest');
        console.log(`patterns: ${patterns}`)

        deployUrl += "&tail=1"
        if (dest != "") {
            deployUrl += "&dest="+encodeURIComponent(dest)
            console.log(`Setting override destination to ${dest}`)
        }

        const globber = await glob.create(patterns)
        const files = []
        const cwd = process.cwd()+"/"
        for await (const file of globber.globGenerator()) {
            if (file.startsWith(cwd)) {
                files.push(file.replace(cwd, ''))
            }

        }
        console.log(`files: ${files}`)

        await tar.c(
            {
                "file": "app.tar.gz",
                "gzip": true,
                "portable": true,
            },
            files
        )

        const stats = fs.statSync("app.tar.gz")
        const kib = stats.size/1024;
        console.log(`Created a ${kib}KiB file to deploy`)

        const stream = fs.createReadStream("app.tar.gz")

        const http = new httpm.HttpClient();
        const res = await http.sendStream('PUT', deployUrl, stream);
        if (res.message.statusCode < 200 || res.message.statusCode > 299) {
            throw new Error("Non 2xx status uploading files got: "+res.message.statusCode)
        }
        const body = await res.readBody()
        console.log(body)

    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
})();
