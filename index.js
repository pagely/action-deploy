(async () => {
    const core = require('@actions/core');
    const {Octokit} = require('@octokit/rest');
    const {createActionAuth} = require("@octokit/auth-action");
    //const http = require('@actions/http-client');

    try {

        const octokit = new Octokit({
            authStrategy: createActionAuth
        });

        //const deployUrl = core.getInput('deploy-url');
        const artifact = core.getInput('artifact');
        console.log(`artifact: ${artifact}`)

        const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
        const run_id = process.env.GITHUB_RUN_ID;

        console.log({
            owner: owner,
            repo: repo,
            run_id: run_id,
        });

        await new Promise(resolve => setTimeout(resolve, 5000))

        const {data: artifacts} = await octokit.actions.listWorkflowRunArtifacts({
            owner: owner,
            repo: repo,
            run_id: run_id,
        });
        const debug = JSON.stringify(artifacts, undefined, 2);
        console.log(`run artifacts: ${debug}`);
    } catch (error) {
        console.log(error)
        core.setFailed(error.message);
    }
})();
