import {
  Modal,
  Input,
  Text,
  Spacer,
  Button,
  Grid,
  useToasts,
} from '@geist-ui/react'
import splitbee from '@splitbee/web'
import { useFormik } from 'formik'
import { format, compareDesc, parseISO } from 'date-fns'
import { useAuth } from 'lib/auth'
import {
  createInfusion,
  InfusionType,
  InfusionTypeEnum,
  InfusionTypeOptions,
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
  type: InfusionTypeOptions
  units: string
  uid?: string | null
}

interface ModalProps {
  visible: boolean
  setVisible: (flag: boolean) => void
  bindings: any
  infusion?: InfusionType
}

export default function InfusionModal(props: ModalProps): JSX.Element {
  const { visible, setVisible, bindings, infusion } = props
  const { user } = useAuth()
  const [, setToast] = useToasts()
  const { data: infusions } = useInfusions()

  // TODO(michael) limit the firebase call instead of having
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

  const handleUpdateInfusion = async (infusion: InfusionValues) => {
    const infusionUser: AttachedUserType = {
      email: user!.email,
      name: user!.name,
      photoUrl: user!.photoUrl,
      uid: user!.uid,
    }

    const { uid, date, brand, lot, units, cause, sites, type } = infusion
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

    uid
      ? updateInfusion(uid, payload)
          .then(() => {
            setToast({
              text: 'Infusion updated!',
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
          text: `Infusion database entry not found`,
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
      date: displayInfusion
        ? displayInfusion.date
        : format(new Date(), 'yyyy-MM-dd'),
      lot: displayInfusion ? displayInfusion.medication.lot : '',
      sites: displayInfusion ? displayInfusion.sites : '',
      type: displayInfusion
        ? displayInfusion.type
        : (InfusionTypeEnum.PROPHY as InfusionTypeOptions),
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
    splitbee.track('Logged Treatment')
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
                  formik.setFieldValue('type', InfusionTypeEnum.PROPHY)
                }
                style={{ marginRight: '8px' }}
                type={
                  formik.values.type === InfusionTypeEnum.PROPHY
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
                  formik.setFieldValue('type', InfusionTypeEnum.BLEED)
                }
                style={{ marginRight: '8px' }}
                type={
                  formik.values.type === InfusionTypeEnum.BLEED
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
                  formik.setFieldValue('type', InfusionTypeEnum.PREVENTATIVE)
                }
                type={
                  formik.values.type === InfusionTypeEnum.PREVENTATIVE
                    ? 'error-light'
                    : 'default'
                }
              >
                Preventative
              </Button>
            </Grid>
          </Grid.Container>
          <Spacer />
          <Input
            id='date'
            name='date'
            htmlType='date'
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
          <Spacer h={0.8} />
          <Input
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
        Save
      </Modal.Action>
    </Modal>
  )
}
