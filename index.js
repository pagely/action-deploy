(async () => {
    const core = require('@actions/core');
    const httpm = require('@actions/http-client');
    const glob = require('@actions/glob');
    const fs = require("fs");
    const tar = require("tar");

    try {

        const patterns = core.getInput('files');
        const dest = core.getInput('dest');
        const integrationId = core.getInput('integrationId');
        const appId = core.getInput('appId');
        const token = core.getInput('token');

        const globber = await glob.create(patterns)
        const files = []
        const cwd = process.cwd()+"/"
        for await (const file of globber.globGenerator()) {
            if (file.startsWith(cwd)) {
                files.push(file.replace(cwd, ''))
            }

        }

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

        const requestHeaders = {"X-Token": token}
        const http = new httpm.HttpClient();
        const r1 = await http.get(
            "https://mgmt.pagely.com/api/apps/integration/"+encodeURIComponent(integrationId)+"/endpoint?appId="+encodeURIComponent(appId),
            requestHeaders
        )
        if (r1.message.statusCode < 200 || r1.message.statusCode > 299) {
            throw new Error("Non 2xx status lookup up upload url: "+r1.message.statusCode)
        }

        var deployUrl = r1.body+"&tail=1"
        if (dest != "") {
            deployUrl += "&dest="+encodeURIComponent(dest)
            console.log(`Setting override destination to ${dest}`)
        }

        const res = await http.sendStream('PUT', deployUrl, stream, requestHeaders);
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
