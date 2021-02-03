import React from 'react'
import {
  Avatar,
  Link,
  Popover,
  Row,
  Button,
  useModal,
  Spacer,
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

  // const [themeType, setThemeType] = useState('dark')
  // const switchThemes = () => {
  //   setThemeType((lastThemeType) =>
  //     lastThemeType === 'dark' ? 'light' : 'dark'
  //   )
  // }

  const popoverContent = () => (
    <div style={{ minWidth: '180px' }}>
      <Popover.Item title>
        <span>{user.name}</span>
      </Popover.Item>
      <Popover.Item>
        <span>Hemolog v{version}</span>
      </Popover.Item>
      <Popover.Item>
        <Link color href='https://github.com/michaelwschultz/hemolog.com'>
          View source code
        </Link>
      </Popover.Item>
      <Popover.Item line />
      <Popover.Item>
        <Link color onClick={() => signout()}>
          Log out
        </Link>
      </Popover.Item>
    </div>
  )

  return (
    <>
      <Row justify='space-between' align='middle'>
        <Logo />
        <Row>
          <Button
            onClick={() => setInfusionModalVisible(true)}
            auto
            type='success-light'
          >
            Log infusion
          </Button>
          <Spacer />
          <Popover content={popoverContent} placement='bottomEnd'>
            <Avatar
              src={user.photoUrl || ''}
              text={user.displayName && user.displayName.charAt(0)}
              size={40}
              style={{ cursor: 'pointer' }}
            />
          </Popover>
        </Row>
      </Row>
      <Spacer />

      <InfusionModal
        visible={infusionModal}
        setVisible={setInfusionModalVisible}
        bindings={infusionModalBindings}
      />
    </>
  )
}

export default Header
