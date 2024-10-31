pipeline {
    agent any
    tools {
        nodejs 'node_18'
    }

    stages {
        stage('File Permission') {
            steps {
                sh "sudo chmod -R 777 /var/lib/jenkins/workspace/qrmenu"
            }
        }
        stage('Checkout') {
			steps {
				checkout scm
			}
		}
        stage('Build') {
            steps {
                 sh "npm i"
                 sh "npm run build:prod"
                 sh "npm run export"
            }
        }
    }
}
