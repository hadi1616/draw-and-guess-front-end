import { useState, useEffect } from 'react';
import './style.css';
import { Table, notification } from 'antd';
import axios from 'axios';

const { Column, ColumnGroup } = Table;

const TopTenPlayers = (props) => {
  const [topTenPlayer, setTopTenPlayer] = useState([]);

  useEffect(() => {
    axios.get(`${props.apiUrl}/api/get/top/ten`)
      .then(({ data }) => {
        let topTenData = [];
        data.map((player, idx) => {
          return (topTenData = [
            ...topTenData,
            { key: idx, name: player.winner_name, score: player.winner_score },
          ]);
        });
        setTopTenPlayer(() => topTenData);
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          notification.error({ description: error.response.data, duration: 2 });
        }
      });
  }, [props.apiUrl]);

  if (!topTenPlayer.length) {
    return <></>;
  }

  return (
    <Table dataSource={topTenPlayer} pagination={false}>
      <ColumnGroup title='Top 10 Players'>
        <Column title='Players Name' dataIndex='name' key='name' />
        <Column title='Score' dataIndex='score' key='score' />
      </ColumnGroup>
    </Table>
  );
};

export default TopTenPlayers;
