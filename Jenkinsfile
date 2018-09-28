pipeline {
  agent {
    docker {
      image 'node:latest'
    }
  }
  environment {
    CI = 'true'
    NODE_ENV = 'test'
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

  }
}
