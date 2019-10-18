# CITS3200-Project

Group 24's Professional Computing project

### Link to Google drive

https://drive.google.com/open?id=1aidOGQkd3Emjq8uyCGkaWVrUJE9sgmVK

### Get Started

To view the project:
Make sure you have [Nodejs and npm](https://nodejs.org) installed

1. Create a file called `.env` at the root folder with the following fields. Replace parts after `=` with actual values described

```
DATABASE_USERNAME=Database Username
DATABASE_PASSWORD=Database Password
DATABASE_HOST=Database Host
STORAGE_PROJECT_ID=GCP Cloud Storage Project ID
STORAGE_BUCKET=GCP Cloud Storage Bucket
```

2. Install dependencies

```
npm install
```

3. run the npm script

Before you perform this step. If this is the first time you are running the project, set up encryption first. Only set up encryption if you haven't done it before as the encryption key needs to be consistent so that we can decrypt/encrypt data from the database.

```
npm run generate-encryption
```

After that, start the server:

```
npm run dev
```

4. Visit `localhost:5000` in your browser

### Linting

To lint and fix the project, use the npm script

```
npm run lint
```

- Code style: [Standard](https://www.npmjs.com/package/standard)
- Linter: [ESLint](https://www.npmjs.com/package/eslint)
- Formatter: [Prettier ESLint](https://www.npmjs.com/package/prettier-eslint)

### Hosting

1. Create a GCP Compute Engine Instance
2. SSH into the instance
3. Install Nodejs

```
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
sudo apt-get install nodejs
```

To verify Nodejs installation, run `node -v` and `npm -v`

4. Follow [Get Started](#get-started)
