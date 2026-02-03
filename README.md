# Jammming

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/wemiibidun/jammming)
![GitHub languages count](https://img.shields.io/github/languages/count/wemiibidun/jammming)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://wemiibidun.github.io/jammming/)

## Table of contents
* [Introduction](#introduction)
* [Screenshot](#screenshot)
* [Technologies](#technologies)
* [Features](#features)
* [Setup](#setup)
* [Deployment (CRA + GitHub Pages)](#deployment-cra--github-pages)
* [Link to Published Project](#link-to-published-project)
* [Status](#status)
* [Contact](#contact)

## Introduction
Jammming is a React app that connects to Spotify so users can search tracks, build a custom playlist, and save it directly to their Spotify account.

## Screenshot
![Jammming preview](https://github.com/wemiibidun/jammming/blob/main/jammmming_screenshot.png)

## Technologies
![React](https://img.shields.io/badge/React-239120?style=for-the-badge&logo=react&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white)

* React — component-driven UI and state management
* CSS — custom layout and styling
* Spotify Web API — search and playlist creation
* OAuth (Implicit Grant) — client-side authentication

## Features
* Search by song, artist, or album
* Add and remove tracks from a custom playlist
* Rename playlists before saving
* Save playlists directly to Spotify

## Setup
1. Create a Spotify Developer app and copy your client ID.
2. Update `src/util/Spotify.js` with your `clientID`.
3. Add this Redirect URI to your Spotify app:
   * `https://wemiibidun.github.io/jammming/`
4. Install and run:
   * `npm install`
   * `npm start`

## Deployment (CRA + GitHub Pages)
1. Install the deploy tool:
   * `npm install --save-dev gh-pages`
2. Add scripts in `package.json`:
   * `"predeploy": "npm run build"`
   * `"deploy": "gh-pages -d build"`
3. Deploy:
   * `npm run deploy`
4. In GitHub: **Settings → Pages** → Source: **Deploy from a branch** → **gh-pages** → **/ (root)**.

## Link to Published Project
[Jammming App Webpage](https://wemiibidun.github.io/jammming/)

## Status
Project is: _Complete_

## Contact
Created by [@wemiibidun](https://github.com/wemiibidun)
