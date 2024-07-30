
# NinjaOne testing challenge

This challenge was developed using TestCafe with Javascript and Node to handle dependencies.



## Authors

- [@dquilla](https://github.com/dquilla)


## Before Installation

### Install and run BE project

Clone the Back-end project

```bash
  git clone https://github.com/NinjaRMM/devicesTask_serverApp.git
```

Go to the project directory

```bash
  cd devicesTask_serverApp
```

Install dependencies

```bash
  npm install
```

Start the back-end server

```bash
  npm start
```

### Install and run UI project
Clone the UI project

```bash
  git clone https://github.com/Yastrenky/devices-clientapp.git
```

Go to the project directory

```bash
  cd devices-clientapp
```

Install dependencies

```bash
  npm install
```

Start the UI

```bash
  npm start
```

## Test Project Installation

Install devices-testing with npm

```bash
  npm install
```
    
## Running Tests

To run tests, run the following commands:

**For chrome:**
```bash
  npm run test-chrome
```
For headless:
```bash
  npm run test-chrome-headless
```

**For other browsers:**
```bash
  npx testcafe <browser> test/tests.js
```
