Website : [(https://socialapp.ijs.si/)](https://socialapp.ijs.si/)

# TWON Social Application

## Overview

This tool supports multi-round social media experiments designed to study user engagement with news and information content. It allows researchers to simulate realistic feed dynamics and observe how users interact with different types of content over time.

In one study conducted with Serbian participants in collaboration with the Slovenian Press Agency (STA), the platform was used to examine engagement with news related to the war in Ukraine. The experiment included manipulated Serbian-language news articles and general social media posts. Some Ukraine-related articles contained varying levels of disinformation, allowing researchers to study who clicks on such content and how users respond when exposed to it.

The study was conducted in May 2025 and included 272 participants recruited through a Serbian recruitment platform. Participants accessed the study via desktop and interacted with a simulated social media feed.

A key feature of this tool is its multi-round design. Users can refresh their feed to simulate returning to a platform over time. After the initial round, participants were assigned to one of three groups: a control group, a reinforcing group, or an opposing group. While the control group continued to see randomized content, the reinforcing group saw more content aligned with what they previously engaged with, and the opposing group saw that type of content downranked. This process was repeated across multiple rounds.

Content ranking was based on user engagement. Likes increased a post’s score, dislikes reduced it, and clicking on news articles counted as positive interaction. This setup enables researchers to study feedback loops, selective exposure, and the effects of algorithmic ranking in a controlled experimental environment.

## App Flow (STA Study)

1. **Consent Form** – Participants first review and accept the informed consent.

    ![Consent form](screenshots/sta%20screenshots/consent%20form.png)

2. **Pre-Survey** – Baseline responses are collected before feed exposure begins.

    ![Pre-survey](screenshots/sta%20screenshots/presurvey.png)

3. **Study Information** – Instructions explain the task and how interaction data will be collected.

    ![Study information](screenshots/sta%20screenshots/information.png)

4. **Username Selection** – Participants choose a username before starting the experiment.

    ![Username choice](screenshots/sta%20screenshots/username_choice.png)

5. **Main Feed Interaction** – Participants browse the simulated social feed, like/dislike posts, and open news articles.

    ![Feed](screenshots/sta%20screenshots/feed.png)

6. **Article View** – Clicking a news item opens the article and records engagement.

    ![Article view](screenshots/sta%20screenshots/article.png)

After 3 feed refreshes (three rounds of interaction), participants can proceed to the post-survey.

7. **Post-Survey** – Participants complete a follow-up survey at the end.

    ![Post-survey](screenshots/sta%20screenshots/postsurvey.png)


## Project Structure

- `client/` – React frontend (UI, feed, surveys, and interaction components).
- `server/` – Node.js/Express backend (API routes, controllers, models, auth middleware).
- `screenshots/sta screenshots/` – STA study flow screenshots used in this README.
- `docker-compose.yml` – Multi-container setup for client, server, and MongoDB.

## How to Run

Prerequisites:
- Node.js `20.x`
- npm
- MongoDB running locally or a MongoDB URI in `server/.env`

Steps:
1. Install backend dependencies:
    - `cd server && npm install`
2. In a new terminal, install frontend dependencies:
    - `cd client && npm install`
3. Build frontend assets:
    - `cd client && npm run build`
4. Configure environment variables in `server/.env` (at minimum database connection and required app settings).
5. Start backend server in production mode (serves `client/build` and runs on port `1075`):
    - `cd server && NODE_ENV=production npm start`

Open the app in your browser at `http://localhost:1075`.

Notes:
- After any frontend change, run `cd client && npm run build` again so the server serves the updated `client/build` files.
- If the app is running on the IJS server deployment, access it at `https://socialapp.ijs.si/` instead of localhost.

