declare module "post-server" {
    export type Category = 'general' | 'new-items' | 'tubulars' | 'BPS' | 'related' | 'offers'
    export interface ipost {
        _id: object
        image: string
        name: string,
        publishDate: Date,
        text: string,
        category: Category
    }
}