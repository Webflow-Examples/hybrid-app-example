# Building a Hybrid App
This guide will walk you through the process of building a Hybrid App which allows a user to generate images from a Designer Extension using OpenAI’s Dall-E service and add them to a site’s assets. A Hybrid App uses the capabilities of both a [Data Client App](https://docs.developers.webflow.com/v2.0.0/docs/build-a-data-client) and a [Designer Extension](https://docs.developers.webflow.com/v2.0.0/docs/getting-started-1). Please read through our documentation to familiarize yourself with these concepts.  

## What we're building

![hybrid app walktrhough](/public/Large%20GIF%20(1184x674).gif)

We're diving into the capabilities of a Webflow App with an example that showcases Designer Extensions and Data Clients. 

You'll set up an app named "Devflow Party". Once installed, this app integrates a Designer Extension into the Webflow canvas, prompting users to generate images via OpenAI. Following this, it employs Webflow's REST APIs to automatically integrate the chosen images into a Webflow site.

[🏃🏽‍♂️ Jump to the tutorial!](#walkthrough)

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

### Calling Webflow APIs
> Adding Images to Site Assets

While the Data Client functionality can be integrated with your existing service, we’ve chosen to build a stand-alone server for the purposes of this example. This server, Devflow Party, has helpers to handle OAuth as well as Webflow Data API requests.

Once a user has used the Designer Extension to generate the desired images, our Data Client will need to add them to the site’s Assets. The user will select the images they wish to add, and the Devflow Extension will send a request to the Devflow service, telling the service to upload the assets.

Once the service receives an upload request, it will temporarily cache the image to disk, then upload the image to S3 and apply it to the site’s Assets list.

Webflow doesn’t currently automatically refresh the assets panel, so you will need to manually refresh the designer in order to see the newly uploaded assets.

# Walkthrough

### Prerequisites

- A Webflow workspace and site for development and testing
- A Webflow App with the [Data Client](https://docs.developers.webflow.com/docs/data-clients) and [Designer Extension](https://docs.developers.webflow.com/docs/designer-extensions) Building Blocks enabled
- The ID and Secret from your Webflow App
- A free [OpenAI](https://openai.com) account with an [API Key](https://platform.openai.com/account/api-keys)
- Node.js 16.20 or later
- Familiarity building single-page applications

## Step 1: Setting up your development environment

We're going to use GitHub codespaces as our development environment, to tak advantage of it's built in port forwarding, but please feel free to follow along developing locally.

1. [ ] **Clone the example repo to your development environment.** Navigate the [Hybrid-App-Example repo](https://github.com/Webflow-Examples/Hybrid-App-Example/tree/main). Select the `code` button and open the repo in a GitHub codespace or, if you'd like, clone the repo to your local environment.

2. [ ] **Find your redirect URI.** If you're using GitHub Codespaces, you'll want to get the URI of the forwarded port to use as the redirect URL for our Data Client app. To do this, copy the Github Codespaces URL in the address bar of your browser. Then add a `-3001.app` to the link as shown: 
    - Orignial URL: `https://curly-train-5rg69pjrrp9f4v6v.github.dev`
    - Modified URL: `https://curly-train-5rg69pjrrp9f4v6v-3001.app.github.dev`

> [!NOTE]
> If you're hosting your app locally, copy the URI for your port. Please note, redirect URIs for data clients are required to use `https`. You can use tools like NGROK to expose your local server over `https` or setup your own security certificate for local development.

3. [ ] **Modify your App's redirect URI.** Navigate to the "App Development" section of your Workspace Settings and select the `Edit App` button. Select the "Building Blocks" panel. In the "Data Client" section, replace the redirect URI with the your local development URI. Click the `Save app` button.

![Paste your redirect URI in the Yellow Box](/public/edit-app.png)

4. [ ] **Configure your environment variables.** In your IDE, copy the `.env.example` file and name it `.env.local`. Replace the variables with your own.

5. [ ] **Run your Hybrid App!** Now it's time to run your App! Open your terminal and navigate to your project folder. Enter the following command: `npm run dev`. This will install the dependencies for your Data Client and Designer Extension, and then run them on their default ports `3001` and `1337`, respectively. 

## Step 2: Authorize your Data Client

1. [ ] **Open the Data Client in your browser.** Open the link to your forwarded port. You should see a login screen. Click the `login` button.
![Screenshot of the login experience for the DevFlow Party App](/public/login-prompt.png)

> [!IMPORTANT]
> If you're using Github Codespaces, your ports will already be forwarded. Be sure to set your port visibility to public, so that you'll be able to see your App running in Webflow.

2. [ ] **Authorize App to your development workspace.** Because we're working with a Data Client that will access Webflow's REST API we'll need to authorize our App to make changes on behalf of a user. You are only able to authorize an App to sites within a single workspace, or one completee workspace. Be sure to select the Workspace where you created your App.
![Screenshot of the Authorization Screen](/public/authentication-screen.png)
Once authorized, you'll be redirected to a success screen in your Data Client.

## Step 3: Open your Designer Extension in Webflow

1. [ ] **Open your test Site in your Development Workspace.** Navigate to your Development Workspace and open a test site.

2. [ ] **Select your App from the Apps Panel.** In the left toolbar, select the Apps panel. Navigate to your App, and select it to see it's details.

3. [ ] **Replace your `Development URL.`** Similar to how we changed our redirect URI to the forwarded URL for port `3001`, change your Development URL to point to the forwarded URL for port `1337.`

![designer extension details](/public/designer-extension-details.png)

4. [ ] **Launch your App in the Designer! 🚀** Select the `Launch development App` button.

![launched app!](/public/open-designer-extension.png)

## Step 4: Generate images via the Designer Extension.

1. [ ] **Enter your image prompt.** Our App is designed to generate images from a prompt using OpenAI's DALL-E API. To generate images, enter a prompt in the input section.

2. [ ] **Select your image size and quantity.**

3. [ ] **Click the `Generate` button to create new images.** We're sending our prompt to our DevFlow Party App, which then makes an authenticated API call to DALL-E to generate the images. DevFlow party then saves the images to our sites's Assets via the REST API.

> [!Important]
> **Refresh your browser!** Until we make some changes to the designer, you'll need to refersh your browser to see changes from the API take effect. 🙇🏾‍♀️

4. [ ] **Open your Apps pane to see your new Images.** Refresh your browser, and then navigate to the Assets panel in the left toolbar. You'll now see your images, which are ready to use in the designer!

![assets panel](/public/assets-panel.png)

## Step 5. Pat yourself on the back!

You did it!