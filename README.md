# Gospel Zoom&trade;

<p align="center">
    <img src="https://github.com/21beckem/Gospel-Zoom/blob/main/remote/churchZoomIcon.png?raw=true" alt="logo" width="130"/>
</p>
   
<p align="center">Software made to make managing Zoom Webinars MUCH easier!</p>

## Demo

<p align="center">
    <a href="https://youtu.be/F2N2xZkTnfU">
        <img src="https://drive.google.com/uc?export=view&id=1p69An11DmVjCsnjjUQXXu07YRIEtgMo4" alt="Watch the demo video" width="40%"/>
    </a>
</p>

## Usage

1. Ensure the device you're using as your remote is on the same WiFi as the Gospel Zoom&trade; server.
2. Launch Gospel-Zoom&trade; if it isn't already running
3. Scan the QR code on screen with your remote camera
4. Sign into Zoom&trade; and type in your webinar ID. &nbsp;&nbsp;&nbsp;(Gospel-Zoom&trade; will remember your webinar ID for next time)
5. If sign in was successful, the meeting is now live and you can control it with the remote
    - Press `Toggle Audio/Video` to toggle the feed
    - Press `End Meeting` to end the meeting
        - you need to press this button twice to ensure the meeting doesn't end accidentally
    - Click the `Preview Feed` at the top right to toggle a preview of the Gospel-Zoom&trade; screen

<br><br><hr><br><br>

## Installation

1. Download code as zip and extract to local folder
2. In extracted folder, launch cmd and run:
```bash
npm install
```
3. If you get an error about `bindings` and/or `@nut-tree/nut-js`, try running these commands in an __\*ADMIN\*__ terminal:
```bash
npm install --global --production windows-build-tools
npm install -g node-gyp
```

<!--1. Go to the [Releases](https://github.com/21beckem/Gospel-Zoom/releases/latest) page and download the latest zip
2. Extract downloaded zip to local folder-->

## Zoom Setup
1. In your Webinar options, ensure that `Enable Practice Session` is turned off
2. Zoom settings you need to turn __ON__ on your computer
    - General
        - Ask me to confirm when I leave a meeting
    - Video
        - Turn off my video when joining a meeting
    - Audio
        - Automatically join audio by computer when joining a meeting
        - Mute my microphone when joining a meeting

## Developer Info
- Built on NodeJS v16.14.2
