import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'

export default function ProtectedRoute() {
  
   let { token, loading } = useSelector(store=>store.user)

   if(loading){
      return null
   }

   if(!token){
      return <Navigate to={'/sign-in'} replace/>
   }

   return <Outlet/>
}
