const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
  })
);
const countries = require("./data");

// Define a route to return the array of countries
app.get("/countries", async (req, res) => {
  const subregion = req.query.subregion;

  const filteredCountries = countries.filter((country) => {
    if (subregion) {
      return subregion === country.subregion;
    }
    return true;
  });

  filteredCountries.forEach((country) => {
    console.log(country.name.common);
  });
  res.json(filteredCountries);
  // try {
  //   // Make a GET request to the external API using Axios
  //   const response = await axios.get("https://restcountries.com/v3.1/all"); // Replace with the actual API endpoint

  //   // Check if the response status code is OK (200)
  //   if (response.status === 200) {
  //     // Assuming the API response contains an array of countries, you can filter the data here

  //     const subregion = req.query.subregion;

  //     const filteredCountries = response.data.filter((country) => {
  //       if (subregion) {
  //         return country.independent && subregion === country.subregion;
  //       }
  //       return country.independent;
  //     });

  //     // Send the filtered data to the frontend as JSON
  //     res.json(filteredCountries);
  //   } else {
  //     // Handle other status codes if needed
  //     res
  //       .status(response.status)
  //       .json({ error: "Failed to fetch data from the external API" });
  //   }
  // } catch (error) {
  //   // Handle any errors that occurred during the request
  //   console.error("Error fetching data:", error);
  //   res.status(500).json({ error: "Internal server error" });
  // }
});

// Start the server
const port = process.env.PORT || 7070;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
