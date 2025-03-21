pipeline {
    agent any

    environment {
        INFLUX_URL = "https://us-east-1-1.aws.cloud2.influxdata.com/api/v2/write?org=your_org&bucket=your_bucket&precision=s"
        INFLUX_TOKEN = "DSGJgx1OEMr7lRnMPI2CKVfAbfudU19OsFhrkIHHCZroYzCz3Sc9E9fHRit380Gz6WRhxF74f3nvk_wTf6nPLw=="
        TELEGRAF_CONFIG = "https://us-east-1-1.aws.cloud2.influxdata.com/api/v2/telegrafs/0e9a08c68fc52000"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install -g newman'
                    sh 'npm install axios fs csv-parser'
                    sh 'npm install csv-parser fs child_process'
                }
            }
        }

        stage('Run Load Test with Users') {
            steps {
                script {
                    sh 'node run_newman_with_users.js'
                }
            }
        }

        stage('Push Results to InfluxDB') {
            steps {
                script {
                    sh 'node upload_to_influxdb.js'
                }
            }
        }

        stage('Start Telegraf') {
            steps {
                script {
                    sh 'telegraf --config ${TELEGRAF_CONFIG} &'
                }
            }
        }
    }
}
