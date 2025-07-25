# Deploying TimeWise to Heroku

This guide provides step-by-step instructions for deploying the TimeWise application to Heroku.

## Prerequisites

1. [Heroku account](https://signup.heroku.com/) - Create a free Heroku account if you don't have one
2. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) - Install the Heroku Command Line Interface
3. [Git](https://git-scm.com/downloads) - Make sure Git is installed

## Deployment Steps

### 1. Login to Heroku

Open your terminal and login to Heroku:

```bash
heroku login
```

### 2. Initialize Git Repository (if not already done)

If your project is not already a Git repository:

```bash
git init
git add .
git commit -m "Initial commit for Heroku deployment"
```

### 3. Create a Heroku App

```bash
heroku create timewise-app
```

You can replace `timewise-app` with your preferred app name. This will create a Heroku app and add a remote to your Git repository.

### 4. Configure Environment Variables (if needed)

If your app requires environment variables:

```bash
heroku config:set REACT_APP_API_URL=your_api_url
```

### 5. Deploy to Heroku

```bash
git push heroku main
```

If your branch is named `master` instead of `main`, use:

```bash
git push heroku master
```

### 6. Open Your App

```bash
heroku open
```

## Additional Configuration

### Scaling Dynos

By default, your app will run on a single web dyno. To scale:

```bash
heroku ps:scale web=1
```

### Viewing Logs

To view application logs:

```bash
heroku logs --tail
```

### Troubleshooting

If you encounter any issues:

1. Check that all necessary files are committed (Procfile, static.json)
2. Verify your package.json has the correct scripts and engines sections
3. Check Heroku logs for specific error messages

## Continuous Deployment

For continuous deployment, consider connecting your GitHub repository to Heroku:

1. Go to your Heroku dashboard
2. Select your app
3. Go to the "Deploy" tab
4. Connect to your GitHub repository
5. Enable automatic deploys from your main branch

## Important Notes

- The free tier of Heroku will put your app to sleep after 30 minutes of inactivity
- Your app will have a URL like `https://timewise-app.herokuapp.com`
- Static files are served from the `build` directory as configured in static.json
