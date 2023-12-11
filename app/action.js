'use server'

import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(2, { message: 'A ação deve ter pelo menos 2 caracteres.' }),
})

const finnhubApiKey = process.env.FINNHUB_API_KEY
const finnhubBaseUrl = 'https://finnhub.io/api/v1'

const fetchStockData = async (symbol) => {
  try {
    const response = await fetch(`${finnhubBaseUrl}/quote?symbol=${symbol}&token=${finnhubApiKey}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching stock data:', error)
    throw error
  }
}

export async function action(_, payload) {
  const data = Object.fromEntries(payload.entries())
  const result = formSchema.safeParse(data)

  if (result.success) {
    const stock = await fetchStockData(result.data.name)
    if (stock.d === null) {
      return {
        type: 'error',
        data: { name: data.name },
        message: {
          type: 'error',
          title: 'Ação não encontrada.',
          description: 'Verifique se o código da ação está correto.',
        }
      }
    }

    return {
      type: 'success',
      data: { name: data.name, stock },
      message: {
        type: 'success',
        title: 'Ação encontrada com sucesso!',
      }
    }
  }

  return {
    type: 'error',
    data: { name: data.name },
    message: {
      type: 'error',
      title: 'Um erro inesperado ocorreu.',
      description: 'Recebemos o erro e estamos trabalhando para corrigi-lo.',
    },
    errors: result.error.flatten().fieldErrors,
  }
}
