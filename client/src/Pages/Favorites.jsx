import React from 'react'
import {BsArrowLeft} from 'react-icons/bs'
import {NavLink} from 'react-router-dom'
import FavorisList from '../components/instrumentsList/FavorisList'
import FavoriteItemsLocal from '../components/instrumentsList/FavorisList'
export  function Favorites() {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className='space-y-5 flex flex-col justify-center items-center '>
        <FavoriteItemsLocal />
        
      </div>
    </div>
  )
}
