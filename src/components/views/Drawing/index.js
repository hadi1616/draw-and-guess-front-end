import { useRef, useState } from 'react';
import axios from 'axios';
import CanvasDraw from 'react-canvas-draw';
import classes from './style.module.css';
import { notification } from 'antd';

const Drawing = (props) => {



  const [data, setData] = useState(null);
  const canvasRef = useRef();
  const sessionId = props.sessionId;

  const clearHandle = () => canvasRef.current.clear();
  const canvasChangeHandler = (event) => setData(() => event.getSaveData());


  const onSendHandler = () => {
    axios.put(`${props.apiUrl}/api/update/drawings`, {
      drawData: data,
      sessionId,
    })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          notification.error({ description: error.response.data, duration: 2 });
        }
      });
  };


  return (
    <div className={classes.canvas}>
      <div className={classes['canvas-control-buttons']}>
        <button className={classes['clear-button']} onClick={clearHandle}>
          Clear
        </button>
        <button className={classes['send-button']} onClick={onSendHandler}>
          Send
        </button>
      </div>
      <CanvasDraw ref={canvasRef} brushRadius={1.5} brushColor={'#000000'} lazyRadius={1} canvasWidth={375} canvasHeight={400} onChange={canvasChangeHandler} />
    </div>
  );
};

export default Drawing;
