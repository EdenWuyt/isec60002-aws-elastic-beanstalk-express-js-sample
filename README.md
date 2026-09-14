# AWS Elastic Beanstalk Node.js Sample App

This repository contains a sample Node.js web application built using [Express](https://expressjs.com/), meant to be used as part of the AWS DevOps Learning Path.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## CI/CD pipeline

A CI/CD pipeline for the application is defined in [Jenkinsfile](Jenkinsfile). The workflow includes dependency installation, dependency vulnerability scanning via Trivy, testing, Docker image build, and publication to Docker Hub.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
