import React, { useState, useEffect } from 'react';
import Main from './src/Screen/Main';
import Splash from './src/Screen/Splash';
import { RootSiblingParent } from 'react-native-root-siblings';

export default function App() {
  const [splash, setSplash] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setSplash(true)
    }, 3000)
  }, [])
  return (
    <RootSiblingParent>
      {
        splash == false ? <Splash /> : <Main />
      }
    </RootSiblingParent>
  )
}