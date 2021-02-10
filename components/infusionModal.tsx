import React from 'react'
import {
  Modal,
  Input,
  Text,
  Spacer,
  Button,
  Row,
  useToasts,
} from '@geist-ui/react'
import splitbee from '@splitbee/web'
import { useFormik } from 'formik'
import { format, compareDesc, parseISO } from 'date-fns'

import { UserType } from 'lib/types/users'
import { useAuth } from 'lib/auth'
import {
  createInfusion,
  InfusionType,
  InfusionTypeEnum,
  InfusionTypeOptions,
} from 'lib/db/infusions'
import { AttachedUserType } from 'lib/types/users'
import useInfusions from 'lib/hooks/useInfusions'

interface InfusionValues {
  brand: string
  cause: string
  date: string
  lot: string
  sites: string
  type: InfusionTypeOptions
  units: string
}

export default function InfusionModal(props): JSX.Element {
  const { visible, setVisible, bindings } = props
  const { user }: { user: UserType } = useAuth()
  const [, setToast] = useToasts()
  const { data: infusions } = useInfusions()

  // TODO(michael) limit the firebase call instead of having
  // to return all the infusions and filtering them here
  infusions &&
    infusions.sort((a, b) =>
      compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
    )

  const previousInfusion = infusions && infusions[0]

  const handleCreateInfusion = async (infusion: InfusionValues) => {
    const infusionUser: AttachedUserType = {
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
      uid: user.uid,
    }

    const { date, brand, lot, units, cause, sites, type } = infusion
    const payload: InfusionType = {
      cause,
      createdAt: new Date().toISOString(),
      deletedAt: null,
      date,
      medication: {
        brand,
        lot,
        units: units ? parseInt(units, 10) : 0,
      },
      sites,
      type,
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

  // TODO(michael) Add formik validation
  const formik = useFormik({
    initialValues: {
      brand: previousInfusion ? previousInfusion.medication.brand : '',
      cause: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      lot: previousInfusion ? previousInfusion.medication.lot : '',
      sites: '',
      type: InfusionTypeEnum.PROPHY as InfusionTypeOptions,
      units: previousInfusion
        ? previousInfusion.medication.units.toString()
        : '',
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      await handleCreateInfusion(values)
    },
  })

  const handleSubmit = () => {
    splitbee.track('Log treatment')
    formik.submitForm()
  }

  return (
    <Modal open={visible} {...bindings}>
      <Modal.Title>Log infusion</Modal.Title>
      <Modal.Content>
        <form onSubmit={formik.handleSubmit}>
          <Row justify='space-between'>
            <Button
              auto
              name='type'
              onClick={() =>
                formik.setFieldValue('type', InfusionTypeEnum.PROPHY)
              }
              style={{ width: '100%', marginRight: '8px' }}
              type={
                formik.values.type === InfusionTypeEnum.PROPHY
                  ? 'warning-light'
                  : 'default'
              }
            >
              Prophy
            </Button>
            <Button
              auto
              name='type'
              onClick={() =>
                formik.setFieldValue('type', InfusionTypeEnum.BLEED)
              }
              style={{ width: '100%', marginRight: '8px' }}
              type={
                formik.values.type === InfusionTypeEnum.BLEED
                  ? 'success-light'
                  : 'default'
              }
            >
              Bleed
            </Button>
            <Button
              auto
              name='type'
              onClick={() =>
                formik.setFieldValue('type', InfusionTypeEnum.PREVENTATIVE)
              }
              style={{ width: '100%' }}
              type={
                formik.values.type === InfusionTypeEnum.PREVENTATIVE
                  ? 'error-light'
                  : 'default'
              }
            >
              Preventative
            </Button>
          </Row>
          <Spacer />
          <Input
            id='date'
            name='date'
            type='date'
            onChange={formik.handleChange}
            placeholder='Date'
            value={formik.values.date}
            width='100%'
          >
            <Text h6>Date</Text>
          </Input>
          <Spacer />
          <Input
            id='brand'
            name='brand'
            onChange={formik.handleChange}
            placeholder='Brand name'
            value={formik.values.brand}
            width='100%'
          >
            <Text h6>Medication</Text>
          </Input>
          <Spacer y={0.5} />
          <Input
            id='units'
            name='units'
            type='number'
            labelRight='units'
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
          <Input
            id='sites'
            name='sites'
            onChange={formik.handleChange}
            placeholder='Left ankle, right knee'
            value={formik.values.sites}
            width='100%'
          >
            <Text h6>Affected areas</Text>
          </Input>
          <Spacer />
          <Input
            id='cause'
            name='cause'
            onChange={formik.handleChange}
            placeholder='Ran into a door 🤦‍♂️'
            value={formik.values.cause}
            width='100%'
          >
            <Text h6>Cause of bleed</Text>
          </Input>

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
        onClick={handleSubmit}
        disabled={!formik.isValid}
        loading={formik.isSubmitting}
      >
        Log infusion
      </Modal.Action>
    </Modal>
  )
}
