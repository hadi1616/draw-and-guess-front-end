import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { notification } from 'antd';
import classes from './style.module.css'





const HelthCheck = (props) => {

  const redirectTo = useNavigate();

  const [serverData, setServerData] = useState({
    uptime: '',
    date: '',
    status: '',
  })

  const { uptime, date, status } = serverData;

  useEffect(() => {

    axios.get(`${props.apiUrl}/api/status`)
      .then(({ data }) => {
        concatData(data)
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          notification.error({ description: 'the server is not up' });
        }
      });

  }, []);


  const concatData = (data) => {
    setServerData((prevState) => {
      return {
        ...prevState, ...data
      }
    })
  };


  return (
    <>
      <div className={classes.serverStatusStyling}>
        <p>{`Server Uptime: ${uptime}`}</p>
        <p >{`Current date: ${date}`}</p>
        <p>{`Server status: ${status}`}</p>

        <button className={classes.button} onClick={() => { redirectTo('/'); }}>Back to Home page</button>
      </div>
    </>

  )

}

export default HelthCheck;