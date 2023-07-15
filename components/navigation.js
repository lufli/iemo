import React from 'react';
import Link from 'next/link';
import { List } from 'antd';

const myApps = [
  {
    title: 'One Submit! No Regret!',
    description: 'Having trouble making decisions? Don\'t worry! We will help you!',
    link: '/decision-maker',
  },
  {
    title: 'Become A Billionaire',
    description: 'Are you a billionaire?',
    link: '/billionaire',
  },
];

export default function Navigation() {
  return (
    <List
      header={<h2>A Collection of Coolest Tools</h2>}
      dataSource={myApps}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={<Link href={item.link}>{item.title}</Link>}
            description={item.description}
          />
        </List.Item>
      )}
    />
  );
}
