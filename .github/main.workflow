workflow "Publish on release" {
  on = "release"
  resolves = ["Publish package"]
}

action "Publish release only" {
  uses = "actions/bin/filter@latest"
  args = "action publish"
}

action "Publish package" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Publish release only"]
  secrets = ["NPM_AUTH_TOKEN"]
  args = "publish"
}
