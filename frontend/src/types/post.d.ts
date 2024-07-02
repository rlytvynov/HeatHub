declare module "post" {
    export type Category = 'general' | 'new-items' | 'tubulars' | 'BPS' | 'related' | 'offers'
    export interface ipost {
        id: string,
        image: string
        name: string,
        publishDate: Date,
        text: string,
        category: Category
    }
}