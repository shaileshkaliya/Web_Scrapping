import React from 'react'
import Navbar from './Navbar'
import Hero from './Hero'

function Home({url, setUrl}) {
  return (
    <div>
        <Navbar />
        <Hero url={url} setUrl={setUrl} />

    </div>
  )
}

export default Home