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
                    // Skip movies with a runtime below the British standard for length, some future things do
                    // not have a runtime though so keep the 0s
                    if (newData.runtime < 40 && newData.runtime > 0) {
                        continue
                    }
                    let release_date_updated = false
                    for (let i = 0; i < newData.release_dates.results.length; i++) {
                        if (newData.release_dates.results[i].iso_3166_1 == 'US') {
                            // Logger.log(newData.release_dates.results[i])
                            for (let j = 0; j < newData.release_dates.results[i].release_dates.length; j++) {
                                if (newData.release_dates.results[i].release_dates[j].type == 2) {
                                    // newData.limited_release_date = dayjs(newData.release_dates.results[i].release_dates[j].release_date).format('YYYY-MM-DD')
                                    newData.limited_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                                    newData.limited_certification = newData.release_dates.results[i].release_dates[j].certification
                                    newData.limited_release_note = newData.release_dates.results[i].release_dates[j].note
                                    newData.release_date = newData.limited_release_date
                                    release_date_updated = true
                                } else if (newData.release_dates.results[i].release_dates[j].type == 3) {
                                    // newData.theatrical_release_date = dayjs(newData.release_dates.results[i].release_dates[j].release_date).format('YYYY-MM-DD')
                                    newData.theatrical_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                                    newData.theatrical_certification = newData.release_dates.results[i].release_dates[j].certification
                                    newData.theatrical_note = newData.release_dates.results[i].release_dates[j].note
                                    if (!release_date_updated) {
                                        newData.release_date = newData.theatrical_release_date
                                    }
                                } else if (newData.release_dates.results[i].release_dates[j].type == 4) {
                                    // newData.digital_release_date = dayjs(newData.release_dates.results[i].release_dates[j].release_date).format('YYYY-MM-DD')
                                    newData.digital_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                                    newData.digital_certification = newData.release_dates.results[i].release_dates[j].certification
                                    newData.digital_note = newData.release_dates.results[i].release_dates[j].note
                                }
                                // Logger.log(newData)
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
                }
            }
        }
    }

    async get_movie(id) {
        try {
            const res = await fetch(`/api/movies/${id}`)
            if (res.ok) {
                const newData = await res.json()
                let release_date_updated = false
                for (let i = 0; i < newData.release_dates.results.length; i++) {
                    if (newData.release_dates.results[i].iso_3166_1 == 'US') {
                        for (let j = 0; j < newData.release_dates.results[i].release_dates.length; j++) {
                            if (newData.release_dates.results[i].release_dates[j].type == 2) {
                                newData.limited_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                                newData.limited_certification = newData.release_dates.results[i].release_dates[j].certification
                                newData.limited_release_note = newData.release_dates.results[i].release_dates[j].note
                                newData.release_date = newData.limited_release_date
                                release_date_updated = true
                        } else if (newData.release_dates.results[i].release_dates[j].type == 3) {
                                newData.theatrical_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                                newData.theatrical_certification = newData.release_dates.results[i].release_dates[j].certification
                                newData.theatrical_note = newData.release_dates.results[i].release_dates[j].note
                                if (!release_date_updated) {
                                    newData.release_date = newData.theatrical_release_date
                                }
                        } else if (newData.release_dates.results[i].release_dates[j].type == 4) {
                                newData.digital_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                                newData.digital_certification = newData.release_dates.results[i].release_dates[j].certification
                                newData.digital_note = newData.release_dates.results[i].release_dates[j].note
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
                    Logger.log(`Response not OK ${res.ok}:${res.status}:${res.statusText}`)
                    Logger.log(res)
                    Logger.log(await res.json())    
                }
            }
        } catch (error) {
            Logger.log(`Oops ${error}`)
        }
    }

    async get_movie_watch_history_from_date(start_at) {
        Logger.log(`MovieService.get_movie_watch_history - ${start_at} - entry`)
        const response = await fetch(`/api/watched?start_at=${start_at}`)
        Logger.log(`MovieService.get_movie_watch_history - /api/watched?start_at=${start_at} response - ${response.statusText}`)
        if (!response.ok) {
            throw new Error('API Issue')
        }
        const data = await response.json()
        for (let i = 0; i < data.length; i++) {
            // Logger.log(data[i].movie.title)
            // Logger.log(data[i].movie.ids)
            const movie = await DatabaseService.getMovie(data[i].movie.ids.tmdb)
            if (movie) {
                // Logger.log(movie)
                movie.watched = 1
                DatabaseService.put('movies', movie)
                // Logger.log(await DatabaseService.getMovie(data[i].movie.ids.tmdb))    
            }
        }
    }

    async get_movie_watch_history() {
        Logger.log('MovieService.get_movie_watch_history - entry')
        const response = await fetch(`/api/watched`)
        Logger.log(`MovieService.get_movie_watch_history - /api/watched response - ${response.statusText}`)
        if (!response.ok) {
            throw new Error('API Issue')
        }
        const data = await response.json()
        Logger.log(data)
        // const currentWatchList = await DatabaseService.getMovieWatchlist()
        // Logger.log(currentWatchList)
        // for (let i = 0; i < data.length; i++) {
        //     const response = await fetch(`/api/movies/${data[i].movie.ids.tmdb}`)
        //     if (!response.ok) {
        //         throw new Error('API Issue')
        //     }
        //     const newData = await response.json();
        //     for (let i = 0; i < newData.release_dates.results.length; i++) {
        //         if (newData.release_dates.results[i].iso_3166_1 == 'US') {
        //             for (let j = 0; j < newData.release_dates.results[i].release_dates.length; j++) {
        //                 if (newData.release_dates.results[i].release_dates[j].type == 2) {
        //                     newData.limited_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
        //                     newData.limited_certification = newData.release_dates.results[i].release_dates[j].certification
        //                 } else if (newData.release_dates.results[i].release_dates[j].type == 3) {
        //                     newData.theatrical_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
        //                     newData.theatrical_certification = newData.release_dates.results[i].release_dates[j].certification
        //                 } else if (newData.release_dates.results[i].release_dates[j].type == 4) {
        //                     newData.digital_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
        //                     newData.digital_certification = newData.release_dates.results[i].release_dates[j].certification
        //                 }
        //             }
        //             break
        //         }
        //     }
        //     newData.watchlist = 1
        //     let oldData = await DatabaseService.getMovie(newData.id)
        //     if (currentWatchList.indexOf(newData.id) > -1) {
        //         currentWatchList.splice(currentWatchList.indexOf(newData.id), 1)
        //     }
        //     if (oldData) {
        //         let mergedData = { ...oldData, ...newData };
        //         DatabaseService.put('movies', mergedData)
        //     } else {
        //         DatabaseService.put('movies', newData)
        //     }
        // }
        // for (let i=0; i<currentWatchList.length; i++) {
        //     let movie = await DatabaseService.getMovie(currentWatchList[i])
        //     movie.watchlist = 0
        //     DatabaseService.put('movies', movie)
        // }
    }

    async get_movie_watch_list() {
        Logger.log('MovieService.get_movie_watch_list - entry')
        const response = await fetch(`/api/watchlist`)
        Logger.log(`MovieService.get_movie_watch_list - /api/watchlist response - ${response.statusText}`)
        if (!response.ok) {
            throw new Error('API Issue')
        }
        const data = await response.json()
        // Logger.log(data)
        const currentWatchList = await DatabaseService.getMovieWatchlist()
        // Logger.log(currentWatchList)
        for (let i = 0; i < data.length; i++) {
            const response = await fetch(`/api/movies/${data[i].movie.ids.tmdb}`)
            if (!response.ok) {
                throw new Error('API Issue')
            }
            const newData = await response.json();
            // Logger.log(newData)
            for (let i = 0; i < newData.release_dates.results.length; i++) {
                if (newData.release_dates.results[i].iso_3166_1 == 'US') {
                    for (let j = 0; j < newData.release_dates.results[i].release_dates.length; j++) {
                        // Types 1=Premiere, 2=Theatrical(Limited), 3=Theatrical, 4=Digital, 5=Physical, 6=TV
                        if (newData.release_dates.results[i].release_dates[j].type == 2) {
                            newData.limited_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                            newData.limited_certification = newData.release_dates.results[i].release_dates[j].certification
                            let releaseWindow = Math.abs(dayjs().diff(newData.limited_release_date, 'day'))
                            if (releaseWindow <= 30) {
                                newData.release_status=0
                            } else if (dayjs().isSameOrBefore(dayjs(newData.limited_release_date))) {
                                    newData.release_status=1
                            } else {
                                newData.release_status=-1
                            }
                        } else if (newData.release_dates.results[i].release_dates[j].type == 3) {
                            newData.theatrical_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                            newData.theatrical_certification = newData.release_dates.results[i].release_dates[j].certification
                            let releaseWindow = Math.abs(dayjs().diff(newData.theatrical_release_date, 'day'))
                            if (releaseWindow <= 30) {
                                // Logger.log(`Theatrical`)
                                // Logger.log(`Title: ${newData.title}`)
                                // Logger.log(`Date: ${newData.theatrical_release_date}`)
                                // Logger.log(`Diff: ${Math.abs(dayjs().diff(newData.theatrical_release_date, 'day'))}`)
                                newData.release_status=0
                            } else if (dayjs().isSameOrBefore(dayjs(newData.theatrical_release_date))) {
                                newData.release_status=1
                            } else {
                                newData.release_status=-1
                            }
                        } else if (newData.release_dates.results[i].release_dates[j].type == 4) {
                            newData.digital_release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                            newData.digital_certification = newData.release_dates.results[i].release_dates[j].certification
                            if (dayjs().isAfter(dayjs(newData.digital_release_date))) {
                                newData.release_status=-1
                            }
                        } else if (newData.release_dates.results[i].release_dates[j].type == 5 || newData.release_dates.results[i].release_dates[j].type == 6) {
                            let release_date = newData.release_dates.results[i].release_dates[j].release_date.split('T')[0]
                            if (dayjs().isAfter(dayjs(release_date))) {
                                newData.release_status=-1
                            }
                        }
                    }
                    break
                }
            }
            newData.watchlist = 1
            let oldData = await DatabaseService.getMovie(newData.id)
            if (currentWatchList.indexOf(newData.id) > -1) {
                currentWatchList.splice(currentWatchList.indexOf(newData.id), 1)
            }
            if (oldData) {
                let mergedData = { ...oldData, ...newData };
                DatabaseService.put('movies', mergedData)
            } else {
                DatabaseService.put('movies', newData)
            }
        }
        for (let i=0; i<currentWatchList.length; i++) {
            let movie = await DatabaseService.getMovie(currentWatchList[i])
            movie.watchlist = 0
            DatabaseService.put('movies', movie)
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