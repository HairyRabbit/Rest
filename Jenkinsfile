pipeline {
  agent {
    docker {
      image 'node:latest'
    }

  }
  stages {
    stage('BUILD') {
      steps {
        sh 'npm ci --verbose'
      }
    }
    stage('TEST') {
      steps {
        sh 'npm test'
      }
    }
    stage('DEPLOY_WEBSITE') {
      steps {
        sh 'npm run build:website'
        sh 'git add docs'
        sh 'git commit -m "Deploy website"'
        sh 'git push origin master'
      }
    }
  }
  environment {
    CI = 'true'
    NODE_ENV = 'test'
  }
}