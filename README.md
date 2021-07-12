![Hemolog Banner](public/images/github-banner.png)

A rebirth of my popular medication tracking app for people living with hemophilia. Available for free at hemolog.com

- Free to use
- Not sponsored by any person or company
- Open source

Hemolog is free but if you'd like to [Donate](https://github.com/sponsors/michaelwschultz), that would be awesome.

<br />

## Features

### Insights on your data

Insights are something that I always wanted to be apart of Hemolog, and now they're finally here.

These insights are calculated as you add more data. Filters will allow you to choose different time frames for viewing your data down the road giving you the best most comprehensive view into your treatment history ever. I've chosen a few stats that are interesting for me. If you have thoughts on what you would like to see just let me know.

![Insights Example](public/images/insights-example.png)

### Emergency Card

Allows emergency personnel to scan or visit the link written on your emergency card to quickly get all the crucial information they need.

![Example Emergency Card](public/images/example-emergency-card.png)

Create an account and fill out the profile before printing yours out today.

<br />

## History

Hemolog was the first iPhone app available for hemophiliacs back in 2011. It has since been removed from the App Store since focusing on other projects meant that I couldn't keep it updated.

I initially designed Hemolog for myself. I was in college at the time and had been building websites and web apps for friends and family, along with the odd job here and there.

Hemolog meant the world to me and I'm glad it was able to serve people well for the 4 years it was on the App Store. But this year (2020), I decided to take another crack at it. The first version never really lived up to what it was suppose to be. The most important part of having data in a digital format is the ability to quickly gain insights from it. The first version didn't have any built in analytics or stats. This time around, I've made that the number one priority.

I hope you find Hemolog useful and friendly to use. Or, if you don't have a bleeding disorder like hemophilia, perhaps you find this project interesting none the less.

<br />

## Developers

### Getting Started

You'll need Node and Yarn installed before you can run the server. Check the package.json for corresponding version numbers.

You'll also need your own Firebase Cloud Firestore and Authentication instances. You can sign up for free at [firebase.google.com](https://firebase.google.com/).

Once you've setup your Firebase account you'll need to add a number of keys to a local `.env` file.

```
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_DATABASE_URL=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY=""
FIREBASE_CLIENT_EMAIL=""
FIREBASE_PRIVATE_KEY=""
```

Then run the development server.

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

### Learn More about Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

### Deployed on Vercel (you can do the same)

The easiest way to deploy Hemolog is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

<br />

## API

Added in June 2021. The Hemolog.com API allows anyone with an account to access their data via REST endpoints.

Right now, the only endpoint available is https://hemolog.com/api/recent-infusions

This endpoint returns the API key holders most recent 3 infusion logs. Same as what is shown on the public emergency page for each user.

#### Example cURL request
```
curl -X GET \
  'https://hemolog.com/api/recent-infusions' \
  -H 'Accept: */*' \
  -H 'apikey: <your-api-key>'
```
