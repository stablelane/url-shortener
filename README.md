# URL Shortener App

A simple URL Shortener application built with Node.js, Express, and MongoDB.

## Installation

Follow these steps to set up and run the application:

1. Clone the repository:
   ```bash
   git clone https://github.com/stablelane/url-shortener.git
   cd url-shortener
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB:
   - Ensure MongoDB is installed and running on your local machine.
   - Use the default `mongodb://localhost/urlShortner` URL for the database.

4. Start the application:
   ```bash
   npm run devStart
   ```

5. Access the app:
   - Open your browser and go to `http://localhost:5000` (or the specified PORT if provided in the environment variables).

## Features

- Create short URLs
- Redirect to the original URL using the short URL
- Track the number of clicks on each URL

## Requirements

- Node.js
- MongoDB
