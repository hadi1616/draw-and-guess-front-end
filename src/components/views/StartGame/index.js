import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from './style.module.css';
import Card from '../../UI/Card';
import { message } from 'antd';
import TopTenPlayers from '../TopTenPlayers';

const StartGame = (props) => {

  const playNameInputRef = useRef();
  const goTo = useNavigate();

  const submitHandler = (event) => {

    event.preventDefault();

    const playerName = playNameInputRef.current.value;
    if (!(playerName.trim().length)) {
      message.error('please enter your name.', 2);
      return;
    }

    else if (playerName.trim().length > 21) {
      message.warning('the maximum number of charecters that you can enter is 20.', 2)
      return;
    }

    axios.post(`${props.apiUrl}/api/sessions/new`, { playerName: playerName })
      .then(({ data }) => {
        props.updatePlayerType('host');
        sessionStorage.setItem('sessionId', data.sessionId);
        sessionStorage.setItem('playerId', data.playerId);
        message.success('A new game has been created..', 2);
        goTo(`game-room/${data.sessionId}`);
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          message.error(error.response.data);
        }
      });
  };
  return (
    <Card className={classes.StartGame}>
      <h1>welcome to Draw and Guess game</h1>
      <p className={classes.para}>please enter your name and click create to make a new game room.</p>
      <form className={classes.form} onSubmit={submitHandler}>
        <div>
          <label htmlFor='name'>Enter Your Name:</label>
          <input className={classes.input} type='text' id='name' ref={playNameInputRef} />
        </div>
        <input type='submit' value='create game' className={classes.submitButt} />

      </form>
      <TopTenPlayers apiUrl={props.apiUrl} /> {/*Bouns*/}
    </Card>
  );
};

export default StartGame;
