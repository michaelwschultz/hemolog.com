import {
  Modal,
  Input,
  Text,
  Spacer,
  Button,
  Grid,
  useToasts,
} from '@geist-ui/react'
import { useFormik } from 'formik'
import { compareDesc, format, parseISO } from 'date-fns'

import { useAuth } from 'lib/auth'
import { track } from 'lib/helpers'
import {
  createInfusion,
  TreatmentType,
  TreatmentTypeEnum,
  TreatmentTypeOptions,
  updateInfusion,
} from 'lib/db/infusions'
import { AttachedUserType } from 'lib/types/users'
import useInfusions from 'lib/hooks/useInfusions'

interface InfusionValues {
  brand: string
  cause: string
  date: string
  lot?: string
  sites: string
  type: TreatmentTypeOptions
  units: string
  uid?: string | null
}

interface ModalProps {
  visible: boolean
  setVisible: (flag: boolean) => void
  bindings: any
  infusion?: TreatmentType
}

export default function InfusionModal(props: ModalProps): JSX.Element {
  const { visible, setVisible, bindings, infusion } = props
  const { user } = useAuth()
  const [, setToast] = useToasts()
  const { data: infusions } = useInfusions()

  // TODO:(michael) limit the firebase call instead of having
  // to return all the infusions and filtering them here
  infusions &&
    infusions.sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)))

  const previousInfusion = infusions && infusions[0]

  const handleCreateInfusion = async (infusion: InfusionValues) => {
    const infusionUser: AttachedUserType = {
      email: user!.email,
      name: user!.name,
      photoUrl: user!.photoUrl,
      uid: user!.uid,
    }

    // TODO:(michael) should probably move to toLocaleString()
    const { date, brand, lot, units, cause, sites, type } = infusion
    const payload: TreatmentType = {
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
          text: 'Treatment logged! Hope all is well.',
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

  const handleUpdateInfusion = async (infusion: InfusionValues) => {
    const infusionUser: AttachedUserType = {
      email: user!.email,
      name: user!.name,
      photoUrl: user!.photoUrl,
      uid: user!.uid,
    }

    const { uid, date, brand, lot, units, cause, sites, type } = infusion
    const payload: TreatmentType = {
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

    uid
      ? updateInfusion(uid, payload)
          .then(() => {
            setToast({
              text: 'Treatment updated!',
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
      : setToast({
          text: `Treatment database entry not found`,
          type: 'error',
          delay: 10000,
        })
  }

  const closeModal = () => {
    setVisible(false)
    formik.resetForm()
  }

  const displayInfusion = infusion ? infusion : previousInfusion

  // TODO(michael) Add formik validation
  const formik = useFormik({
    initialValues: {
      brand: displayInfusion ? displayInfusion.medication.brand : '',
      cause: displayInfusion ? displayInfusion.cause : '',
      date:
        displayInfusion && infusion
          ? displayInfusion.date
          : format(new Date(), 'yyyy-MM-dd'),
      lot: displayInfusion ? displayInfusion.medication.lot : '',
      sites: displayInfusion ? displayInfusion.sites : '',
      type: displayInfusion
        ? displayInfusion.type
        : (TreatmentTypeEnum.PROPHY as TreatmentTypeOptions),
      units: displayInfusion ? displayInfusion.medication.units.toString() : '',
      uid: displayInfusion ? displayInfusion.uid : null,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (infusion) {
        await handleUpdateInfusion(values)
      } else {
        await handleCreateInfusion(values)
      }
    },
  })

  const handleSubmit = () => {
    track('Logged Infusion', {
      type: formik.values.type,
    })
    formik.submitForm()
  }

  return (
    <Modal open={visible} {...bindings}>
      <Modal.Title>Treatment</Modal.Title>
      <Modal.Content>
        <form onSubmit={formik.handleSubmit}>
          <Grid.Container gap={1}>
            <Grid xs={8}>
              <Button
                width='100%'
                name='type'
                onClick={() =>
                  formik.setFieldValue('type', TreatmentTypeEnum.PROPHY)
                }
                style={{
                  marginRight: '8px',
                  paddingLeft: '4px',
                  paddingRight: '4px',
                }}
                type={
                  formik.values.type === TreatmentTypeEnum.PROPHY
                    ? 'warning-light'
                    : 'default'
                }
              >
                Prophy
              </Button>
            </Grid>
            <Grid xs={8}>
              <Button
                width='100%'
                name='type'
                onClick={() =>
                  formik.setFieldValue('type', TreatmentTypeEnum.BLEED)
                }
                style={{
                  marginRight: '8px',
                  paddingLeft: '4px',
                  paddingRight: '4px',
                }}
                type={
                  formik.values.type === TreatmentTypeEnum.BLEED
                    ? 'success-light'
                    : 'default'
                }
              >
                Bleed
              </Button>
            </Grid>
            <Grid xs={8}>
              <Button
                width='100%'
                name='type'
                onClick={() =>
                  formik.setFieldValue('type', TreatmentTypeEnum.PREVENTATIVE)
                }
                style={{
                  paddingLeft: '4px',
                  paddingRight: '4px',
                }}
                type={
                  formik.values.type === TreatmentTypeEnum.PREVENTATIVE
                    ? 'error-light'
                    : 'default'
                }
              >
                Preventative
              </Button>
            </Grid>
          </Grid.Container>
          {user!.monoclonalAntibody && (
            <Grid.Container gap={1}>
              <Grid xs={24}>
                <Button
                  width='100%'
                  name='type'
                  onClick={() =>
                    formik.setFieldValue('type', TreatmentTypeEnum.ANTIBODY)
                  }
                  style={{
                    paddingLeft: '4px',
                    paddingRight: '4px',
                  }}
                  type={
                    formik.values.type === TreatmentTypeEnum.ANTIBODY
                      ? 'secondary-light'
                      : 'default'
                  }
                >
                  Monoclonal antibody
                </Button>
              </Grid>
            </Grid.Container>
          )}
          <Spacer />
          <Input
            id='date'
            name='date'
            htmlType='date'
            onChange={formik.handleChange}
            placeholder='Date'
            value={formik.values.date}
            width='100%'
            crossOrigin={undefined}
          >
            <Text h6>Date</Text>
          </Input>
          <Spacer />
          <Input
            id='brand'
            name='brand'
            onChange={formik.handleChange}
            placeholder='Brand name'
            disabled={formik.values.type === TreatmentTypeEnum.ANTIBODY}
            crossOrigin={undefined}
            value={
              formik.values.type === TreatmentTypeEnum.ANTIBODY
                ? user!.monoclonalAntibody
                : formik.values.brand
            }
            width='100%'
          >
            <Text h6>Medication</Text>
          </Input>
          <Spacer h={0.8} />
          {formik.values.type !== TreatmentTypeEnum.ANTIBODY && (
            <>
              <Input
                crossOrigin={undefined}
                id='units'
                name='units'
                htmlType='number'
                labelRight='units'
                onChange={formik.handleChange}
                placeholder='3000'
                value={formik.values.units}
                width='100%'
              />
              <Spacer h={0.5} />
              <Input
                crossOrigin={undefined}
                id='lot'
                name='lot'
                onChange={formik.handleChange}
                placeholder='Lot number'
                value={formik.values.lot}
                width='100%'
              />
              <Spacer />
              <Input
                crossOrigin={undefined}
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
                crossOrigin={undefined}
                id='cause'
                name='cause'
                onChange={formik.handleChange}
                placeholder='Ran into a door 🤦‍♂️'
                value={formik.values.cause}
                width='100%'
              >
                <Text h6>Cause of bleed</Text>
              </Input>
            </>
          )}

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
        {infusion ? 'Update Treatment' : 'Log Treatment'}
      </Modal.Action>
    </Modal>
  )
}
