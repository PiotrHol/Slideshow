# Slideshow

Slideshow is a lightweight library that allows you to quickly add sliding banners to your website. You can easily integrate it into an existing project to give your content a dynamic look.

## Demo

https://piotrhol.github.io/Slideshow/

## Installation

To install Slideshow, follow these steps:

1. Go to the releases section in this repository.
2. Download the latest release of Slideshow.
3. Unzip the downloaded archive.
4. Include the **slideshow.min.js** and **slideshow.min.css** files in your project.

## Usage

After adding the library to your project, follow these steps:

1. Add the **"slideshow-container"** class to the parent element containing the data that will be displayed as a slider.
2. Add the required **data-max-width** attribute and optional attributes to the parent element:

| Attribute                       | Description                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `data-max-width`                | **(Required)** The maximum width of the created slider.                                                |
| `data-infinity`                 | **(Optional)** If set to "true", enables infinite scrolling.                                           |
| `data-multiple-elements`        | **(Optional)** Number of elements displayed at once in the slider.                                     |
| `data-multiple-elements-mobile` | **(Optional)** Number of elements displayed at once in the slider on mobile screens (less than 769px). |
| `data-autoplay`                 | **(Optional)** If set to "true", enables automatic slide transitions.                                  |
| `data-interval`                 | **(Optional)** Time in milliseconds between automatic slide transitions (default is 5000).             |
| `data-dots-nav`                 | **(Optional)** If set to "true", changes navigation from the default arrows to dots.                   |

## Example Usage

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Slideshow Example</title>
    <link rel="stylesheet" href="slideshow.min.css" />
  </head>
  <body>
    <div
      class="slideshow-container"
      data-max-width="800"
      data-infinity="true"
      data-autoplay="true"
      data-interval="3000"
      data-dots-nav="true"
    >
      <img src="image1.jpg" class="slide" alt="Description 1" />
      <img src="image2.jpg" class="slide" alt="Description 2" />
      <img src="image3.jpg" class="slide" alt="Description 3" />
    </div>
    <script src="slideshow.min.js" defer></script>
  </body>
</html>
```

## Notes

- Ensure that the paths to the image files are correct.
- The **"slideshow-container"** class can be assigned to more than one element, creating multiple independent sliders.
- The **data-max-width** attribute is mandatory and must be set for the slider to function correctly.
