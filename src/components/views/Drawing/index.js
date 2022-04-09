import { useRef, useState } from 'react';
import classes from './style.module.css';
import CanvasDraw from 'react-canvas-draw';
import axios from 'axios';
import { message } from 'antd';

const Drawing = (props) => {
  // const [brushRadius, setBrushRadius] = useState(2);
  // const [brushColor, setBrushColor] = useState('#000000');
  const [data, setData] = useState(null);
  const canvasRef = useRef();
  const sessionId = props.sessionId;

  const onSendHandler = () => {
    axios.put(`${props.apiUrl}/api/update/drawings`, {
      drawData: data,
      sessionId,
    })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          message.error(error.response.data);
        }
      });
  };

  // const brushRadiusChangeHandler = (event) => {
  //   setBrushRadius(() => {
  //     const size = parseInt(+event.target.value, 10);
  //     if (size <= 1) {
  //       return 1;
  //     }
  //     return size;
  //   });
  // };

  // const onColorChange = (event) => setBrushColor(() => event.target.value);

  const clearHandle = () => canvasRef.current.clear();

  const undoHandle = () => canvasRef.current.undo();

  const canvasChangeHandler = (event) => setData(() => event.getSaveData());

  // const onRaiseSizeHandler = () => setBrushRadius((prevSize) => prevSize + 1);

  // const onLoweringSizeHandler = () =>
  //   setBrushRadius((prevSize) => {
  //     if (prevSize === 1) {
  //       return 1;
  //     }
  //     return prevSize - 1;
  //   });

  return (
    <div className={classes.canvas}>
      {/* <div className={classes['brush-radius']}>
        <label htmlFor='brush-radius'>Brush Radious:</label>
        <button
          className={classes['brush-radius-btns']}
          onClick={onLoweringSizeHandler}
        >
          -
        </button>

        <input
          type='number'
          id='brush-radius'
          onChange={brushRadiusChangeHandler}
          value={brushRadius}
        />
        <button
          className={classes['brush-radius-btns']}
          onClick={onRaiseSizeHandler}
        >
          +
        </button>
      </div> */}
      {/* <div className={classes['color-picker']}>
        <label htmlFor='color-picker'>Color Picker:</label>
        <input
          type='color'
          id='color-picker'
          value={brushColor}
          onChange={onColorChange}
        />
      </div> */}
      <div className={classes['canvas-control-buttons']}>
        <button className={classes['clear-button']} onClick={clearHandle}>
          Clear
        </button>
        <button className={classes['undo-button']} onClick={undoHandle}>
          Undo
        </button>
        <button className={classes['send-button']} onClick={onSendHandler}>
          Send
        </button>
      </div>
      <CanvasDraw
        ref={canvasRef}
        brushRadius={1.5}
        brushColor={'#000000'}
        lazyRadius={1}
        canvasWidth={600}
        canvasHeight={500}
        onChange={canvasChangeHandler}
      />
    </div>
  );
};

export default Drawing;
