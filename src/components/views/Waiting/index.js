import { useState, useEffect } from 'react';
import classes from './style.module.css';
import GlobalStyling from '../../GlobalStyling';
import { Spin, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';

const Waiting = (props) => {

  const [showElements, setShowElements] = useState(false);

  const sharedURL = window.location.href;

  const showElementsHandler = (value) => setShowElements(value);

  const antIcon = <LoadingOutlined style={{ fontSize: 40, color: 'black' }} spin />;

  const onStartHandler = () => {

    axios.put(`${props.apiUrl}/api/update/session/status`, {
      status: 'live',
      sessionId: props.sessionId,
    })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          notification.error({ description: error.response.data, duration: 2 });
        }
      });
  };

  useEffect(() => {
    if (props.playerType === 'host') {
      showElementsHandler(true);
    } else {
      showElementsHandler(false);
    }
  }, [props.playerType]);


  const askingPlayerToCopy = "Please copy this link to another browser:"
  const copyURL = `${sharedURL}`

  let showSpinOrStart = (

    <>
      <Spin indicator={antIcon} />

      <div className={classes.clipboard}>
        <span className='waiting'>
          {showElements ? 'Please wait for another player to join the link' : 'Waiting for admin to start game...'}
        </span>
        {showElements &&
          <div>
            <text>{askingPlayerToCopy + " "}{<b>{copyURL}</b>}</text>
          </div>
        }
      </div>
    </>

  );

  //start game relevat for the host 
  if (showElements && props.guestId) {

    showSpinOrStart = (
      <button onClick={onStartHandler} className={classes.btn}>
        Start Game
      </button>
    );
  }

  return (
    <GlobalStyling className={classes.waiting}>
      {props.hostName && (
        <GlobalStyling className={classes.players}>{props.hostName}</GlobalStyling>
      )}
      {props.guestName && (
        <GlobalStyling className={classes.players}>{props.guestName}</GlobalStyling>
      )}
      <div className={classes['spin-or-button']}>{showSpinOrStart}</div>
    </GlobalStyling>
  );
};

export default Waiting;

