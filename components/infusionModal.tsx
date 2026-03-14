import {
  Modal,
  Input,
  Text,
  Spacer,
  Button,
  Grid,
  useToasts,
  useMediaQuery,
} from '@geist-ui/react'
import { useFormik } from 'formik'
import { compareDesc, format, parseISO } from 'date-fns'
import styled from 'styled-components'

import { useAuth } from 'lib/auth'
import { track } from 'lib/helpers'
import {
  createInfusion,
  type TreatmentType,
  TreatmentTypeEnum,
  type TreatmentTypeOptions,
  updateInfusion,
} from 'lib/db/infusions'
import type { AttachedUserType } from 'lib/types/users'
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
  // biome-ignore lint/suspicious/noExplicitAny: not sure what this should be
  bindings: any
  infusion?: TreatmentType
}

export default function InfusionModal(props: ModalProps): JSX.Element {
  const { visible, setVisible, bindings, infusion } = props
  const { user } = useAuth()
  const [, setToast] = useToasts()
  const { data: infusions } = useInfusions()
  const isPhone = useMediaQuery('xs', { match: 'down' })

  // TODO:(michael) limit the firebase call instead of having
  // to return all the infusions and filtering them here
  infusions?.sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)))

  const previousInfusion = infusions?.[0]

  const handleCreateInfusion = async (infusion: InfusionValues) => {
    const infusionUser: AttachedUserType = {
      email: user?.email || '',
      name: user?.name || '',
      photoUrl: user?.photoUrl || '',
      uid: user?.uid || '',
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
      .catch((error: unknown) =>
        setToast({
          text: `Something went wrong: ${error instanceof Error ? error.message : String(error)}`,
          type: 'error',
          delay: 10000,
        })
      )
  }

  const handleUpdateInfusion = async (infusion: InfusionValues) => {
    const infusionUser: AttachedUserType = {
      email: user?.email || '',
      name: user?.name || '',
      photoUrl: user?.photoUrl || '',
      uid: user?.uid || '',
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
    <Modal
      open={visible}
      {...bindings}
      style={{ width: isPhone ? 'calc(100vw - 16px)' : 'min(620px, 94vw)' }}
    >
      <Modal.Title>
        {infusion ? 'Update treatment' : 'Log new treatment'}
      </Modal.Title>
      <StyledModalDescription small type='secondary'>
        Save your treatment details so stats stay accurate and easy to review.
      </StyledModalDescription>
      <Modal.Content>
        <StyledForm onSubmit={formik.handleSubmit}>
          <StyledSection>
            <Text h6 style={{ margin: 0 }}>
              Treatment type
            </Text>
            <Spacer h={0.3} />
            <Grid.Container gap={0.8}>
              <Grid xs={12} sm={8}>
                <Button
                  width='100%'
                  name='type'
                  onClick={() =>
                    formik.setFieldValue('type', TreatmentTypeEnum.PROPHY)
                  }
                  style={TREATMENT_BUTTON_STYLE}
                  type={
                    formik.values.type === TreatmentTypeEnum.PROPHY
                      ? 'warning-light'
                      : 'default'
                  }
                >
                  Prophy
                </Button>
              </Grid>
              <Grid xs={12} sm={8}>
                <Button
                  width='100%'
                  name='type'
                  onClick={() =>
                    formik.setFieldValue('type', TreatmentTypeEnum.BLEED)
                  }
                  style={TREATMENT_BUTTON_STYLE}
                  type={
                    formik.values.type === TreatmentTypeEnum.BLEED
                      ? 'success-light'
                      : 'default'
                  }
                >
                  Bleed
                </Button>
              </Grid>
              <Grid xs={24} sm={8}>
                <Button
                  width='100%'
                  name='type'
                  onClick={() =>
                    formik.setFieldValue('type', TreatmentTypeEnum.PREVENTATIVE)
                  }
                  style={TREATMENT_BUTTON_STYLE}
                  type={
                    formik.values.type === TreatmentTypeEnum.PREVENTATIVE
                      ? 'error-light'
                      : 'default'
                  }
                >
                  Preventative
                </Button>
              </Grid>
              {user?.monoclonalAntibody && (
                <Grid xs={24}>
                  <Button
                    width='100%'
                    name='type'
                    onClick={() =>
                      formik.setFieldValue('type', TreatmentTypeEnum.ANTIBODY)
                    }
                    style={TREATMENT_BUTTON_STYLE}
                    type={
                      formik.values.type === TreatmentTypeEnum.ANTIBODY
                        ? 'secondary-light'
                        : 'default'
                    }
                  >
                    Monoclonal antibody
                  </Button>
                </Grid>
              )}
            </Grid.Container>
          </StyledSection>

          <StyledSection>
            <Text h6 style={{ margin: 0 }}>
              Medication details
            </Text>
            <Spacer h={0.3} />
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
                  ? user?.monoclonalAntibody || ''
                  : formik.values.brand
              }
              width='100%'
            >
              <Text h6>Medication</Text>
            </Input>
            {formik.values.type !== TreatmentTypeEnum.ANTIBODY && (
              <>
                <Spacer />
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
                >
                  <Text h6>Amount</Text>
                </Input>
                <Spacer />
                <Input
                  crossOrigin={undefined}
                  id='lot'
                  name='lot'
                  onChange={formik.handleChange}
                  placeholder='Lot number'
                  value={formik.values.lot}
                  width='100%'
                >
                  <Text h6>Lot</Text>
                </Input>
              </>
            )}
          </StyledSection>

          {formik.values.type !== TreatmentTypeEnum.ANTIBODY && (
            <StyledSection>
              <Text h6 style={{ margin: 0 }}>
                Bleed notes
              </Text>
              <Spacer h={0.3} />
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
                placeholder='Ran into a door'
                value={formik.values.cause}
                width='100%'
              >
                <Text h6>Cause of bleed</Text>
              </Input>
            </StyledSection>
          )}

          {/* <Text h6>Notes</Text>
          <Textarea
            width='100%'
            placeholder='Notes to help you remember anything special about this infusion'
          /> */}
        </StyledForm>
      </Modal.Content>
      <Modal.Action passive onClick={() => closeModal()}>
        Cancel
      </Modal.Action>
      <Modal.Action
        onClick={handleSubmit}
        disabled={!formik.isValid}
        loading={formik.isSubmitting}
        style={isPhone ? { fontWeight: 600 } : undefined}
      >
        {infusion ? 'Update Treatment' : 'Log Treatment'}
      </Modal.Action>
    </Modal>
  )
}

const TREATMENT_BUTTON_STYLE = {
  minHeight: '42px',
  paddingLeft: '6px',
  paddingRight: '6px',
}

const StyledModalDescription = styled(Text)`
  margin-top: -8px;
  text-align: center;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const StyledSection = styled.section`
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  padding: 14px;
`
