import { useState, useEffect } from 'react';
import classes from './style.module.css';
import GlobalStyling from '../../GlobalStyling';
import axios from 'axios';
import { notification } from 'antd';
import randomWord from 'random-words';

const ChooseWord = (props) => {
  const [words, setWords] = useState(randomWord({ exactly: 3 }));
  const [selectedWord, setSelectedWord] = useState('');
  const sessionId = props.sessionId;

  useEffect(() => {
    if (selectedWord) {
      axios.put(`${props.apiUrl}/api/update/chosen/word`, { chosenWord: selectedWord, sessionId })
        .then(() => {
          props.pickWordStateHandler(true);
        })
        .catch((error) => {
          console.error(error);
          if (error.response) {
            notification.error({ description: error.response.data, duration: 2 });
          }
        });
    }

  }, [selectedWord, sessionId]);

  const onSelectHandler = (event) => setSelectedWord(() => event.target.value);
  return (
    <GlobalStyling className={classes['choose-words']}>
      <p>Pick a word from below to draw:</p>
      <div className={classes.words}>
        {words &&
          words.map((word) => (
            <div className={classes.choice} key={word}>
              <input
                type='radio'
                id={word}
                value={word}
                name='word'
                onChange={onSelectHandler}
              />
              <label htmlFor={word}>{word}</label>
            </div>
          ))}
      </div>
    </GlobalStyling>
  );
};

export default ChooseWord;
