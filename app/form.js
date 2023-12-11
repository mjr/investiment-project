'use client'

import { useFormState, useFormStatus } from 'react-dom'

import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'

import { action } from './action'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function roundToDecimalPlaces(value, decimalPlaces = 2) {
  const factor = 10 ** decimalPlaces
  return (Math.round(value * factor) / factor).toFixed(decimalPlaces)
}

function calcPercentageAndIncreaseOrDecrease(current, previous) {
  const difference = current - previous
  const percentage = roundToDecimalPlaces((difference / previous) * 100)
  const changeType = difference > 0 ? 'increase' : 'decrease'
  return { percentage, changeType }
}

function Card({ name, current, previous, constant = false }) {
  let { percentage, changeType } = constant ? { percentage: 0, changeType: 'equal' } : calcPercentageAndIncreaseOrDecrease(current, previous)

  return (
    <div className="px-4 py-5 sm:p-6">
      <dt className="text-base font-normal text-gray-900">{name}</dt>
      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
        <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
          {current}
          {constant ? null : (
            <span className="ml-2 text-sm font-medium text-gray-500">de {previous}</span>
          )}
        </div>

        {constant ? null : (
          <div
            className={classNames(
              changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
              'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
            )}
          >
            {changeType === 'increase' ? (
              <ArrowUpIcon
                className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                aria-hidden="true"
              />
            ) : (
              <ArrowDownIcon
                className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
                aria-hidden="true"
              />
            )}

            <span className="sr-only"> {changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
            {percentage}%
          </div>
        )}
      </dd>
    </div>
  )
}

function Alert({ type, title, description }) {
  const containerClass = type === 'success' ? 'bg-green-50' : 'bg-red-50'
  const iconClass = type === 'success' ? 'text-green-400' : 'text-red-400'
  const titleClass = type === 'success' ? 'text-green-800' : 'text-red-800'
  const descriptionClass = type === 'success' ? 'text-green-700' : 'text-red-700'

  return (
    <div className={`mt-4 rounded-md ${containerClass} p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className={`h-5 w-5 ${iconClass}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${titleClass}`}>{title}</h3>
          {description ? (
            <div className={`mt-2 text-sm ${descriptionClass}`}>
              <p>{description}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function Form() {
  const [state, dispatch] = useFormState(action, { message: null, type: undefined })

  return (
    <>
      <form action={dispatch}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Busque uma ação</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Digite o código da ação desejada
            </p>
            {state?.message ? (
              <Alert
                type={state?.message?.type}
                title={state?.message?.title}
                description={state?.message?.description}
              />
            ) : null}
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Ação</label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="name"
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6${state?.type === "error" && state?.errors?.name ? " accent-red-400" : ""}`}
                    placeholder="AAPL"
                    aria-describedby="name-error"
                    defaultValue={state?.data ? state.data.name : ''}
                  />
                </div>
                {state?.type === "error" && state?.errors?.name && (
                  <p className="mt-2 text-sm text-red-600" id="name-error">
                    {state.errors.name.join(",")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <SubmitButton />
        </div>
      </form>
      {state?.data?.stock ? (
        <div>
          <h3 className="text-base font-semibold leading-6 text-gray-900">{state?.data ? state.data.name : ''}</h3>
          <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-4 md:divide-x md:divide-y-0">
            <Card name='Preço atual' current={state?.data?.stock.c} previous={state?.data?.stock.o} />
            <Card name='Maior preço do dia' current={state?.data?.stock.h} previous={state?.data?.stock.o} />
            <Card name='Menor preço do dia' current={state?.data?.stock.l} previous={state?.data?.stock.o} />
            <Card
              name='Preço de fechamento anterior'
              current={state?.data?.stock.pc}
              constant
            />
          </dl>
        </div>
      ) : null}
    </>
  )
}

function SubmitButton() {
  const status = useFormStatus()

  return (
    <button
      type="submit"
      aria-disabled={status.pending}
      onClick={(e) => {
        // prevent multiple submits
        if (status.pending) e.preventDefault()
      }}
      className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${status.pending ? "bg-indigo-300" : "bg-indigo-600"}`}
    >
      {status.pending ? "Buscando..." : "Buscar"}
    </button>
  )
}
