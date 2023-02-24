import { api } from './api'
import handleQueryError from '../../utils/handleQueryError'
import { flatten } from '../../utils/taskUtils.ts'

export const boardApi = api.injectEndpoints({
    endpoints: builder => ({
        fetchSharedView: builder.query({
            query: viewId => `view/share/${viewId}`,
            transformResponse: (response, meta, arg) => {
                return {
                    ...response,
                    tasks: flatten(response.tasks)
                }
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                } catch (err) {
                    handleQueryError({ err, silent: true })
                }
            }
        })
    })
})

export const { useFetchSharedViewQuery } = boardApi
