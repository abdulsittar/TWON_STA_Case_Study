
import { useStyles } from './landingPageStyle.js';

import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

//const IDStorage = require('../models/IDStorage');

const LandingPage = () => {
  const history = useHistory();
  const [randomID, setRandomID] = useState('');
  const [uniqId, setUniqId] = useState('');

  const classes = useStyles();

  // Fetch random ID from backend
  useEffect(() => {
    const fetchRandomID = async () => {
      try {
        //const response = await axios.post('/posts/random_id'); // Make sure this path is correct

        console.log("uniqId");
        //const urlParts = window.location.pathname.split('/');
        //const valu = urlParts[urlParts.length - 1]
        //console.log(valu);

        const queryParams = new URLSearchParams(window.location.search);
        const rawId = queryParams.get("ID");
        let cleanedId = rawId.replace(/[{}]/g, ''); // removes { and }

        try {
          const response = await axios.post('/posts/store-id', { yourID: cleanedId });

          if (response.status === 200) {
            setUniqId(cleanedId);
            console.log(uniqId);
            setRandomID(cleanedId);
          } else {
            // Handle unexpected status
            console.error("Unexpected response:", response.status);
          }
        } catch (error) {
          // Handle error, e.g. duplicate or server issue
          console.error("Failed to save ID:", error);
          // Optionally show a toast or alert to the user
        }

        console.log("Captured ID:", cleanedId);



        //setRandomID(response.data.yourID);
      } catch (error) {
        console.error("Error fetching random ID", error);
      }
    };

    fetchRandomID();
  }, []);

  const handleStartStudy = () => {
    if (randomID) {
      //history.push(`/study/${randomID}`); // Using the randomID in the URL
      window.open(`https://socialapp2.ijs.si/register/${randomID}`, '_blank');
    } else {
      console.error("No random ID found");
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.welcomeText}>Dobrodošli u istraživački projekat TWON</div>
      <Button variant="contained" className={classes.button} onClick={handleStartStudy}>
        Kliknite ovde da biste učestvovali
      </Button>
    </div>
  );
};

export default LandingPage;


