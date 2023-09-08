<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/187iTjh.png" alt="Project logo"></a>
</p>

<h3 align="center">Moovy</h3>

<div align="center">

  [![Status](https://img.shields.io/badge/status-active-success.svg)]() 
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

<p align="center"> Moovy has added your favorite movies to your library and leave your audio commentary to listen whenever and wherever you want!
    <br> 
    <div align="center">
      
![image](https://github.com/maikehenrique/Moovy/assets/54610589/ca8819b0-3a51-43a0-a031-4fd34fb21974)
    </div>
</p>

## 📝 Table of Contents
- [About](#about)
- [Installing](#install)
- [Running](#running)

## 🧐 About <a name = "about"></a>
Movvy is a project part of the selection process for fullstack Developers. Moovy is a project aimed at film enthusiasts so they can seek out and learn from them. In it, the user can add his favorite movies to his library and even carry out an audio review so that they can be heard whenever he wants. You can access it at: https://movvy-built.vercel.app/
### Prerequisites

 * Postgresql
 * Node.js

### Installing <a name = "install"></a>
After performing the clone of the project, perform the following steps to run the project
 
 * Create an .env file in the backend root directory
  ```bash
    OMDBAPIURL=https://www.omdbapi.com/
    OMDPAPIKEY=XXXXXX
    DB_HOST=localhost
    DB_PORT=5432
    DB_DATABASE=moovy_db
    DB_USERNAME=postgres
    DB_PASSWORD=postgres
  ```
 * Create a Postgresql database named in the .env file
 * Create an .env file in the frontend directory
  ```bash
    REACT_APP_URL_BACKEND=http://localhost:9000/api/v1/
  ```
  * Use NodeJs default package manager [npm](https://www.npmjs.com/) to install dependencies on frontend and backend.
  ```bash
    npm install
  ```

## 🔧 Running <a name = "running"></a>

<h5>Frontend</h5>

```bash
  npm run start
```

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

<h5>Backend</h5>

```bash
  npm run start
```

Run the app in development mode. Will start a service on port 9000. The default consumption from the frontend to the backend will soon be [http://localhost:9000](http://localhost:9000)

## License

[MIT](https://choosealicense.com/licenses/mit/)

<h3 align="left">Connect with me:</h3>
<p align="left">
<a href="https://www.linkedin.com/in/maikehenrique/" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="https://www.linkedin.com/in/maikehenrique/" height="30" width="40" /></a>
</p>

<h3 align="left">Languages and Tools:</h3>
<p align="left"> <a href="https://developer.android.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/android/android-original-wordmark.svg" alt="android" width="40" height="40"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a> <a href="https://www.postgresql.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/> </a> <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a> </p>
