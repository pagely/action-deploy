# Pagely Deploy Action
Github action for deploying to [Pagely](https://pagely.com/) Apps

## Inputs

| Name            | Requirement | Description |
| --------------- | ----------- | ----------  |
| `PAGELY_INTEGRATION_SECRET` | _required_ | Authentication token, Create an CI Integration in [Atomic](https://atomic.pagely.com/account/integrations) to get this
| `PAGELY_INTEGRATION_ID`     | _required_ | Unique id for the integration found in Atomic
| `PAGELY_APP_ID`             | _required_ | Id of the app you want to deploy to, avilable in Atomic
| `PAGELY_DEPLOY_DEST`        | _required_ | Set the subdirectory to deploy to. examples: /httpdocs, /httpdocs/wp-content/plugins/my-plugin |
| `PAGELY_WORKING_DIR`        | _optional_ | The directory that you want deployed, based on the build files' path. example: "$GITHUB_WORKSPACE"  |

## Outputs

## Example usage

```
on:
  push:
jobs:
  deploy:
    name: Deploy to My Pagely App
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout repo
        uses: actions/checkout@v2
      - name: Run deploy
        uses: pagely/action-deploy@v1
        with:
          PAGELY_DEPLOY_DEST: "/httpdocs/wp-content/plugins/my-plugin"
          PAGELY_INTEGRATION_SECRET: ${{secrets.PAGELY_INTEGRATION_SECRET}}
          PAGELY_INTEGRATION_ID: ${{secrets.PAGELY_INTEGRATION_ID}}
          PAGELY_APP_ID: ${{secrets.PAGELY_APP_ID}}
          PAGELY_WORKING_DIR: "$GITHUB_WORKSPACE" # use the files starting at the repository root

```
