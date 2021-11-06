import { Router } from 'itty-router'

export class DurableObject {
	constructor(state, env) {
		this.state = state

		this.router = Router()
		// find
		this.router.get('/:path', async (request) => {
			const { query } = request
			const res = await this.state.storage.list()
			return Array.from(res.values()) //.filter(sift(query))
		})
		// get
		this.router.get('/:path/:id', async (request) => {
			return await this.state.storage.get(request.params.id)
		})
		// create
		this.router.post('/:path', async (request) => {
			const data = await request.json()
			await this.state.storage.put(data._id, data)
			return data
		})
		// remove
		this.router.delete('/:path/:id', async (request) => {
			return await this.state.storage.delete(request.params.id)
		})
	}
	async fetch(request) {
		const res = await this.router.handle(request)
		return new Response(JSON.stringify(res), {
			headers: {
				'content-type': 'application/json;charset=UTF-8',
			},
		})
	}
}
