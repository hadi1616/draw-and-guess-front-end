import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Drawing from '../views/Drawing';
import ChooseWord from '../views/ChooseWord';
import Guessing from '../views/Guessing';
import Waiting from '../views/Waiting';
import GuestEntrance from '../GuestEntrance';
import axios from 'axios';
import { notification } from 'antd';

const GameSession = (props) => {

  const [allData, setAllData] = useState({
    sessionId: null,
    status: 'pending',
    hostTurn: true,
    drawData: null,
    hostId: null,
    guestId: null,
    hostName: '',
    hostScore: 0,
    guestName: '',
    guestScore: 0,
    playerType: '',
    wordPicked: false,
    intervalID: null,
  })


  const { id: sessionId } = useParams();

  const redirectTo = useNavigate();

  const { guestId, hostName, guestName, playerType, status, hostTurn, drawData, wordPicked, intervalID } = allData;

  const onFetchGameDataHandler = (data) => {
    setAllData((prevState) => {
      return {
        ...prevState, ...data
      }
    })
  };

  const playerTypeHandler = (type) => {
    setAllData((prevState) => {
      return {
        ...prevState, playerType: type
      }
    })
  };

  const pickWordHandler = (value) => {
    setAllData((prevState) => {
      return {
        ...prevState, wordPicked: value
      }
    })
  };

  const intervalIdHandler = (id) => {
    setAllData((prevState) => {
      return {
        ...prevState, intervalID: id
      }
    })
  };

  useEffect(() => { //after closing the window this api requst will excuted
    window.onbeforeunload = (event) => {
      event.preventDefault();
      event.returnValue = '';
      fetch(`${props.apiUrl}/api/update/session/status`, {
        method: 'PUT',
        keepalive: true,  // only using fetch we can change the keepalive value
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          status: 'expired',
        }),
      }).catch((error) => {
        console.error(error);
        alert(error.message);
      });
    };

    return () => (window.onbeforeunload = null);
  }, []);

  useEffect(() => {
    playerTypeHandler(props.playerType);
  }, [props.playerType]);




  useEffect(() => {

    if (status === 'pending') {
      const identifier = setInterval(() => {
        intervalIdHandler(identifier);
        axios.post(`${props.apiUrl}/api/session/data`, { sessionId })
          .then(({ data }) => {
            onFetchGameDataHandler(data);
          })
          .catch((error) => {
            console.error(error);
            if (error.response) {
              notification.error({ description: error.response.data, duration: 2 });
            }
          });
      }, 2000);
    }

    if (status === 'expired') {
      redirectTo('/');
      notification.error({ description: 'Game session has been ended, you can create a new one.', duration: 2 });
      return () => {
        clearInterval(intervalID);
      };
    }
  }, [sessionId, status, props.apiUrl]);





  if (!playerType && status === 'pending') {
    return (
      <GuestEntrance setPlayerType={props.updatePlayerType} apiUrl={props.apiUrl} sessionId={sessionId} />
    );
  }

  if (status === 'pending') {
    return (
      <Waiting playerType={props.playerType} apiUrl={props.apiUrl} sessionId={sessionId} guestId={guestId} hostName={hostName} guestName={guestName} />
    );
  }

  if (status === 'live') {

    if (hostTurn && playerType === 'host') {
      return wordPicked ? (
        <Drawing apiUrl={props.apiUrl} sessionId={sessionId} />
      ) : (
        <ChooseWord
          apiUrl={props.apiUrl}
          sessionId={sessionId}
          pickWordStateHandler={pickWordHandler}
        />
      );
    }


    if (hostTurn && playerType === 'guest') {
      return (
        <Guessing drawData={drawData} apiUrl={props.apiUrl} sessionId={sessionId} hostTurn={hostTurn} pickWordStateHandler={pickWordHandler} />
      );
    }




    if (!hostTurn && playerType === 'guest') {
      return wordPicked ? (
        <Drawing apiUrl={props.apiUrl} sessionId={sessionId} />
      ) : (
        <ChooseWord
          apiUrl={props.apiUrl}
          sessionId={sessionId}
          pickWordStateHandler={pickWordHandler}
        />
      );
    }

    if (!hostTurn && playerType === 'host') {
      return (
        <Guessing
          drawData={drawData}
          apiUrl={props.apiUrl}
          sessionId={sessionId}
          hostTurn={hostTurn}
          pickWordStateHandler={pickWordHandler}
        />
      );
    }
  }

  return (
    <>
      <p>Unlikable Access</p>
      <button
        onClick={() => {
          clearInterval(intervalID);
          redirectTo('/');
        }}
      >
        Redirect
      </button>
    </>
  );
};

export default GameSession;
