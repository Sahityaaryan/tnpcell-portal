import Layout from '@/components/student/Layout'
import Navbar from '@/components/student/Header'
import Head from 'next/head'
import Image from 'next/image'
import { ToastContainer } from 'react-toastify'
import SignIn from '@/components/SignIn'

export default function Home({
  title = 'NIT Patna Placement Portal',
  keywords = '',
  description = '',
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='keywords' content={keywords} />
        <meta name='description' content={description} />
      </Head>
      <div className='overflow-hidden'>
        {/*  Page content */}
        <main className='flex-grow'>
          <ToastContainer
            position='top-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <SignIn />
        </main>
        {/*  Site footer */}
      </div>
    </>
  )
}
