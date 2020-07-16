const core = require('@actions/core');
const github = require('@actions/github');
const octokit = require('@octokit/core');
const http = require('@actions/http-client');

try {

    const deployUrl = core.getInput('deploy-url');
    const artifactName = core.getInput('artifact-name');

    // debug stuff
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
    // remove this stuff

    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
    const run_id = process.env.GITHUB_RUN_ID

    const {data: artifacts} = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts, {
        owner: owner,
        repo: repo,
        run_id: run_id,
    })
    const payload = JSON.stringify(artifacts, undefined, 2);
    console.log(`run artifacts: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
