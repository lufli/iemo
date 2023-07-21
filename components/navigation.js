import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/iemo.svg';

export default function Navigation() {
  return (
    <div id="nav">
      <Link href="/">
        <Image src={logo} id="logo" alt="iemo" />
      </Link>
      <nav />
    </div>
  );
}
