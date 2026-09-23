// Reference: 
// https://www.jenkins.io/doc/book/pipeline/syntax/
// https://www.jenkins.io/doc/pipeline/tour/tests-and-artifacts/

pipeline {
    agent any

    environment {
        IMAGE_NAME='edenwucurtin/isec60002'
        // Uses Jenkins build number as image tag.
        IMAGE_TAG="${BUILD_NUMBER}"
        TRIVY_REPORT='trivy-report.txt'
    }

    options {
        // Sets log retention policies.
        buildDiscarder(logRotator(
            daysToKeepStr: '30',
            numToKeepStr: '30',
            artifactDaysToKeepStr: '14',
            artifactNumToKeepStr: '10'
        ))
    }

    stages {
        stage('Install dependencies and run unit test') {
            // Uses Node.js 16 as the app's build and test environment as required.
            agent {
                docker {  image 'node:16'  }
            }
            steps {
                echo '======== Install dependencies ========'
                sh 'npm ci'
                echo '======== Run unit tests ========'
                sh 'npm run test:unit'
            }
        }

        stage('Run dependency vulnerability scan') {
            steps {
                echo '======== Run dependency vulnerability scan with Trivy ========'
                // Print all vulnerabilities first.
                sh '''
                    trivy fs \
                        --scanners vuln \
                        --severity LOW,MEDIUM,HIGH,CRITICAL \
                        --output ${TRIVY_REPORT} \
                        --exit-code 0 \
                        .
                    cat trivy-report.txt
                '''
                
                // Security gate: if high or critical vulnerabilities are scanned, the pipeline will stop with a failure.
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
                echo '======== Build Docker image ========'
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
                echo '======== Push Docker image to Docker Hub ========'
                sh '''
                    echo ${DOCKERHUB_CREDS_PSW} | docker login --username ${DOCKERHUB_CREDS_USR} --password-stdin
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }
    }

    // Archives the Trivy scan report
    post {
        always {
            archiveArtifacts artifacts: "${TRIVY_REPORT}"
        }
    }
} 
