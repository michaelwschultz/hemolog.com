import React from 'react'
import {
  Divider,
  Spacer,
  Grid,
  User,
  useToasts,
  useClipboard,
} from '@geist-ui/react'
import Share from '@geist-ui/react-icons/share'

const BlogPostFooter = ({ postSlug }: { postSlug: string }) => {
  const [, setToast] = useToasts()
  const { copy } = useClipboard()
  const handleCopy = (postSlug: string) => {
    copy(`https://hemolog.com/changelog/${postSlug}`)
    setToast({ type: 'success', text: 'Link copied!' })
  }
  return (
    <>
      <Spacer y={2} />
      <Grid.Container gap={2} alignItems='center'>
        <Grid xs={22}>
          <User src='/images/michael-avatar.jpg' name='Michael Schultz'>
            <User.Link href='https://twitter.com/michaelschultz'>
              @michaelschultz
            </User.Link>
          </User>
        </Grid>
        <Grid xs={2}>
          <div style={{ cursor: 'pointer' }}>
            <Share color='#FF062C' onClick={() => handleCopy(postSlug)} />
          </div>
        </Grid>
      </Grid.Container>
      <Divider />
      <Spacer y={2} />
    </>
  )
}

export default BlogPostFooter
