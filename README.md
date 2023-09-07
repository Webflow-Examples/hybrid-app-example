# Building a Hybrid App
This guide will walk you through the process of building a Hybrid App which allows a user to generate images from a Designer Extension using OpenAI’s Dall-E service and add them to a site’s assets. A Hybrid App uses the capabilities of both a [Data Client App](https://docs.developers.webflow.com/v2.0.0/docs/build-a-data-client) and a [Designer Extension](https://docs.developers.webflow.com/v2.0.0/docs/getting-started-1). Please read through our documentation to familiarize yourself with these concepts. 

## Prerequisites

- A Webflow workspace and site for development and testing
- A Webflow App with the [Data Client](https://docs.developers.webflow.com/docs/data-clients) and [Designer Extension](https://docs.developers.webflow.com/docs/designer-extensions) Building Blocks enabled
- The ID and Secret from your Webflow App
- An API Key from OpenAIcd

### System Requirements

-Node.js 16.20 or later


### Familiarity With

- Building single-page applications

## What we're building

We're diving into the capabilities of a Webflow App with an example that showcases Designer Extensions and Data Clients. 

You'll set up an app named "Devflow Party". Once installed, this app integrates a Designer Extension into the Webflow canvas, prompting users to generate images via OpenAI. Following this, it employs Webflow's REST APIs to automatically integrate the chosen images into a Webflow site.

### App Structure

While these two App building blocks work closely together, they are hosted and managed very differently in a Hybrid App.  
Hybrid Apps are split into two different areas of functionality:

This example app is contained within two separate folders inside the [Hybrid Example App repository](https://github.com/Webflow-Examples/Hybrid-App-Example)

- designer-extension
- data-client

### Communicating between Designer Extensions and Data Clients

![diagram of how apps communicate](https://user-images.githubusercontent.com/32463/246034069-06bd9352-ca53-4442-973a-00890bf34490.png)

This example implements a lightweight API to pass data between the Designer Extension and Data Client. The Data Client  makes API calls to the Webflow Data API and serves that data to your Extension.

While you can call third-party APIs directly from the Designer Extension, we’ve decided to call APIs from the Data Client, so that we're keeping all secrets contained on our backend.

### Calling Webflow APIs (Adding Images to Site Assets)

While the Data Client functionality can be integrated with your existing service, we’ve chosen to build a stand-alone server for the purposes of this example. This server, Devflow Party, has helpers to handle OAuth as well as Webflow Data API requests.

Once a user has used the Designer Extension to generate the desired images, our Data Client will need to add them to the site’s Assets. The user will select the images they wish to add, and the Devflow Extension will send a request to the Devflow service, telling the service to upload the assets.

Once the service receives an upload request, it will temporarily cache the image to disk, then upload the image to S3 and apply it to the site’s Assets list.

Webflow doesn’t currently automatically refresh the assets panel, so you will need to manually refresh the designer in order to see the newly uploaded assets.

## Step 1: Setting up your development environment
- github codespaces / clone repo
- modify app to redirect to Github/Server link
- modify .env file:
    - client id (DC)
    - client secret (DC)
    - backend URL (DE)
- npm install
- npm run dev
- if you're using Github code spaces make sure you set your port visibility to public

## Step 2: Authenticate
- open up 3001 and auth sites
- make sure you're authenticating to the same workspace your app is registered to

## Step 3: Open Designer Extension

- Open a site in your development workspace (aka the same workspace where your app is registered)
- navigate to the apps pane
- select your app
- replace the Development URL with the github url / or whichever URL you're using


