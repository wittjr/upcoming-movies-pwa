export class Provider {
    id: string
    name: string
    logo_path: string
    ignored: boolean
    
    constructor(id, name, logo_path, ignored=false) {
        this.id = id
        this.name = name
        this.logo_path = logo_path
        this.ignored = ignored
    }

    // set ignored(ignore) {
    //     this.ignored = ignore
    // }

    // get ignored() {
    //     return this.ignored
    // }
}