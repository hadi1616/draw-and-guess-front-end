import { useRef } from 'react';
import classes from './style.module.css';
import GlobalStyling from '../GlobalStyling';
import { notification } from 'antd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GuestEntrance = (props) => {

  const guestNameInputRef = useRef();
  const sessionId = props.sessionId;

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredName = guestNameInputRef.current.value;

    if (!enteredName.trim().length) {
      toast.error("please enter your name");
      return;
    }


    else if (enteredName.trim().length > 21) {
      toast.warning("be carful the maximum number for charcter is 20")
      return;
    }

    axios.put(`${props.apiUrl}/api/enter/guest/name`, { sessionId, enteredName })
      .then(({ data }) => {
        props.setPlayerType('guest');
        sessionStorage.setItem('sessionId', sessionId);
        sessionStorage.setItem('playerId', JSON.stringify(data.guestId));
        notification.success({ description: 'another played joined the game ', duration: 2 });
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          notification.error({ description: error.response.data, duration: 2 });
        }
      });
  };
  return (
    <GlobalStyling className={classes['guest-entrance-card']}>
      <form className={classes['guest-entrance']} onSubmit={submitHandler}>
        <ToastContainer />
        <div>
          <label htmlFor='name'>Enter You Name:</label>
          <input className={classes.guestInpt} type='text' id='name' ref={guestNameInputRef} />
        </div>
        <input type='submit' value='Join Game' className={classes.joinGameButtn} />
      </form>
    </GlobalStyling>
  );
};

export default GuestEntrance;
