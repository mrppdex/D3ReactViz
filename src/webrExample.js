import React, { useRef, useEffect } from 'react';
import { WebR } from 'webr';


const WebROut = () => {
  const ref = useRef();

  useEffect(() => {

    const fetchData = async () => {
      const webR = new WebR();
      await webR.init();

      let result = await webR.evalR('rnorm(10, 5, 1)');
      let output = await result.toArray();
  
      console.log(output);
    };

    fetchData();

  }, []);

  return <div ref={ ref }></div>;
}

export default WebROut;