import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { appRouter } from './components/routes/Index.tsx'
import { Provider } from 'react-redux'
import { store } from './components/redux/store/store.ts'

createRoot( document.getElementById( 'root' )! ).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  </StrictMode>,
);