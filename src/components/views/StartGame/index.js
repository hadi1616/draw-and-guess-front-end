import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from './style.module.css';
import GlobalStyling from '../../GlobalStyling';
import { notification } from 'antd';
import TopTenPlayers from '../TopTenPlayers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const StartGame = (props) => {

  const playNameInputRef = useRef();
  const redirectTo = useNavigate();

  const submitHandler = (event) => {

    event.preventDefault();

    const playerName = playNameInputRef.current.value;
    if (!(playerName.trim().length)) {
      toast.error("please enter your name");
      return;
    }

    else if (playerName.trim().length > 21) {
      toast.warning("be carful the maximum number for charcter is 20")
      return;
    }

    axios.post(`${props.apiUrl}/api/sessions/new`, { playerName: playerName })
      .then(({ data }) => {
        props.updatePlayerType('host');
        sessionStorage.setItem('sessionId', data.sessionId);
        sessionStorage.setItem('playerId', data.playerId);
        notification.success({ description: 'New room created', duration: 2 });
        redirectTo(`roomId/${data.sessionId}`);
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          notification.error({ description: error.response.data, duration: 2, top: 90 });
        }
      });
  };
  return (
    <GlobalStyling className={classes.StartGame}>
      <h1>welcome to Draw and Guess game</h1>
      <form className={classes.form} onSubmit={submitHandler} >
        <ToastContainer />
        <div>
          <label htmlFor='name'>Enter Your Name:</label>
          <input className={classes.input} type='text' id='name' ref={playNameInputRef} />
          <input type='submit' value='create game' className={classes.submitButt} />
          <button className={classes.serverStatusBtn} onClick={() => redirectTo('helthCheckStatus')}>server status</button>
        </div>

      </form>
      <TopTenPlayers apiUrl={props.apiUrl} /> {/*Bouns*/}

    </GlobalStyling>
  );
};

export default StartGame;
