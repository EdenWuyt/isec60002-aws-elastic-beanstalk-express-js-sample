// Reference: https://www.jenkins.io/doc/book/pipeline/syntax/

pipeline {
    agent any

    environment {
        IMAGE_NAME='edenwucurtin/isec60002'
        // Uses Jenkins build number as image tag.
        IMAGE_TAG="${BUILD_NUMBER}"
    }

    stages {
        stage('Install dependencies') {
            // Uses Node.js 16 as the app's build and test environment as required.
            agent {
                docker {  image 'node:16'  }
            }
            steps {
                sh 'npm ci'
            }
        }

        stage('Run unit tests') {
            // Uses Node.js 16 as the app's build and test environment as required.
            agent {
                docker {  image 'node:16'  }
            }
            // Uses flag --if-present to prevent errors thrown because test and test:unit are not defined in scripts.
            steps {
                sh '''
                    npm run test:unit --if-present
                    npm test --if-present
                '''
            }
        }


        stage('Run dependency vulnerability scan') {
            // Selects Trivy as the dependency vulnerability scan tool.
            agent {
                 docker {  image 'aquasec/trivy:latest'  }
            }
            // If high or critical vulnerabilities are scanned, the pipeline will stop with a failure.
            steps {
                sh '''
                     trivy fs \
                         --scanners vuln \
                         --severity HIGH,CRITICAL \
                         --exit-code 1 \
                         .
                '''
            }
        }

        stage('Build Docker image') {
            // Build the Docker image using Dockerfile in the current directory with the image name and tag defined as environment variables.
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .'
            }
        }

        stage('Push image to Docker Hub') {
            // Reads Docker Hub credentials securely from Jenkins without exposing in the Jenkinsfile.
            environment {
                DOCKERHUB_CREDS = credentials('dockerhub-credentials')
            }

            // Logs in with the retrieved credentials and push the Docker image to Docker Hub.
            steps {
                sh '''
                    echo ${DOCKERHUB_CREDS_PSW} | docker login --username ${DOCKERHUB_CREDS_USR} --password-stdin
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }
    }
} 
