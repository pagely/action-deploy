# Pagely Deploy Action
Github action for deploying to Pagely Apps

## Inputs

| Name            | Requirement | Description |
| --------------- | ----------- | ----------  |
| `token`         | _required_  | Authentication token, Create an CI Integration in Atomic to get this
| `integrationId` | _required_ | Unique id for the integration
| `appId`         | _required_ | Id of the app you want to deploy to, avilable in Atomic
| `files`      | _required_  | A file, directory or wildcard pattern that describes what to upload see details in the [glob action](https://github.com/actions/toolkit/tree/main/packages/glob) |
| `dest`       | _optional_  | Set the subdirectory to deploy to, if not set the value set in the integration will be used examples: /httpdocs, /httpdocs/wp-content/plugins/my-plugin |

## Outputs

## Example usage

```
on: ["push"]

name: Deploy my app

  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v2
    - uses: pagely/action-deploy@master
      with:
        deploy-url: ${{ secrets.TEST_DEPLOY_URL }}
        files: "test-assets/**"
        dest: /httpdocs
```
