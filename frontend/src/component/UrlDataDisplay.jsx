import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { Loader } from "./Loader";

function UrlDataDisplay({ url }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [processedData, setProcessedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // First API call to proxy
        const postResponse = await axios.post(
          process.env.REACT_APP_PROXY_API,
          { url: url },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (postResponse.status === 200) {
          // Second API call to scrape data
          const scrapeResponse = await axios.post(
            process.env.REACT_APP_SCRAPE_API,
            { url: url },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (scrapeResponse.status === 200) {
            const scrapedData = scrapeResponse.data.cleaned_text;
            setData(scrapedData);

            // Third API call to process scraped data
            const processResponse = await axios.post(
              process.env.REACT_APP_PROCESS_TEXT_API,
              { text: scrapedData.slice(0, 200) },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (processResponse.status === 200) {
              const processedData = processResponse.data;
              setProcessedData(processedData);

              // Fourth API call to insert processed data into the database
              const insertResponse = await axios.post(
                process.env.REACT_APP_INSERT_DATA_API,
                processedData,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (insertResponse.status !== 200) {
                setError("Failed to insert processed data into the database.");
              }
            } else {
              setError("Failed to process scraped data.");
            }
          } else {
            setError("Failed to scrape data from the API.");
          }
        } else {
          setError("The URL does not exist or cannot be reached.");
        }
      } catch (error) {
        setError("Failed to fetch data from the URL (network error).");
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  if (loading) {
    return<Loader />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
    <Navbar />
    <div className="w-full flex flex-col justify-center items-center pt-8 gap-4">
      <div className="w-3/4 border-4 flex flex-col justify-center items-center gap-2 p-4 leading-12">
        <h2 className="font-bold text-lg">Scrapped text : </h2>
        <div className="text-md font-semibold text-gray-800">
          {data.slice(0,1000)}
        </div>
      </div>

      <div className="w-3/4 border-4 flex flex-col justify-center items-center gap-2 p-4 leading-12" >
        <h2 className="font-bold text-lg">Tokenization : </h2>
        <div className="text-md font-semibold text-gray-800">
          {
            processedData.tokens.map((t)=>(
              t+", "
            ))
          }
        </div>
      </div>

      <div className="w-3/4 border-4 flex flex-col justify-center items-center gap-2 p-4 leading-12">
        <h3 className="font-bold text-lg">Encoded Text : </h3>
        <div className="text-md font-semibold text-gray-800">
          {processedData.encoded_text}
        </div>
      </div>
      
      <div className="w-3/4 border-4 flex flex-col justify-center items-center gap-2 p-4 leading-12">
        <h3 className="font-bold text-lg">Decoded Text : </h3>
        <div className="text-md font-semibold text-gray-800">
          {processedData.decoded_text}
        </div>
      </div>

      <div className="w-3/4 border-4 flex flex-col justify-center items-center gap-2 p-4 leading-12">
        <h2 className="font-bold text-lg">The encoded and decoed text is {processedData.is_same_text==true?"same":"not same"}</h2>
      </div>

<div className="w-3/4 border-4 flex flex-col justify-center items-center gap-2 p-4 leading-12">
      <h2 className="font-bold text-lg">POS Tags from given text:</h2>
      <div className="text-md font-semibold text-gray-800">
        <h3 className="font-bold text-lg">Determiners:</h3>
        <ul>
          {processedData.pos_tags.determiners.length > 0 ? processedData.pos_tags.determiners.map((item, index) => (
            <li key={index}>{item}</li>
          )) : <li>No determiners</li>}
        </ul>
      </div>
      
      <div className="text-md font-semibold text-gray-800">
        <h3 className="font-bold text-lg">Nouns:</h3>
        <ul>
          {processedData.pos_tags.nouns.length > 0 ? processedData.pos_tags.nouns.map((item, index) => (
            <li key={index}>{item}</li>
          )) : <li>No nouns</li>}
        </ul>
      </div>
      
      <div className="text-md font-semibold text-gray-800">
        <h3 className="font-bold text-lg">Prepositions:</h3>
        <ul>
          {processedData.pos_tags.prepositions.length > 0 ? processedData.pos_tags.prepositions.map((item, index) => (
            <li key={index}>{item}</li>
          )) : <li>No prepositions</li>}
        </ul>
      </div>
      
      <div className="text-md font-semibold text-gray-800">
        <h3 className="font-bold text-lg">Pronouns:</h3>
        <ul>
          {processedData.pos_tags.pronouns.length > 0 ? processedData.pos_tags.pronouns.map((item, index) => (
            <li key={index}>{item}</li>
          )) : <li>No pronouns</li>}
        </ul>
      </div>
      
      <div className="text-md font-semibold text-gray-800">
        <h3 className="font-bold text-lg">Verbs:</h3>
        <ul>
          {processedData.pos_tags.verbs.length > 0 ? processedData.pos_tags.verbs.map((item, index) => (
            <li key={index}>{item}</li>
          )) : <li>No verbs</li>}
        </ul>
      </div>
    </div>

      

      <div className="w-3/4 border-4 flex flex-col justify-center items-center gap-2 p-4 leading-12">
        <h2 className="font-bold text-lg">CFG Grammar rules extracted from the given text </h2>
        <div className="text-md font-semibold text-gray-800">
          {processedData.grammar}
        </div>
      </div>

      <div className="w-3/4 border-4 flex flex-col justify-center items-center gap-2 p-4 leading-12">
        <h3 className="font-bold text-lg">Word Frequency distribution : </h3>
        <p>Showing at max 20 words with highest frequency : </p>
        <div className="text-md font-semibold text-gray-800">
          <ul>
          {processedData.word_freq_dist.map(([word, frequency], index) => (
            <li key={index}>
              <span className="font-bold">{word}:</span> {frequency}
            </li>
          ))}
        </ul>

        </div>
      </div>

    </div>
  </div>
  );
}

export default UrlDataDisplay;
