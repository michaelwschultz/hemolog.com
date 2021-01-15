import React from 'react'
import { useRouter } from 'next/router'
import {
  Avatar,
  Link,
  Popover,
  Page,
  Row,
  Button,
  useModal,
  Tabs,
  Spacer,
} from '@geist-ui/react'

import { useAuth } from 'lib/auth'
import Logo from 'components/logo'
import InfusionModal from 'components/infusionModal'

export default function Header(): JSX.Element {
  const router = useRouter()
  const { user, signout } = useAuth()

  const changeHandler = (val) => router.push(val)

  const {
    visible: infusionModal,
    setVisible: setInfusionModalVisible,
    bindings: infusionModalBindings,
  } = useModal(false)

  const popoverContent = () => (
    <div style={{ minWidth: '180px' }}>
      <Popover.Item title>
        <span>{user.name}</span>
      </Popover.Item>
      <Popover.Item>
        <span>News and updates will appear here</span>
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
    <Page.Header style={{ paddingTop: '24px' }}>
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
          <Popover
            content={popoverContent}
            // trigger='hover'
            placement='bottomEnd'
          >
            <Avatar
              src={user.photoUrl}
              text={user.displayName && user.displayName.charAt(0)}
              size={40}
            />
          </Popover>
        </Row>
      </Row>
      <Spacer />
      <Tabs value={router.route} onChange={changeHandler}>
        <Tabs.Item label='home' value='/' />
        <Tabs.Item label='profile' value='/profile' />
        <Tabs.Item label='emergency' value={`/emergency/${user.alertId}`} />
        {user && user.isAdmin && (
          <Tabs.Item label='feedback' value='/feedback' />
        )}
      </Tabs>

      <InfusionModal
        visible={infusionModal}
        setVisible={setInfusionModalVisible}
        bindings={infusionModalBindings}
      />
    </Page.Header>
  )
}
