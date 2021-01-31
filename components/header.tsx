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

export default function Header(): JSX.Element {
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
      {/* <StyledTabBar borderColor={palette.accents_2}>
        <ul>
          <StyledListItem active={router.route === '/home'}>
            <NextLink href='/home'>Home</NextLink>
          </StyledListItem>
          <StyledListItem active={router.route === '/profile'}>
            <NextLink href='/profile'>Profile</NextLink>
          </StyledListItem>
          <StyledListItem
            active={router.route === `/emergency/${user.alertId}`}
          >
            <NextLink href={`/emergency/${user.alertId}`}>Emergency</NextLink>
          </StyledListItem>
          <StyledListItem active={router.route === '/feedback'}>
            <NextLink href='/feedback'>Feedback</NextLink>
          </StyledListItem>
        </ul>
      </StyledTabBar> */}

      <InfusionModal
        visible={infusionModal}
        setVisible={setInfusionModalVisible}
        bindings={infusionModalBindings}
      />
    </>
  )
}

// const StyledTabBar = styled.div<{ borderColor: string }>`
//   border-bottom: 1px solid ${({ borderColor }) => borderColor || 'black'};
//   width: 100%;

//   ul,
//   li {
//     list-style-type: none;
//     display: inline;
//     margin: 0;
//   }
//   li {
//     padding-right: 24px;
//   }
// `

// const StyledListItem = styled.li<{ active: boolean }>`
//   a {
//     color: black;
//     font-weight: 500;
//     border-bottom: 2px solid ${({ active }) => (active ? 'red' : 'transparent')};
//   }
// `
