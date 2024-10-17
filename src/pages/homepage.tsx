import React from 'react';
import Shirtnew from '../components/homepage/Shirtnew';
import Shirtclub from '../components/homepage/Shirtclub';
import Shirtseason from '../components/homepage/Shirtseason';
import Shirtplayer from '../components/homepage/Shirtplayer';

const HomePage: React.FC = () => {
  return (
    <div className='px-60'>

      <Shirtnew />

      <Shirtclub />
      <Shirtseason />
      <Shirtplayer />

    </div>
  );
};

export default HomePage;
