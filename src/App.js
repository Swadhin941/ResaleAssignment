import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Main from "./Components/Layount/Main";
import Home from "./Components/Home/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import "./App.css";
import AddCar from "./Components/AddCar/AddCar/AddCar";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute/PrivateRoute";
import { Toaster } from "react-hot-toast";
import SpecificBrand from "./Components/Brand/SpecificBrand/SpecificBrand";
import { useContext } from "react";
import { SharedData } from "./Components/SharedData/SharedContext";
import DetailsPage from "./Components/DetailsPage/DetailsPage";
import Forbidden from "./Components/PageError/Forbidden/Forbidden";
import MyOrder from "./Components/MyOrder/MyOrder";
import MyProducts from "./Components/MyProducts/MyProducts";
import AdminLayout from "./Components/Layount/AdminLayout";
import AllBuyer from "./Components/AdminRoute/AllBuyer/AllBuyer";
import AllSeller from "./Components/AdminRoute/AllSeller/AllSeller";
import PageNotFound from "./Components/PageError/PageNotFound/PageNotFound";
import ErrorPage from "./Components/ErrorPage/ErrorPage";
import SellerRoute from "./Components/PrivateRoute/SellerRoute/SellerRoute";
import AllAdmin from "./Components/AdminRoute/AllAdmin/AllAdmin";
import AdminRoute from "./Components/PrivateRoute/AdminRoute/AdminRoute";
import Payment from "./Components/Payment/Payment";
import Blog from "./Components/Blog/Blog";
// import Payment from "./Components/Payment/Payment/Payment";

function App() {
  const { logout, setLoading } = useContext(SharedData);
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage></ErrorPage>,
      element: <Main></Main>,
      children: [
        {
          path: "/",
          element: <Home></Home>
        },
        {
          path: "/addCar",
          element: <SellerRoute><AddCar></AddCar></SellerRoute>
        },
        {
          path: '/login',
          element: <Login></Login>
        },
        {
          path: "/register",
          element: <Register></Register>
        },
        {
          path: "/allCategories/:brandName",
          loader: ({ params }) => {
            return fetch(`https://carresaleserver.vercel.app/allCategories/${params.brandName}`, {
              headers: {
                authorization: `bearer ${localStorage.getItem('token')}`
              }
            })
              .then(res => {
                if (res.status === 401) {
                  logout()
                  setLoading(false);
                }
                return res.json();
              })
          },
          element: <PrivateRoute><SpecificBrand></SpecificBrand></PrivateRoute>
        },
        {
          path: 'details/:id',
          loader: ({ params }) => {
            return fetch(`https://carresaleserver.vercel.app/details/${params.id}`, {
              headers: {
                authorization: `bearer ${localStorage.getItem('token')}`
              }
            })
              .then(res => {
                if (res.status === 401) {
                  logout()
                  setLoading(false);
                }
                if(res.status=== 404){
                  window.location.href="/404"
                }
                return res.json();
              })
          },
          element: <PrivateRoute><DetailsPage></DetailsPage></PrivateRoute>
        },
        {
          path:"/my-order",
          element: <PrivateRoute> <MyOrder></MyOrder></PrivateRoute>
        },
        {
          path: "/my-products",
          element: <PrivateRoute><MyProducts></MyProducts></PrivateRoute>
        },
        {
          path:"/payment/:id",
          loader:({params})=>{
            return fetch(`https://carresaleserver.vercel.app/bookingDetails/${params.id}`,{
              method:"GET",
              headers:{
                authorization: `bearer ${localStorage.getItem('token')}`
              }
            })
            .then(res=>{
              if(res.status===401){
                logout()
                setLoading(false);
              }
              return res.json();
            })
          },
          element:<PrivateRoute><Payment></Payment></PrivateRoute>
        },
        {
          path: "/blog",
          element: <Blog></Blog>
        }
      ]
    },
    {
      path:"/forbidden",
      element: <Forbidden></Forbidden>
    },
    {
      path: "/dashboard",
      element: <AdminRoute><AdminLayout></AdminLayout></AdminRoute>, 
      children:[
        {
          path: "/dashboard",
          element: <AdminRoute><AllBuyer></AllBuyer></AdminRoute>
        },
        {
          path:"/dashboard/allSeller",
          element: <AdminRoute><AllSeller></AllSeller></AdminRoute>
        },
        {
          path: "/dashboard/allAdmin",
          element: <AdminRoute><AllAdmin></AllAdmin></AdminRoute>
        }
      ]
    },
    {
      path: "*",
      element: <PageNotFound></PageNotFound>
    }
  ])
  return (
    <div className="marginContent">
      <RouterProvider router={router}>

      </RouterProvider>
      <Toaster />
    </div>
  );
}

export default App;
