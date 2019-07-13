workflow "Publish on release" {
  resolves = ["Publish package"]
  on = "release"
}

action "Publish package" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  secrets = ["NPM_AUTH_TOKEN"]
  args = "publish"
}
