pipeline {
  agent any
  stages {
    stage('Install') {
      agent {
        docker {
          image 'node:latest'
        }

      }
      environment {
        NODE_ENV = 'test'
      }
      steps {
        sh 'npm ci'
      }
    }
    stage('Test') {
      agent {
        docker {
          image 'node:latest'
        }

      }
      environment {
        NODE_ENV = 'test'
      }
      steps {
        sh 'npm run test'
      }
    }
  }
}