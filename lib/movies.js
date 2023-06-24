import { Service } from '../lib/db.js';
const dayjs = require('dayjs')

class MovieService {

    async get(month) {
        var url = `/api/movies/upcoming`
        if (month) {
            url += `?month=${month}`
        }
        console.log(`Invoking: ${url}`)
        const res = await fetch(url)
        const json = await res.json()
        if (json.content) {
            if (json.content.length == 0) {
                this.get(month + 1)
            } else {
                for (let i in json.content) {
                    // Service.put('movies', json.content[i])
                    let id = json.content[i].id
                    const res = await fetch(`/api/movies/${id}`)
                    const newData = await res.json()

                    for (let i = 0; i < newData.release_dates.results.length; i++) {
                        if (newData.release_dates.results[i].iso_3166_1 == 'US') {
                            for (let j = 0; j < newData.release_dates.results[i].release_dates.length; j++) {
                                if (newData.release_dates.results[i].release_dates[j].type == 2) {
                                    newData.limited_release_date = dayjs(newData.release_dates.results[i].release_dates[j].release_date).format('YYYY-MM-DD')
                                    newData.limited_certification = newData.release_dates.results[i].release_dates[j].certification
                                } else if (newData.release_dates.results[i].release_dates[j].type == 3) {
                                    newData.theatrical_release_date = dayjs(newData.release_dates.results[i].release_dates[j].release_date).format('YYYY-MM-DD')
                                    newData.theatrical_certification = newData.release_dates.results[i].release_dates[j].certification
                                } else if (newData.release_dates.results[i].release_dates[j].type == 4) {
                                    newData.digital_release_date = dayjs(newData.release_dates.results[i].release_dates[j].release_date).format('YYYY-MM-DD')
                                    newData.digital_certification = newData.release_dates.results[i].release_dates[j].certification
                                }
                            }
                            break
                        }
                    }
                    let oldData = await Service.getMovie(newData.id)
                    // if (oldData.id == 1135486) {
                    //     console.log('old')
                    //     console.log(oldData)
                    // }
                    if (oldData) {
                        let mergedData = {...oldData, ...newData};
                        Service.put('movies', mergedData)
                        // if (mergedData  .id == 1135486) {
                        // console.log('merged')
                        // console.log(mergedData)
                        // }
                    } else {
                        Service.put('movies', newData)
                        // if (newData.id == 1135486) {
                        // console.log('new')
                        // console.log(newData)
                        // }
                    }
                }
            }
        }
    }
}

export const MService = new MovieService()