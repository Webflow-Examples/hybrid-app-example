# Building a Hybrid Webflow app utilizing both Data Client and Designer Extension
With the release of Designer Extensions, Webflow Developers now have access to the Webflow Designer. Designer Extensions empower an App to take actions within the Webflow Designer on a user’s behalf. The new Designer APIs allow a Webflow App to access and create elements within the designer. Whether you’re building an AI text generator, color library tool, or incorporating your asset manager, Designer Extensions open the door for new and exciting Webflow App experiences. 

## Designer Extensions
[Designer Extensions](https://docs.developers.webflow.com/v2.0.0/docs/app-capabilities#designer-extensions) allow an app to access the Webflow Designer through new Designer APIs, letting developers transform the design process by adding automation and integrating external information directly into the Designer. Our new Designer APIs enable Apps to create, read, update, and delete elements and styles on the [Canvas](https://university.webflow.com/lesson/webflow-canvas-overview).

See the [Designer Extensions overview](https://docs.developers.webflow.com/v2.0.0/docs/app-capabilities#designer-extensions) for more information.

## Data Clients
[Data Clients](https://docs.developers.webflow.com/v2.0.0/docs/app-capabilities#data-clients) provide developers with the ability to access key information about Webflow Sites, such as their [CMS](https://webflow.com/cms) and [Ecommerce](https://webflow.com/ecommerce) information, and respond to key events via webhooks. With the introduction of new API resources and a more secure authorization framework, accessing Webflow data will become an incredibly powerful tool in your developer toolkit.
See the [Data Clients overview](https://docs.developers.webflow.com/v2.0.0/docs/app-capabilities#data-clients) for more information.

## Hybrid Apps
The most exciting thing about the new App model– with the Data Client capabilities, and the introduction of Designer Extensions–is the power that is available to developers by combining these two building blocks into a single App. This Hybrid App model allows your app to provide a comprehensive user experience by surfacing your app’s UI within the Designer and using the Data Client to manage site data, assets, and more. 

When getting started, there’s no need to worry about choosing one capability over the other. Our new Webflow Apps infrastructure is built in such a way that developers can easily build Apps that use both Data Clients and Designer Extensions in a single App; allowing you to provide your customers with powerful, comprehensive product solutions. Furthermore, we have intentionally set things up so you can start with one App building block, and seamlessly extend your App to include the other when the time is right.

### Common Use Cases for Hybrid Apps
While the concept of a Hybrid Webflow App might be new, we envision a few common use cases for this type of end-to-end functionality:

- AI Text and Image generation
- Adding custom HTML elements to pages
- Asset Management and Image Insertion

## Building a Hybrid App
This guide will walk you through the process of building a Hybrid Webflow App which allows a user to generate images from a Designer Extension using OpenAI’s Dall-E service and add them to a site’s Assets.
Prerequisites

Designer Extensions are Single-Page Applications which are hosted by Webflow and loaded into the Webflow Designer via an iframe. We recommend familiarizing yourself with both iframes and Single-Page Applications.

A hybrid app uses the capabilities of both a [Data Client App](https://docs.developers.webflow.com/v2.0.0/docs/build-a-data-client) and a [Designer Extension](https://docs.developers.webflow.com/v2.0.0/docs/getting-started-1). Please read through our documentation to familiarize yourself with these concepts. 

This example is built using [React](https://legacy.reactjs.org/docs/getting-started.html) and [Next JS](https://nextjs.org/docs).

### How the example app works
This example app is intended to showcase the capabilities of a Webflow App using both Designer Extensions and Data Clients. This app allows a user to install an app we’ve called Devflow Party, which loads a Designer Extension into the user’s Webflow canvas, providing a prompt to generate images from OpenAI. It then uses the Webflow Data API to programmatically add the selected assets to a Webflow site. 

While these two App building blocks work closely together, they are hosted and managed very differently.

### Structure
Hybrid Apps are split into two different areas of functionality:

<img width="541" alt="image" src="https://user-images.githubusercontent.com/32463/246034069-06bd9352-ca53-4442-973a-00890bf34490.png">


- Designer Extensions are packaged and uploaded via the Webflow Integrations dashboard, and executed on Webflow’s infrastructure. 


- Data Clients are generally a component of a web app which is deployed on your infrastructure. 

As such, this example app is contained within two separate Github repositories:

- Designer Extension Package: [OpenAI Image Generator](https://github.com/Webflow-Examples/devflow.party-asset-generator) 

- Data Client: [DevFlow Party](https://github.com/Webflow-Examples/devflow.party)

During the Designer Extension development process, the code for your application’s Designer Extension will be run locally, and loaded into the Webflow Designer via an iframe which loads http://localhost:1337/

While you can run the Data Client portion of the app on a cloud-hosting provider such as Vercel, the Designer Extension must be run locally, as it talks directly to the Webflow Designer via API requests from the browser to the Designer Extension’s local server.

### Passing data between Designer Extensions and Data Clients
To pass data between your Designer Extension and Data Client, you’ll need to implement a lightweight API to send commands to and fetch data from your service (Devflow Party in this example). Your service will function as a proxy to make API calls to the Webflow Data API and serve that data to your extension. 

While you can call third-party APIs directly from the Designer Extension, we’ve built that business logic into the Devflow Party service and provided an API for the Extension to send requests to.

### Creating a Webflow App
In order to create a Hybrid app, you need to create a Webflow app with both Designer Extension and Data Client capabilities. 

Please follow the App Registration and Register Scopes steps described in the [“Getting Started”](https://docs.developers.webflow.com/v2.0.0/docs/getting-started) Section to create a Webflow App. 

Select both “Designer Extension” and “Data Client” under the Capabilities section. 

Make sure you select Asset->Read and Write scopes.

### Setting up your Development Environment
In order to set up your local development environment, you’ll need to run through the following steps for each example codebase.
#### Data Client Setup
First, install the dependency packages needed to run the Data Client code

`npm install`

Once the dependencies are loaded, you can run the Devflow Party code

`npm run dev`

Once the Devflow Party code is running, its HTTP server will be available at http://localhost:3001. This is where the Designer Extension will submit requests.

See the [Data Clients Overview](https://docs.developers.webflow.com/v2.0.0/docs/1-understanding-data-clients) guide for more information.

#### Designer Extension Setup
Similarly to the Data Client setup process, first you will need to install the node dependencies

`npm install`

Once the dependencies are loaded, you can run the Designer Extension

`npm run dev`

The Designer Extension will start up another HTTP server at http://localhost:1337. The Webflow Designer will load this path into the Designer Extension iframe.

To see your Designer Extension in Webflow, open your test site in the Webflow designer, click on the puzzle icon in the left panel. Click on your app’s name, then click on “Run development app.”

See the [Designer Extensions Overview](https://docs.developers.webflow.com/v2.0.0/docs/how-do-apps-work-with-the-designer) guide for more information.

### Calling Third-Party APIs (Generating Images)
This example app allows users to fill out a prompt and generate images via OpenAI’s Image Generation API. See the [OpenAI documentation](https://platform.openai.com/docs/guides/images) for more information on using those APIs.

As mentioned above, the business logic for generating images lives within the Devflow Party service, and the Designer Extension passes the request from the user into that service, which calls OpenAI’s API and returns the generated images.

We chose this model because it allows us to make significant changes to the image generation logic, including changing the provider, without needing to make changes to the Designer Extension code and having to submit those changes for review.

### Calling Webflow APIs (Adding Images to Site Assets)
While the Data Client functionality can be integrated with your existing service, we’ve chosen to build a stand-alone server for the purposes of this example. This server, Devflow Party, has helpers to handle OAuth as well as Webflow Data API requests.

Once a user has used the Designer Extension to generate the desired images, our Data Client will need to add them to the site’s Assets. The user will select the images they wish to add, and the Devflow Extension will send a request to the Devflow service, telling the service to upload the assets.

Once the service receives an upload request, it will temporarily cache the image to disk, then upload the image to S3 and apply it to the site’s Assets list.

Webflow doesn’t currently automatically refresh the assets panel, so you will need to manually refresh the designer in order to see the newly uploaded assets.
