import {
  Spacer,
  Grid,
  User,
  Divider,
  useClipboard,
  useToasts,
} from '@geist-ui/react'
import { Share } from '@geist-ui/react-icons'

export default function PostFooter({ postId }: { postId: string }) {
  const [, setToast] = useToasts()
  const { copy } = useClipboard()
  const handleCopy = (postId: string) => {
    copy(`https://hemolog.com/changelog#${postId}`)
    setToast({ type: 'success', text: 'Link copied!' })
  }

  return (
    <>
      <Spacer h={2} />
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
            <Share color='#FF062C' onClick={() => handleCopy(postId)} />
          </div>
        </Grid>
      </Grid.Container>
      <Divider />
      <Spacer h={2} />
    </>
  )
}
