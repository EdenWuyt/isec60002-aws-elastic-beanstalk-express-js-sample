// Reference: https://www.jenkins.io/doc/book/pipeline/syntax/

pipeline {
    agent any

    environment {
        IMAGE_NAME='edenwucurtin/isec60002'
        IMAGE_TAG="${BUILD_NUMBER}"
    }

    stages {
        stage('Install dependencies') {
            agent {
                docker {  image 'node:16'  }
            }
            steps {
                sh 'npm ci'
            }
        }

        stage('Run unit tests') {
            agent {
                docker {  image 'node:16'  }
            }
            steps {
                sh '''
                    npm run test:unit --if-present
                    npm test --if-present
                '''
            }
        }

        stage('Build Docker image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .'
            }
        }

        stage('Push image to Docker Hub') {
            environment {
                DOCKERHUB_CREDS = credentials('dockerhub-credentials')
            }

            steps {
                sh '''
                    echo ${DOCKERHUB_CREDS_PSW} | docker login --username ${DOCKERHUB_CREDS_USR} --password-stdin
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }
    }
} 
