import React from 'react'
import {NavLink} from 'react-router-dom'
import {BsArrowLeft} from 'react-icons/bs'
import MesCommandes from '../components/commandes/MesCommandes';

export  function Order() {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
    <div className='space-y-5 flex flex-col justify-center items-center '>
    
      <MesCommandes />
    </div>
  </div>
  )
}
