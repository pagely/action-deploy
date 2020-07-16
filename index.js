(async () => {
    const core = require('@actions/core');
    const {Octokit} = require('@octokit/rest');
    const octokit = new Octokit();
    //const http = require('@actions/http-client');

    try {

        //const deployUrl = core.getInput('deploy-url');
        const artifact = core.getInput('artifact');
        console.log(`artifact: ${artifact}`)

        const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
        const run_id = process.env.GITHUB_RUN_ID;

        const {data: artifacts} = await octokit.actions.listWorkflowRunArtifacts({
            owner: owner,
            repo: repo,
            run_id: run_id,
        });
        const debug = JSON.stringify(artifacts, undefined, 2);
        console.log(`run artifacts: ${debug}`);
    } catch (error) {
        core.setFailed(error.message);
    }
})();
