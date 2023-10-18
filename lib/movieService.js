import { DatabaseService } from '@lib/dbService.js'
import { Logger } from '@lib/clientLogger.js'
const dayjs = require('dayjs')

class ServiceMovies {

    async get(month) {
        var url = `/api/movies/upcoming`
        if (month) {
            url += `?month=${month}`
        }
        Logger.log(`Invoking: ${url}`)
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
                                    // newData.limited_release_date = dayjs(newData.release_dates.results[i].release_dates[j].release_date).format('YYYY-MM-DD')
                                    newData.limited_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                                    newData.limited_certification = newData.release_dates.results[i].release_dates[j].certification
                                } else if (newData.release_dates.results[i].release_dates[j].type == 3) {
                                    // newData.theatrical_release_date = dayjs(newData.release_dates.results[i].release_dates[j].release_date).format('YYYY-MM-DD')
                                    newData.theatrical_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                                    newData.theatrical_certification = newData.release_dates.results[i].release_dates[j].certification
                                } else if (newData.release_dates.results[i].release_dates[j].type == 4) {
                                    // newData.digital_release_date = dayjs(newData.release_dates.results[i].release_dates[j].release_date).format('YYYY-MM-DD')
                                    newData.digital_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                                    newData.digital_certification = newData.release_dates.results[i].release_dates[j].certification
                                }
                                // console.log(newData)
                            }
                            break
                        }
                    }
                    let oldData = await DatabaseService.getMovie(newData.id)
                    // if (oldData.id == 1135486) {
                    //     console.log('old')
                    //     console.log(oldData)
                    // }
                    if (oldData) {
                        let mergedData = { ...oldData, ...newData };
                        DatabaseService.put('movies', mergedData)
                        // if (mergedData  .id == 1135486) {
                        // console.log('merged')
                        // console.log(mergedData)
                        // }
                    } else {
                        DatabaseService.put('movies', newData)
                        // if (newData.id == 1135486) {
                        // console.log('new')
                        // console.log(newData)
                        // }
                    }
                }
            }
        }
    }

    async get_movie(id) {
        try {
            const res = await fetch(`/api/movies/${id}`)
            if (res.ok) {
                const newData = await res.json()
                for (let i = 0; i < newData.release_dates.results.length; i++) {
                    if (newData.release_dates.results[i].iso_3166_1 == 'US') {
                        for (let j = 0; j < newData.release_dates.results[i].release_dates.length; j++) {
                            if (newData.release_dates.results[i].release_dates[j].type == 2) {
                                newData.limited_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                                newData.limited_certification = newData.release_dates.results[i].release_dates[j].certification
                            } else if (newData.release_dates.results[i].release_dates[j].type == 3) {
                                newData.theatrical_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                                newData.theatrical_certification = newData.release_dates.results[i].release_dates[j].certification
                            } else if (newData.release_dates.results[i].release_dates[j].type == 4) {
                                newData.digital_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                                newData.digital_certification = newData.release_dates.results[i].release_dates[j].certification
                            }
                        }
                        break
                    }
                }
                let oldData = await DatabaseService.getMovie(newData.id)
                if (oldData) {
                    let mergedData = { ...oldData, ...newData };
                    DatabaseService.put('movies', mergedData)
                } else {
                    DatabaseService.put('movies', newData)
                }
            } else {
                if (res.status == 404) {
                    Logger.log(`ERROR: movie ID ${id} was not found, removing from database`)
                    DatabaseService.delete('movies', id)
                } else {
                    console.log(`Response not OK ${res.ok}:${res.status}:${res.statusText}`)
                    console.log(res)
                    console.log(await res.json())    
                }
            }
        } catch (error) {
            Logger.log(`Oops ${error}`)
        }
    }

    async get_movie_watch_list() {
        const response = await fetch(`/api/lists`)
        if (!response.ok) {
            throw new Error('API Issue')
        }
        const data = await response.json()
        // const movies = []
        for (let i = 0; i < data.length; i++) {
            const response = await fetch(`/api/movies/${data[i].movie.ids.tmdb}`)
            if (!response.ok) {
                throw new Error('API Issue')
            }
            const newData = await response.json();
            for (let i = 0; i < newData.release_dates.results.length; i++) {
                if (newData.release_dates.results[i].iso_3166_1 == 'US') {
                    for (let j = 0; j < newData.release_dates.results[i].release_dates.length; j++) {
                        if (newData.release_dates.results[i].release_dates[j].type == 2) {
                            newData.limited_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                            newData.limited_certification = newData.release_dates.results[i].release_dates[j].certification
                        } else if (newData.release_dates.results[i].release_dates[j].type == 3) {
                            newData.theatrical_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                            newData.theatrical_certification = newData.release_dates.results[i].release_dates[j].certification
                        } else if (newData.release_dates.results[i].release_dates[j].type == 4) {
                            newData.digital_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                            newData.digital_certification = newData.release_dates.results[i].release_dates[j].certification
                        }
                    }
                    break
                }
            }
            newData.watchlist = 1
            let oldData = await DatabaseService.getMovie(newData.id)
            if (oldData) {
                let mergedData = { ...oldData, ...newData };
                DatabaseService.put('movies', mergedData)
            } else {
                DatabaseService.put('movies', newData)
            }
        }
    }

    async resync_movie_watch_list() {
        await DatabaseService.clearMovieWatchlist()
        MovieService.get_movie_watch_list()
    }

    async refresh_movies() {
        let keys = await DatabaseService.getAllMovieIDs()
        keys.map((key) => {
            MovieService.get_movie(key)
        })
    }
}

export const MovieService = new ServiceMovies()