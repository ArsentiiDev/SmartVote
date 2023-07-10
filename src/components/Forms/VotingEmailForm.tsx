import * as React from 'react';
import {
    Body,
    Button,
    Container,
    Heading,
    Head,
    Html,
    Preview,
    Tailwind,
  } from '@react-email/components';
import { IObject } from '@/Types/Interfaces';

type emailProps =  {
    url: string,
}

 const Email:React.FC<emailProps> = ({url}) => {

  return (
    <Html>
      <Head />
      <Preview>Participate in Voting</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px] flex flex-col gap-2">
            <Heading>You invited to participate in Voting</Heading>
            <Button className=' bg-main-primary px-6 py-2 text-main-primary font-semibold' href={url}>Open the link to vote</Button>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default Email
