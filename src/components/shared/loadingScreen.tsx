const LoadingScreen = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-3 bg-paper'>
      <div className='h-8 w-8 animate-spin rounded-full border-2 border-line border-t-primary-500' />
      <span className='font-mono text-xs tracking-wide text-slate'>
        Loading
      </span>
    </div>
  )
}

export default LoadingScreen
