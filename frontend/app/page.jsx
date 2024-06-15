import React from 'react'
import { useGlobalContext } from './Context/store'
import Nav from '@/components/Nav'
import HomeHero from '@/components/homepage/HomeHero'
import CategoryFeed from '@/components/homepage/CategoryFeed'
import ConcertFeed from '@/components/homepage/ConcertFeed'
import Loading from '@/components/Loading'

const Home = () => {

  return (
      <section className="w-full flex-center flex-col h-full pb-20">
          <HomeHero/>
          <CategoryFeed/>
          <ConcertFeed/>
      </section>
  )
}

export default Home