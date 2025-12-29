import { format } from 'date-fns'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/auth'
import {
  type TreatmentType,
  TreatmentTypeEnum,
  type TreatmentTypeOptions,
} from '@/lib/db/infusions'
import { track } from '@/lib/helpers'
import { useInfusionMutations } from '@/lib/hooks/useInfusionMutations'
import { useInfusionsQuery } from '@/lib/hooks/useInfusionsQuery'
import type { AttachedUserType } from '@/lib/types/users'

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

interface InfusionModalProps {
  visible: boolean
  setVisible: (flag: boolean) => void
  // biome-ignore lint/suspicious/noExplicitAny: not sure what this should be
  bindings: any
  infusion?: TreatmentType
}

export default function InfusionModal(props: InfusionModalProps): JSX.Element {
  const { visible, setVisible, infusion } = props
  const { user } = useAuth()
  const { data: infusions } = useInfusionsQuery()
  const { createInfusion, updateInfusion } = useInfusionMutations({
    onCreateSuccess: () => closeModal(),
    onUpdateSuccess: () => closeModal(),
  })

  // Infusions are already sorted by the query hook (newest first)
  const previousInfusion = infusions?.[0]

  const handleCreateInfusion = async (infusionValues: InfusionValues) => {
    const infusionUser: AttachedUserType = {
      email: user?.email || '',
      name: user?.name || '',
      photoUrl: user?.photoUrl || '',
      uid: user?.uid || '',
    }

    // TODO:(michael) should probably move to toLocaleString()
    const { date, brand, lot, units, cause, sites, type } = infusionValues
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
  }

  const handleUpdateInfusion = async (infusionValues: InfusionValues) => {
    const infusionUser: AttachedUserType = {
      email: user?.email || '',
      name: user?.name || '',
      photoUrl: user?.photoUrl || '',
      uid: user?.uid || '',
    }

    const { uid, date, brand, lot, units, cause, sites, type } = infusionValues
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

    if (uid) {
      updateInfusion({ uid, userUid: user?.uid || '', data: payload })
    } else {
      toast.error('Treatment database entry not found')
    }
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
    <>
      {visible && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>Treatment</h3>

              <form onSubmit={formik.handleSubmit} className='space-y-4'>
                {/* Treatment Type Buttons */}
                <div className='grid grid-cols-3 gap-2'>
                  <button
                    type='button'
                    onClick={() =>
                      formik.setFieldValue('type', TreatmentTypeEnum.PROPHY)
                    }
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formik.values.type === TreatmentTypeEnum.PROPHY
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Prophy
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      formik.setFieldValue('type', TreatmentTypeEnum.BLEED)
                    }
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formik.values.type === TreatmentTypeEnum.BLEED
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Bleed
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      formik.setFieldValue(
                        'type',
                        TreatmentTypeEnum.PREVENTATIVE
                      )
                    }
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formik.values.type === TreatmentTypeEnum.PREVENTATIVE
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Preventative
                  </button>
                </div>

                {user?.monoclonalAntibody && (
                  <button
                    type='button'
                    onClick={() =>
                      formik.setFieldValue('type', TreatmentTypeEnum.ANTIBODY)
                    }
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formik.values.type === TreatmentTypeEnum.ANTIBODY
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Monoclonal antibody
                  </button>
                )}

                {/* Date Input */}
                <div>
                  <label
                    htmlFor='date'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Date
                  </label>
                  <input
                    id='date'
                    name='date'
                    type='date'
                    onChange={formik.handleChange}
                    value={formik.values.date}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                  />
                </div>

                {/* Medication Input */}
                <div>
                  <label
                    htmlFor='brand'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Medication
                  </label>
                  <input
                    id='brand'
                    name='brand'
                    type='text'
                    onChange={formik.handleChange}
                    placeholder='Brand name'
                    disabled={formik.values.type === TreatmentTypeEnum.ANTIBODY}
                    value={
                      formik.values.type === TreatmentTypeEnum.ANTIBODY
                        ? user?.monoclonalAntibody || ''
                        : formik.values.brand
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
                  />
                </div>

                {formik.values.type !== TreatmentTypeEnum.ANTIBODY && (
                  <>
                    {/* Units Input */}
                    <div>
                      <label
                        htmlFor='units'
                        className='block text-sm font-medium text-gray-700 mb-1'
                      >
                        Units
                      </label>
                      <div className='relative'>
                        <input
                          id='units'
                          name='units'
                          type='number'
                          onChange={formik.handleChange}
                          placeholder='3000'
                          value={formik.values.units}
                          className='w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                        />
                        <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500'>
                          units
                        </span>
                      </div>
                    </div>

                    {/* Lot Number Input */}
                    <div>
                      <label
                        htmlFor='lot'
                        className='block text-sm font-medium text-gray-700 mb-1'
                      >
                        Lot Number
                      </label>
                      <input
                        id='lot'
                        name='lot'
                        type='text'
                        onChange={formik.handleChange}
                        placeholder='Lot number'
                        value={formik.values.lot}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      />
                    </div>

                    {/* Affected Areas Input */}
                    <div>
                      <label
                        htmlFor='sites'
                        className='block text-sm font-medium text-gray-700 mb-1'
                      >
                        Affected Areas
                      </label>
                      <input
                        id='sites'
                        name='sites'
                        type='text'
                        onChange={formik.handleChange}
                        placeholder='Left ankle, right knee'
                        value={formik.values.sites}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      />
                    </div>

                    {/* Cause Input */}
                    <div>
                      <label
                        htmlFor='cause'
                        className='block text-sm font-medium text-gray-700 mb-1'
                      >
                        Cause of Bleed
                      </label>
                      <input
                        id='cause'
                        name='cause'
                        type='text'
                        onChange={formik.handleChange}
                        placeholder='Ran into a door 🤦‍♂️'
                        value={formik.values.cause}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                      />
                    </div>
                  </>
                )}
              </form>
            </div>

            {/* Modal Actions */}
            <div className='flex justify-end gap-3 p-6 border-t border-gray-200'>
              <button
                type='button'
                onClick={() => closeModal()}
                className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleSubmit}
                disabled={!formik.isValid || formik.isSubmitting}
                className='px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2'
              >
                {formik.isSubmitting && (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                )}
                {infusion ? 'Update Treatment' : 'Log Treatment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
