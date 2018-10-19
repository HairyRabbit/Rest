workflow "IDENTIFIER" {
  on = "EVENT"
  resolvers = "ACTION"
}

action "ACTION" {
  uses = "docker://node:latest"
  runs = "npm test"
}
