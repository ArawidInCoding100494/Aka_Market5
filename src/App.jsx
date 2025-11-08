import { useState } from 'react'
import './App.scss'

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import RootLayOut from './Roots/RootLayOut/RootLayOut'
import TotalBase from './Pages/TotalBase/TotalBase'
import {BrandProvider} from "./Contexts/BrandContext/BrandContext"
import BrandDetails from './Components/BrandDetails/BrandDetails'
import EditProduct from './Components/EditProduct/EditProduct'
import CreateBrand from './Components/CreateBrand/CreateBrand'
import CreateProduct from './Components/CrateProduct/CreateProduct'
import TradeDetail from "./Components/TradeDetail/TradeDetail"
import DailyTrade from "./Pages/DailyTrade/DailyTrade"
import Xisobotlar from './Pages/Xisobotlar/Xisobotlar'
import { SoldProvider } from './Contexts/SoldContex/SoldContex'
import XisobDetail from './Components/XisobDetail/XisobDetail'

function App() {


  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route  element={<RootLayOut/>} >

        <Route path='/' element={<DailyTrade/>} />
        <Route path='/brand/:id/trade' element={<TradeDetail/>} />


        <Route path='/Xisobotlar' element={<Xisobotlar/>} />
        <Route path='/brand/:id/xisob' element={<XisobDetail/>} />

        <Route path='/TotalBase' element={<TotalBase/>} />

        <Route path='/CreateBrand' element={<CreateBrand/>} />
        <Route path='/brand/:id/CreateProduct' element={<CreateProduct/>} />


        <Route path='/brand/:id' element={<BrandDetails/>} />
        <Route path='/brand/:id/edit/:productId' element={<EditProduct/>} />
       

      </Route>
    )
  )

  return (
    <>
    <BrandProvider>
      <SoldProvider>
        <RouterProvider router={routes}/>
      </SoldProvider>
     </BrandProvider>
    </>
  )
}

export default App
