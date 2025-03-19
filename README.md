# plap

[![License](https://img.shields.io/github/license/steeven9/plap)](/LICENSE)
[![Pipeline](https://github.com/steeven9/plap/actions/workflows/docker-image.yml/badge.svg)](https://github.com/steeven9/plap/actions/workflows/docker-image.yml)

## ℹ️ Description

Basic and intuitive planning poker web application

## 🏡 Local development

### ⚙️ Prerequisites

- Node.js v22
- Yarn package manager

### 🔧 Installation

```bash
# install dependencies
yarn install

# bootstrap local configuration
cp .env.example .env.local
```

Then adapt the values in the `.env.local` file

### 🚀 Run locally

```bash
# start frontend
yarn dev
```

Finally, open your browser and head to <http://localhost:3000>.
The first load might take a while, so be patient!

## ♻️ Contributing

If you spot a bug or think there's a missing feature, feel free to open an issue on our GitHub page!

Before submitting a pull request, please check that the build is still passing even after the changes:

```bash
yarn build
```
