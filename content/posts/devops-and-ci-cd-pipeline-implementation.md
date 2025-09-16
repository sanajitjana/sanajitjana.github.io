+++
title = 'DevOps and CI-CD Pipeline Implementation'
date = '2025-11-01T09:29:00+05:30'
draft = true
categories = ["DevOps"]
tags = ["DevOps", "CI/CD", "Jenkins", "GitHub Actions", "Docker", "Kubernetes"]
+++

# DevOps and CI/CD Pipeline Implementation

DevOps practices bridge the gap between development and operations teams. In this post, we'll explore CI/CD pipelines and modern DevOps tools.

## What is DevOps?

DevOps is a culture, set of practices, and tools that combine software development (Dev) and IT operations (Ops) to shorten the development lifecycle and provide continuous delivery of high-quality software.

## CI/CD Fundamentals

### Continuous Integration (CI)
- Automatically build and test code changes
- Detect integration issues early
- Maintain code quality standards

### Continuous Delivery (CD)
- Automatically deploy to staging environments
- Ensure deployments are reliable and repeatable
- Enable faster release cycles

### Continuous Deployment
- Automatically deploy to production
- Requires high confidence in automated testing
- Enables rapid iteration

## GitHub Actions CI/CD Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]

    steps:
    - uses: actions/checkout@v4

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test -- --coverage

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v4

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1

    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v2

    - name: Build and push Docker image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY: my-app
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

    - name: Deploy to ECS
      run: |
        aws ecs update-service \
          --cluster my-cluster \
          --service my-service \
          --force-new-deployment \
          --region us-east-1
```

## Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'my-app'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
                sh 'npm run test:e2e'
            }
            post {
                always {
                    junit 'test-results/*.xml'
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }

        stage('Security Scan') {
            steps {
                sh 'npm audit --audit-level=moderate'
                sh 'docker run --rm -v $(pwd):/src owasp/zap2docker-stable zap-baseline.py -t http://my-app:3000 -r zap-report.html'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
            }
        }

        stage('Push to Registry') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "docker login -u $DOCKER_USER -p $DOCKER_PASS"
                    sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                sh 'kubectl set image deployment/my-app my-app=my-app:${DOCKER_TAG} --namespace=staging'
                sh 'kubectl rollout status deployment/my-app --namespace=staging'
            }
        }

        stage('Integration Tests') {
            steps {
                sh 'npm run test:integration'
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to Production?', ok: 'Deploy'
                sh 'kubectl set image deployment/my-app my-app=my-app:${DOCKER_TAG} --namespace=production'
                sh 'kubectl rollout status deployment/my-app --namespace=production'
            }
        }
    }

    post {
        always {
            sh 'docker system prune -f'
            cleanWs()
        }
        success {
            slackSend(color: 'good', message: "Build ${env.BUILD_NUMBER} succeeded!")
        }
        failure {
            slackSend(color: 'danger', message: "Build ${env.BUILD_NUMBER} failed!")
        }
    }
}
```

## Infrastructure as Code with Terraform

```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "main-vpc"
  }
}

# Subnets
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "public-subnet-${count.index}"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "my-app-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "my-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512

  container_definitions = jsonencode([
    {
      name  = "my-app"
      image = "${aws_ecr_repository.app.repository_url}:latest"
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
    }
  ])
}

# ECS Service
resource "aws_ecs_service" "main" {
  name            = "my-app-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 2

  network_configuration {
    subnets         = aws_subnet.public[*].id
    security_groups = [aws_security_group.app.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "my-app"
    container_port   = 3000
  }
}
```

## Monitoring and Observability

### Application Monitoring with Prometheus and Grafana

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'my-app'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']
```

### Logging with ELK Stack

```javascript
// Winston logger configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'my-app' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Usage
logger.info('Application started');
logger.error('Database connection failed', { error: err.message });
```

## Security in CI/CD

### Secret Management
```yaml
# GitHub Actions with secrets
- name: Deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    API_KEY: ${{ secrets.API_KEY }}
  run: |
    echo "Deploying with secure credentials"
```

### Vulnerability Scanning
```bash
# Container vulnerability scanning
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:latest image my-app:latest

# Dependency scanning
npm audit --audit-level=high
safety check
```

## Best Practices

1. **Infrastructure as Code**: Treat infrastructure like code
2. **Immutable Infrastructure**: Don't modify running systems
3. **Blue-Green Deployments**: Zero-downtime deployments
4. **Feature Flags**: Enable/disable features without redeployment
5. **Automated Testing**: Comprehensive test coverage
6. **Monitoring**: Real-time monitoring and alerting
7. **Security Scanning**: Automated security testing
8. **Documentation**: Document all processes and procedures

## Tools Ecosystem

| Category | Tools |
|----------|-------|
| CI/CD | Jenkins, GitHub Actions, GitLab CI, CircleCI |
| Container Orchestration | Kubernetes, Docker Swarm, Amazon ECS |
| Infrastructure as Code | Terraform, CloudFormation, Ansible |
| Monitoring | Prometheus, Grafana, ELK Stack, Datadog |
| Security | SonarQube, OWASP ZAP, Trivy, Snyk |
| Configuration Management | Ansible, Puppet, Chef |

DevOps practices enable teams to deliver software faster, more reliably, and with higher quality. The key is to automate as much as possible while maintaining security and observability throughout the entire pipeline.