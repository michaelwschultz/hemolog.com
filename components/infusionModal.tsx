import React from 'react'
import { Modal, Input, Text, Spacer, Radio, useToasts } from '@geist-ui/react'
import { useFormik } from 'formik'

import { useAuth } from 'lib/auth'
import {
  createInfusion,
  InfusionType,
  InfusionTypeEnum,
  InfusionTypeOptions,
} from 'lib/db/infusions'
import { AttachedUserType } from 'lib/types/users'

interface InfusionValues {
  type: InfusionTypeOptions
  sites: string
  cause: string
  brand: string
  units: string
  lot: string
}

export default function InfusionModal(props): JSX.Element {
  const { visible, setVisible, bindings } = props
  const { user } = useAuth()
  const [, setToast] = useToasts()

  const handleCreateInfusion = async (infusion: InfusionValues) => {
    const infusionUser: AttachedUserType = {
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
      uid: user.uid,
    }

    const { brand, lot, units, cause, sites, type } = infusion
    const payload: InfusionType = {
      medication: {
        brand,
        lot,
        units: units ? parseInt(units, 10) : 0,
      },
      cause,
      sites,
      type,
      createdAt: new Date().toISOString(),
      user: infusionUser,
    }

    createInfusion(payload)
      .then(() => {
        setToast({
          text: 'Infusion logged! Hope all is well.',
          type: 'success',
          delay: 5000,
        })
        closeModal()
      })
      .catch((error) =>
        setToast({
          text: `Something went wrong: ${error}`,
          type: 'error',
          delay: 10000,
        })
      )
  }

  const closeModal = () => {
    setVisible(false)
    formik.resetForm()
  }

  // TODO: Add formik validation
  const formik = useFormik({
    initialValues: {
      type: InfusionTypeEnum.PROPHY as InfusionTypeOptions,
      sites: '',
      cause: '',
      brand: '',
      units: '',
      lot: '',
    },
    onSubmit: async (values) => {
      await handleCreateInfusion(values)
    },
  })

  return (
    <Modal open={visible} {...bindings}>
      <Modal.Title>Log infusion</Modal.Title>
      <Modal.Content>
        <form onSubmit={formik.handleSubmit}>
          <Radio.Group
            id='type'
            value={formik.values.type}
            onChange={(value) =>
              formik.setFieldValue('type', InfusionTypeEnum[value])
            }
          >
            <Radio value={InfusionTypeEnum.PROPHY}>
              Prophy
              <Radio.Description>
                Part of your regular schedule
              </Radio.Description>
            </Radio>
            <Radio value={InfusionTypeEnum.BLEED}>
              Bleed<Radio.Desc>Stopping an active bleed</Radio.Desc>
            </Radio>
            <Radio value={InfusionTypeEnum.PREVENTATIVE}>
              Preventative<Radio.Desc>Just in case</Radio.Desc>
            </Radio>
          </Radio.Group>
          <Spacer />
          <Text h6>Affected areas</Text>
          <Input
            id='sites'
            name='sites'
            onChange={formik.handleChange}
            placeholder='Left ankle, right knee'
            value={formik.values.sites}
            width='100%'
          />
          <Spacer />
          <Text h6>Cause of bleed</Text>
          <Input
            id='cause'
            name='cause'
            onChange={formik.handleChange}
            placeholder='Ran into a door 🤦‍♂️'
            value={formik.values.cause}
            width='100%'
          />
          <Spacer />
          <Text h6>Medication</Text>
          <Input
            id='brand'
            name='brand'
            onChange={formik.handleChange}
            placeholder='Brand name'
            value={formik.values.brand}
            width='100%'
          />
          <Spacer y={0.5} />
          <Input
            id='units'
            name='units'
            type='number'
            onChange={formik.handleChange}
            placeholder='3000'
            value={formik.values.units}
            width='100%'
          />
          <Spacer y={0.5} />
          <Input
            id='lot'
            name='lot'
            onChange={formik.handleChange}
            placeholder='Lot number'
            value={formik.values.lot}
            width='100%'
          />
          <Spacer />
          {/* <Text h6>Notes</Text>
          <Textarea
            width='100%'
            placeholder='Notes to help you remember anything special about this infusion'
          /> */}
        </form>
      </Modal.Content>
      <Modal.Action passive onClick={() => closeModal()}>
        Cancel
      </Modal.Action>
      <Modal.Action
        onClick={formik.submitForm}
        disabled={!formik.isValid || !formik.dirty}
        loading={formik.isSubmitting}
      >
        Log infusion
      </Modal.Action>
    </Modal>
  )
}
