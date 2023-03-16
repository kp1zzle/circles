This template repo provides a great starting point to make sketches with p5.js, webpack, and node.  It comes with a 
pre-configured dev server and (the coolest feature) automatic deployment from the main branch to GitHub pages. This 
means that the latest version of your sketch pushed to GitHub will always be live for you to share on the internet!

Main benefits of this boilerplate over the p5 web editor or a simple local set up with only an `index.html` and a `sketch.js`:
* You can use any npm packages in your sketches! Some packages that might be useful are [Flatten.js](https://www.npmjs.com/package/@flatten-js/core) and [geometric](https://github.com/HarryStevens/geometric), but there are literally millions of packages to choose from. 
* If you're using an IDE, you can click in to the p5 methods to see their arguments and how they work. 
* Once you've cloned the repo to your local machine, you don't need an internet connection to work on your sketch. 
* It deploys your sketch to GitHub pages automatically so you can easily share your sketch on the internet.

## Getting Started
1. Click the big green `Use this template` button at top right and `Create a new repository`. 
2. Name the repository whatever you want and __make sure to check the `Include all branches` checkbox.__ Hit `Create repository from template` to create your new repo.
3. Clone your newly created repo to your local machine. (`git clone <your-repo-url>`)
4. In the terminal, `cd` into your newly cloned repo and run `npm run start` to start the dev server. 
5. Edit `index.js` using any IDE or text editor you like. Every time you save the dev server will automatically refresh so you can see your changes live. 
6. When you're happy with your sketch, commit your changes to the `main` branch and push them to GitHub. Your sketch will be automatically built and deployed to GitHub pages and will be live on the internet at `https://<your-username>.github.io/<repo-name>`

## Troubleshooting
* I forgot to check `Include all branches` when I created my repo from the template.
  * When you commit to `main` and push to GitHub, the pre-configured GitHub action will build the project and copy the build to a new branch called `gh-pages`. You will just have to go into the settings for your repo and configure GitHub pages to serve up the root of the `gh-pages` branch.  