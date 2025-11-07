# AWS Amplify Web Application

A full-stack web application built with AWS Amplify featuring:

- **React Frontend** with authentication UI and error handling
- **AWS Cognito** for user authentication
- **AWS AppSync** GraphQL API
- **Amazon DynamoDB** for data storage
- **Error Boundary** for robust error handling
- **Loading States** for better user experience

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   ```

3. **Configure Amplify**
   ```bash
   amplify configure
   ```

4. **Initialize Amplify Project**
   ```bash
   amplify init
   ```

5. **Add Authentication**
   ```bash
   amplify add auth
   ```

6. **Add API**
   ```bash
   amplify add api
   ```

7. **Deploy Backend**
   ```bash
   amplify push
   ```

8. **Start Development Server**
   ```bash
   npm start
   ```

## Features

### Authentication
- User registration and login
- Secure authentication with AWS Cognito
- Protected routes and user sessions

### User Management
- User dashboard with registered users list
- Profile management (bio, location, skills)
- Automatic user data storage in DynamoDB

### Technical Features
- GraphQL API for data operations
- Error handling with user-friendly messages
- Loading states for better UX
- Error boundary for crash recovery
- Responsive design

## Architecture

### Frontend
- **React 18** with functional components and hooks
- **AWS Amplify UI** for authentication components
- **Error Boundary** for robust error handling
- **CSS-in-JS** styling for components

### Backend
- **AWS Cognito** User Pools for authentication
- **AWS AppSync** GraphQL API
- **Amazon DynamoDB** for data persistence
- **AWS CloudFormation** for infrastructure as code

### Key Components
- `App.js` - Main application with navigation
- `UserDashboard.js` - User management and display
- `ProfilesApp.js` - Profile creation and management
- `ErrorBoundary.js` - Error handling component

## Usage

1. **Sign Up**: Create a new account with username/password
2. **Dashboard**: View all registered users
3. **Profiles**: Create and manage user profiles
4. **Navigation**: Switch between dashboard and profiles

## Development

### Local Development
```bash
npm start  # Runs on http://localhost:3001
```

### Production Deployment
```bash
amplify add hosting
amplify publish
```

### View Users
- In app: Dashboard and Profiles tabs
- AWS Console: `amplify console auth`