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
import styled from 'styled-components'

import { useAuth } from 'lib/auth'
import Logo from 'components/logo'
import InfusionModal from 'components/infusionModal'

interface Props {
  version?: string
}

const Header = (props: Props): JSX.Element | null => {
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

  if (user) {
    const avatarInitial =
      user.name?.charAt(0) ||
      user.displayName?.charAt(0) ||
      user.email?.charAt(0) ||
      '?'

    const popoverContent = (
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
          <Link color onClick={() => void signout?.()}>
            Sign out
          </Link>
        </Popover.Item>
      </div>
    )

    return (
      <>
        <StyledHeaderCard>
          <Grid.Container justify='space-between' alignItems='center'>
            <Grid>
              <Logo />
            </Grid>
            <Grid>
              <Grid.Container gap={1.5} alignItems='center'>
                <Grid>
                  {!isMobile && (
                    <Button
                      onClick={() => setInfusionModalVisible(true)}
                      auto
                      type='success-light'
                      scale={3 / 4}
                      style={{ fontWeight: 600 }}
                    >
                      New treatment
                    </Button>
                  )}
                </Grid>
                <Grid>
                  {/* @ts-expect-error - Popover content prop has a type conflict with HTML content attribute */}
                  <Popover content={popoverContent} placement='bottomEnd'>
                    <Avatar
                      src={user.photoUrl || '/images/favicon-32x32.png'}
                      text={avatarInitial}
                      style={{ cursor: 'pointer' }}
                      scale={2}
                    />
                  </Popover>
                </Grid>
              </Grid.Container>
            </Grid>
          </Grid.Container>
        </StyledHeaderCard>

        <Spacer h={0.9} />

        {isMobile && (
          <Button
            onClick={() => setInfusionModalVisible(true)}
            style={{ width: '100%', fontWeight: 600 }}
            type='success-light'
          >
            New treatment
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

  return null
}

export default Header

const StyledHeaderCard = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  padding: 14px 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fff8fb 100%);
`
