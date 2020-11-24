import React from 'react'
import { Modal, Input, Text, Spacer, Radio } from '@geist-ui/react'
// import { useUser } from 'utils/auth/useUser'

export default function InfusionModal(props): JSX.Element {
  const { visible, setVisible, bindings } = props
  // const { user } = useUser()
  // TODO: implement formik to handle form input and validate against user before submitting

  return (
    <Modal open={visible} {...bindings}>
      <Modal.Title>Log infusion</Modal.Title>
      <Modal.Content>
        <form>
          <Radio.Group value='prophy' onChange={(val) => console.log(val)}>
            <Radio value='prophy'>
              Prophy
              <Radio.Description>
                Part of your regular schedule
              </Radio.Description>
            </Radio>
            <Radio value='bleed'>
              Bleed<Radio.Desc>Stopping an active bleed</Radio.Desc>
            </Radio>
            <Radio value='peventitive'>
              Preventitive<Radio.Desc>Just in case</Radio.Desc>
            </Radio>
          </Radio.Group>
          <Spacer />
          <Text h6>Affected areas</Text>
          <Input width='100%' placeholder='Left ankle, right knee' />
          <Spacer />
          <Text h6>Cause of bleed</Text>
          <Input width='100%' placeholder='Ran into a door 🤦‍♂️' />
          <Spacer />
          <Text h6>Medication</Text>
          <Input width='100%' placeholder='Brand name' />
          <Spacer y={0.5} />
          <Input width='100%' placeholder='3000' />
          <Spacer y={0.5} />
          <Input width='100%' placeholder='Lot number' />
          <Spacer />
          {/* <Text h6>Notes</Text>
          <Textarea
            width='100%'
            placeholder='Notes to help you remember anything special about this infusion'
          /> */}
        </form>
      </Modal.Content>
      <Modal.Action passive onClick={() => setVisible(false)}>
        Cancel
      </Modal.Action>
      <Modal.Action onClick={() => alert("This doesn't do anything yet")}>
        Log infusion
      </Modal.Action>
    </Modal>
  )
}
