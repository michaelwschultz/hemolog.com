const LoadingScreen = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500'></div>
      <span className='ml-2'>Loading</span>
    </div>
  )
}

export default LoadingScreen
