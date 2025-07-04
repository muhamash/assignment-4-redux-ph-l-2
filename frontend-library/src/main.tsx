import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'sonner'
import { persistor } from './components/redux/store/store'
import { store } from './components/redux/store/store.ts'
import { appRouter } from './components/routes/Index.tsx'
import './index.css'

createRoot( document.getElementById( 'root' )! ).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
      <RouterProvider router={appRouter} />
      <Toaster position="top-center" richColors />
      </PersistGate>
    </Provider>
  </StrictMode>,
);