import axios from "axios";

import "./App.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import ListItem from "./components/ListItem";
import MCOptions from "./components/MCOptions";
import shuffleArray from "./helpers/shuffledArray";
import isStringCloseToReference from "./helpers/calculateLevenshteinDistance";
import TextButton from "./components/TextButton";
import { subregions } from "./subregions";

interface Country {
  name: {
    common: string;
  };
  capital: string[];
  // Add other properties as needed
}

function App() {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [countries, setCountries] = useState<Country[] | []>([]);
  const [randomNumber1, setRandomNumber1] = useState<number | null>(null);
  const [randomNumber2, setRandomNumber2] = useState<number | null>(null);
  const [randomNumber3, setRandomNumber3] = useState<number | null>(null);

  const [inputValue, setInputValue] = useState<string>("");
  const [resultMsg, setResultMsg] = useState<string>("");
  const [hint, setHint] = useState<boolean>(false);
  const [gameModeEasy, setGameModeEasy] = useState(true);
  const [subregion, setSubregion] = useState<string>("Northern Europe");

  const [streak, setStreak] = useState(0);

  const resetGame = useCallback((countriesData: Country[]) => {
    const uniqueRandomNumbers = new Set<number>();
    console.log("length is " + countriesData.length);
    while (uniqueRandomNumbers.size < 3) {
      uniqueRandomNumbers.add(Math.floor(Math.random() * countriesData.length));
    }

    const [number1, number2, number3] = [...uniqueRandomNumbers];

    setRandomNumber1(number1);
    setRandomNumber2(number2);
    setRandomNumber3(number3);

    setHint(false);
    setResultMsg("");
    setInputValue("");
  }, []);

  const getData = useCallback(async () => {
    setLoading(true);
    await axios
      .get(
        `http://localhost:7070/countries${
          subregion && `?subregion=${subregion}`
        }`
      )
      // .get("https://restcountries.com/v3.1/independent?status=true")

      .then((res) => {
        console.log(res);
        setCountries(res.data);
        setLoading(false);
        resetGame(res.data);
      })
      .catch((err) => {
        console.error(err);
        setResultMsg("Something went wrong!");
      });
  }, [subregion, resetGame]);

  const country = useMemo(() => {
    if (countries.length && randomNumber1 !== null) {
      return countries[randomNumber1]?.name.common;
    }
  }, [countries, randomNumber1]);

  const capital1 = useMemo(() => {
    if (!loading && randomNumber1 !== null) {
      console.log(randomNumber1);

      return countries[randomNumber1]?.capital[0];
    } else {
      return "";
    }
  }, [countries, randomNumber1, loading]);

  const capital2 = useMemo(() => {
    if (!loading && randomNumber2 !== null) {
      console.log(randomNumber2);

      return countries[randomNumber2]?.capital[0];
    } else {
      return "";
    }
  }, [countries, randomNumber2, loading]);

  const capital3 = useMemo(() => {
    if (!loading && randomNumber3 !== null) {
      console.log(randomNumber3);
      return countries[randomNumber3]?.capital[0];
    } else {
      return "";
    }
  }, [countries, randomNumber3, loading]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (!initialized && countries.length) {
      resetGame(countries);
      setInitialized(true);
    }
  }, [initialized, countries, resetGame]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    (value: string) => {
      // new handler
      const submission = value.toLowerCase();
      const reference = capital1.toLowerCase();

      const spellingErrorLimit = 2;

      const result = isStringCloseToReference(
        submission,
        reference,
        spellingErrorLimit
      );

      // old handler
      if (result === "match") {
        setResultMsg("Correct!");
        setStreak(streak + 1);
      } else if (result === "nomatch") {
        setResultMsg("Incorrect!");
        setStreak(0);
      } else if (result === "close") {
        setHint(true);
      }
    },
    [capital1, streak]
  );

  const options = useMemo(() => {
    return shuffleArray([capital1, capital2, capital3]);
  }, [capital1, capital2, capital3]);

  const handleSubregion = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSubregion(e.target.value);
    },
    []
  );

  return (
    <>
      <div>
        <h1>🌎</h1>
        {streak > 2 && (
          <h2 style={{ marginBottom: "20px" }}>🔥🔥🔥Streak: {streak}🔥🔥🔥</h2>
        )}
        {!loading && (
          <div>
            {!gameModeEasy ? (
              <div>
                The country is <strong>{country}</strong> and the capital is{" "}
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                />{" "}
                <button onClick={() => handleSubmit(inputValue)}>Guess</button>
              </div>
            ) : (
              <div>
                {" "}
                <div>
                  The country is <strong>{country}</strong>, the capital is:
                </div>{" "}
                <div>
                  <MCOptions
                    loading={loading}
                    options={options}
                    submitAnswer={(value: string) => {
                      handleSubmit(value);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        {loading && <div>Loading ....</div>}
        <h3 style={{ color: resultMsg === "Incorrect!" ? "red" : "green" }}>
          {resultMsg}
        </h3>
        {hint && (
          <p>
            Did you mean{" "}
            <TextButton onClick={() => handleSubmit(capital1)}>
              {capital1}?
            </TextButton>
          </p>
        )}
        <hr></hr>
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => resetGame(countries)}>Next Country</button>{" "}
          <button onClick={() => setGameModeEasy(!gameModeEasy)}>
            {gameModeEasy ? "Hard " : "Easy "} Mode
          </button>
          <div style={{ marginTop: "20px" }}>
            <label>Subregion</label>
            <select onChange={handleSubregion}>
              {subregions.map((subregion: string) => {
                if (subregion === "All") {
                  return (
                    <option key={subregion} value={""}>
                      {subregion}
                    </option>
                  );
                }
                return (
                  <option key={subregion} value={subregion}>
                    {subregion}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "200px" }}>
        Here we are going to:
        <ul>
          <ListItem>Import a list of country-capital pairs</ListItem>
          <ListItem>
            create a UI that makes you guess the capital based on the country
          </ListItem>

          <ListItem>
            stretch: create a button to switch to guessing the country based on
            the capital
          </ListItem>

          <ListItem>
            stretch: create a globle style distance guessing game...
          </ListItem>
          <ListItem>
            Fun idea! Have a country of the day and have a timer going that
            makes you guess random facts about the country...
          </ListItem>
          <ListItem>
            Consider saving the data in my own database... setting up a graphql
            and prisma server...
          </ListItem>
        </ul>
      </div>
    </>
  );
}

export default App;
