1. I would fit my automated tests within a Github action that runs whenever code is pushed. Although any pushes should be previously tested, this adds an additional layer of stability for the production branch and enables smoother CI/CD.

2. No; you would use a unit test.

3. In navigation mode, lighthouse opens a new navigation (reloads) to the URL and measures the full page load. In snapshot mode, lighthouse views the DOM state already on screen, so it only provides static checks (i.e. accessibility, SEP, best-practices). Essentially navigation gives timing-based metrics.

4. 
a. Add

```<meta name="viewport" content="width=device-width,initial-scale=1"> in <head>```

to enable mobile scaling and improve Best-Practices, SEO score.

b. Images are not sized properly (too large). We should resize product thumbnails to max display size, and add lazy loading. This will shrink the transfer size to create better performance score and better accessibility.

c. One lighthouse result says the the website is render-blocking and uses un-minified JS. We can improve this by bundlying and minifying main.js and storage.js into one file. additinoally we can add defer to the script tags to rendering is not blocked.



