import React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

type Props = {
    url:string
}

export function Email(props:Props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Click me</Button>
    </Html>
  );
}

export default Email;