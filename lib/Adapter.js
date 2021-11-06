import { AdapterService } from '@feathersjs/adapter-commons'
import { uuid } from '@cfworker/uuid'

export class Adapter extends AdapterService {
	constructor(options = {}) {
		super(Object.assign({ id: '_id' }, options))
	}

	get url() {
		return `https://dummy/${this.serviceName}/`
	}

	async _find(params = {}) {
		const url = new URL(this.url)
		url.search = new URLSearchParams(params.query).toString()
		const res = await this.stub.fetch(url, params)
		const data = await res.json()
		return data
	}

	async _get(id, params = {}) {
		const res = await this.stub.fetch(this.url + id)
		const data = await res.json()
		return data
	}

	async _create(data, params = {}) {
		const current = Object.assign({}, data, { [this.id]: uuid() })

		const res = await this.stub.fetch(this.url, {
			method: 'POST',
			body: JSON.stringify(current),
		})
		const body = await res.json()

		// if (params.provider == 'rest') {
		//   await this.ws.fetch('https://dummy/dispatch', {
		//     method: 'POST',
		//     body: JSON.stringify([this.serviceName, 'created', body]),
		//   })
		// }

		return body
	}

	async _remove(id, params) {
		const res = await this.stub.fetch(this.url + id, { method: 'DELETE' })

		// if (params.provider == 'rest') {
		//   await this.ws.fetch('https://dummy/dispatch', {
		//     method: 'POST',
		//     body: JSON.stringify([this.serviceName, 'removed', id]),
		//   })
		// }

		return await res.json()
	}

	async setup(app, path) {
		this.serviceName = path
		const env = app.get('env')
		this.stub = env.SERVICE.get(env.SERVICE.idFromName(path))
		// this.ws = env.SESSION.get(env.SESSION.idFromName('SESSION'))
	}
}
