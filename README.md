# Channel program management UI
Sample of react-based web application for managing TV program elements across channels. Built with standard React best practices, it provides an intuitive interface for creating, editing, and organizing TV schedule items efficiently. Created by adomanina from scratch


## Available Scripts

In the project directory, you can run:

### `npm start`

### `npm run build`

## Prerequisites
* Node.js
* npm
* run ```npm install```

## Project Structure
```
root/
├── public/
│   └── index.html
├── gitlab-ci/
├── src/
│   ├── api/
│   ├── components/
│   ├── config/
│   ├── models/
│   ├── App.js
│   ├── index.js
│   └── helper.js
├── terraform/
├── .gitignore
├── .gitlab-ci.yml
├── .env.example
├── .eslintrc.json
├── package.json
└── README.md
```
- **public/**: Contains public assets like `index.html`
- **gitlab-ci/**: deploy configuration
- **src/**: Main source folder with:
    - **api/**: Handles API requests
    - **components/**: React components for the UI
    - **config/**: Configuration files for the app
    - **models/**: Data models
    - **App.js**: Root component for the app
    - **index.js**: Entry point for React
    - **helper.js**: Utility functions
- **terraform/**: Infrastructure configuration using Terraform
- **.gitignore**: Specifies files ignored by Git
- **.gitlab-ci.yml**: main GitLab CI/CD pipeline configuration
- **package.json**: Project dependencies and scripts.
- **.eslintrc.json**: ESLint configuration for code linting.
- **.env.example**: Example environment variables file (using GitLab CI/CD)

## Environment Variables
Create .env file in the project root and add file name to .gitignore

**Note: Each environment variable name in a React application must start with REACT_APP_** 

## Terraform

* to create the necessary resources like the VPC endpoint interfaces: `terraform apply -var-file=../../...tfvars -var-file=test.tfvars -target ...`
* afterward then the regular apply: `terraform apply -var-file=../../....tfvars -var-file=...