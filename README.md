# CITS3200-Project

Group 24's Professional Computing project

### Link to Google drive

https://drive.google.com/open?id=1aidOGQkd3Emjq8uyCGkaWVrUJE9sgmVK

### Get Started

To view the project:

1. Create a file called `.env` at the root folder with the following fields. Replace parts after `=` with actual values described

```
DATABASE_USERNAME=Database Username
DATABASE_PASSWORD=Database Password
DATABASE_HOST=Database Host
STORAGE_PROJECT_ID=GCP Cloud Storage Project ID
STORAGE_BUCKET=GCP Cloud Storage Bucket
```

2. run the npm script

```
npm run dev
```

3. Visit `localhost:5000` in your browser

### Linting

To lint and fix the project, use the npm script

```
npm run lint
```

- Code style: [Standard](https://www.npmjs.com/package/standard)
- Linter: [ESLint](https://www.npmjs.com/package/eslint)
- Formatter: [Prettier ESLint](https://www.npmjs.com/package/prettier-eslint)
