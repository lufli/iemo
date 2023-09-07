import Head from 'next/head';
import React from 'react';
import { kv } from '@vercel/kv';
import {
  Col,
  Divider,
  Row,
  Space,
  Table,
  Tag,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import powerball from '@/lib/lottery/powerball';
import doublePlay from '@/lib/lottery/double-play';
import mega from '@/lib/lottery/mega';

export const getServerSideProps = async () => {
  const powerballPlays = await kv.get('powerball_plays');
  const megaPlays = await kv.get('mega_plays');

  const powerballWinningNumbers = await powerball.getWinningNumbers();
  const doublePlayWinningNumbers = await doublePlay.getWinningNumbers();
  const megaWinningNumbers = await mega.getWinningNumbers();

  const powerballData = powerballPlays.map((play) => (
    powerball.checkNumbersForPrize(powerballWinningNumbers, play)
  ));
  const doublePlayData = powerballPlays.map((play) => (
    doublePlay.checkNumbersForPrize(doublePlayWinningNumbers, play)
  ));
  const megaData = megaPlays.map((play) => (
    mega.checkNumbersForPrize(megaWinningNumbers, play)
  ));

  return {
    props: {
      powerballData,
      doublePlayData,
      megaData,
    },
  };
};

export default function Lucky({ powerballData, doublePlayData, megaData }) {
  const columns = [
    {
      title: 'Index',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Play',
      dataIndex: 'play',
      key: 'play',
      render: (_, record) => (
        <>
          <Tag color={record.N1.hit ? 'green' : 'default'}>
            {record.N1.number < 10 ? `0${record.N1.number}` : record.N1.number}
          </Tag>
          <Tag color={record.N2.hit ? 'green' : 'default'}>
            {record.N2.number < 10 ? `0${record.N2.number}` : record.N2.number}
          </Tag>
          <Tag color={record.N3.hit ? 'green' : 'default'}>
            {record.N3.number < 10 ? `0${record.N3.number}` : record.N3.number}
          </Tag>
          <Tag color={record.N4.hit ? 'green' : 'default'}>
            {record.N4.number < 10 ? `0${record.N4.number}` : record.N4.number}
          </Tag>
          <Tag color={record.N5.hit ? 'green' : 'default'}>
            {record.N5.number < 10 ? `0${record.N5.number}` : record.N5.number}
          </Tag>
          <Tag color={record.NS.hit ? 'green' : 'red'}>
            {record.NS.number < 10 ? `0${record.NS.number}` : record.NS.number}
          </Tag>
        </>
      ),
    },
    {
      title: 'Multiplier',
      dataIndex: 'multiplier',
      key: 'multiplier',
    },
    {
      title: 'Prize',
      dataIndex: 'prize',
      key: 'prize',
    },
  ];

  return (
    <>
      <Head>
        <title>一夜暴富</title>
        <meta name="description" content="一夜暴富" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Row gutter={2} justify="space-around">
          <Col span={11}>
            <Divider orientation="left">Powerball</Divider>
            <Table dataSource={powerballData} columns={columns} pagination={false} />
          </Col>
          <Col span={11}>
            <Divider orientation="left">Double Play</Divider>
            <Table dataSource={doublePlayData} columns={columns} pagination={false} />
          </Col>
        </Row>
        <Row gutter={2} justify="space-around">
          <Col span={11}>
            <Divider orientation="left">Mega Millions</Divider>
            <Table dataSource={megaData} columns={columns} pagination={false} />
          </Col>
          <Col span={11}>
            <Divider orientation="left">
              <Space>
                <ExclamationCircleOutlined />
                Note
              </Space>
            </Divider>
            <span>Prizes are calculated with latest winning numbers.</span>
          </Col>
        </Row>
      </div>
    </>
  );
}
