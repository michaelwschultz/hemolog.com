import {
  Avatar,
  Link,
  Popover,
  Grid,
  Button,
  useModal,
  Spacer,
  useMediaQuery,
} from '@geist-ui/react'

import { useAuth } from 'lib/auth'
import Logo from 'components/logo'
import InfusionModal from 'components/infusionModal'

interface Props {
  version?: string
}

const Header = (props: Props): JSX.Element => {
  const { version } = props
  const { user, signout } = useAuth()

  const {
    visible: infusionModal,
    setVisible: setInfusionModalVisible,
    bindings: infusionModalBindings,
  } = useModal(false)

  const isMobile = useMediaQuery('xs', { match: 'down' })

  // const [themeType, setThemeType] = useState('dark')
  // const switchThemes = () => {
  //   setThemeType((lastThemeType) =>
  //     lastThemeType === 'dark' ? 'light' : 'dark'
  //   )
  // }

  const popoverContent = () => (
    <div style={{ minWidth: '180px' }}>
      <Popover.Item title>
        <span>{user?.name}</span>
      </Popover.Item>
      <Popover.Item>
        <span>Hemolog v{version}</span>
      </Popover.Item>
      <Popover.Item>
        <Link color href='/changelog'>
          Latest updates
        </Link>
      </Popover.Item>
      <Popover.Item line />
      <Popover.Item>
        <Link color onClick={() => signout()}>
          Sign out
        </Link>
      </Popover.Item>
    </div>
  )

  if (user) {
    return (
      <>
        <Grid.Container justify='space-between' alignItems='center'>
          <Grid>
            <Logo />
          </Grid>
          <Grid>
            <Grid.Container gap={2} alignItems='center'>
              <Grid>
                {!isMobile && (
                  <Button
                    onClick={() => setInfusionModalVisible(true)}
                    auto
                    type='success-light'
                    scale={3 / 4}
                  >
                    New treatment
                  </Button>
                )}
              </Grid>
              <Grid>
                <Popover content={popoverContent} placement='bottomEnd'>
                  <Avatar
                    src={user.photoUrl || '/images/favicon-32x32.png'}
                    text={user.displayName && user.displayName.charAt(0)}
                    style={{ cursor: 'pointer' }}
                    scale={2}
                  />
                </Popover>
              </Grid>
            </Grid.Container>
          </Grid>
        </Grid.Container>

        <Spacer />

        {isMobile && (
          <Button
            onClick={() => setInfusionModalVisible(true)}
            style={{ width: '100%' }}
            type='success-light'
          >
            Log infusion
          </Button>
        )}

        <InfusionModal
          visible={infusionModal}
          setVisible={setInfusionModalVisible}
          bindings={infusionModalBindings}
        />
      </>
    )
  }

  return <></>
}

export default Header
