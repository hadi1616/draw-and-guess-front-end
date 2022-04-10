import { useRef, useEffect } from 'react';
import classes from './style.module.css';
import CanvasDraw from 'react-canvas-draw';
import axios from 'axios';
import { notification } from 'antd';

const Guessing = (props) => {
  const loadCanvasRef = useRef();
  const guessInputRef = useRef();
  const sessionId = props.sessionId;

  const playerId = sessionStorage.getItem('playerId');

  useEffect(() => {
    if (props.drawData) {
      onLoadHandler();
    }
  }, [props.drawData]);

  const submitHandler = (event) => {
    event.preventDefault();
    if (guessInputRef.current.value.trim().length === 0) {
      notification.error({ description: 'Empty field is invalid input.', duration: 2 });
      return;
    }
    axios.post(`${props.apiUrl}/api/guess/attempt`, {
      sessionId,
      playerId,
      hostTurn: !props.hostTurn,
      guessedWord: guessInputRef.current.value,
    })
      .then(({ data: isCorrect }) => {
        if (isCorrect) {
          props.pickWordStateHandler(false);
          notification.success({ description: 'nice one, Now you are the artist.', duration: 2 });
        } else {
          notification.warning({ description: 'Incorrect, try again', duration: 2 });
        }
        guessInputRef.current.value = '';
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          notification.error({ description: error.response.data, duration: 2 });
        }
      });
  };

  const onLoadHandler = () => {
    axios.post(`${props.apiUrl}/api/get/saved/draw`, { sessionId })
      .then(({ data: drawData }) => {
        loadCanvasRef.current.loadSaveData(JSON.stringify(drawData)); //saving the draw as string
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          notification.error({ description: error.response.data, duration: 2 });
        }
      });
  };

  return (
    <div className={classes.guess}>
      <CanvasDraw ref={loadCanvasRef} disabled hideGrid />
      <form className={classes['guess-form']} onSubmit={submitHandler}>
        <input
          type='text'
          id='guessing-input'
          placeholder='Type you guess here..'
          ref={guessInputRef}
        />
        <button className={classes.btn} type='submit'>
          Check
        </button>
      </form>
    </div>
  );
};

export default Guessing;
